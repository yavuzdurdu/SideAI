using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using SideAI.Application.Common.Interfaces;
using SideAI.Application.DTOs;
using SideAI.Domain.Entities;

namespace SideAI.Infrastructure.Services;

public class GeminiAgentService : IAgentService
{
    private readonly HttpClient _httpClient;
    private readonly ITravelService _travelService;
    private readonly IAdminMetricsService _metricsService;
    private readonly string _apiKey;
    private const string ModelName = "gemini-2.5-flash";

    public GeminiAgentService(
        HttpClient httpClient,
        ITravelService travelService,
        IAdminMetricsService metricsService,
        IConfiguration configuration)
    {
        _httpClient = httpClient;
        _travelService = travelService;
        _metricsService = metricsService;
        _apiKey = configuration["Gemini:ApiKey"] ?? string.Empty;
    }

    public async Task<AgentChatResponseDto> ProcessPromptAsync(string prompt)
    {
        var responseDto = new AgentChatResponseDto();
        var requestUrl = $"https://generativelanguage.googleapis.com/v1beta/models/{ModelName}:generateContent?key={_apiKey}";

        var requestBody = new
        {
            contents = new[]
            {
                new
                {
                    role = "user",
                    parts = new object[]
                    {
                        new { text = prompt }
                    }
                }
            },
            tools = new[]
            {
                new
                {
                    functionDeclarations = new object[]
                    {
                        new
                        {
                            name = "SearchHotels",
                            description = "Belirli bir bölge veya kriterlere göre müsait otelleri listeler.",
                            parameters = new
                            {
                                type = "OBJECT",
                                properties = new
                                {
                                    destination = new { type = "STRING", description = "Şehir veya bölge adı (Örn: Antalya, Kapadokya, Roma)" },
                                    minStars = new { type = "INTEGER", description = "Minimum yıldız sayısı" },
                                    maxPrice = new { type = "NUMBER", description = "Maksimum gecelik bütçe" }
                                }
                            }
                        },
                        new
                        {
                            name = "SearchFlights",
                            description = "Belirli kalkış ve varış noktalarına göre uçuşları sorgular.",
                            parameters = new
                            {
                                type = "OBJECT",
                                properties = new
                                {
                                    departure = new { type = "STRING", description = "Kalkış havalimanı veya şehri (Örn: SAW, IST, İstanbul)" },
                                    arrival = new { type = "STRING", description = "Varış havalimanı veya şehri (Örn: AYT, Antalya, BEG)" }
                                }
                            }
                        },
                        new
                        {
                            name = "CreateHotelReservation",
                            description = "Seçilen otel için rezervasyon oluşturur. Otel ID biliniyorsa doğrudan hotelId, bilinmiyorsa hotelName verilebilir.",
                            parameters = new
                            {
                                type = "OBJECT",
                                properties = new
                                {
                                    hotelId = new { type = "INTEGER", description = "Otel ID numarası (varsa)" },
                                    hotelName = new { type = "STRING", description = "Otel adı veya adının bir kısmı (örn: Grand Hotel)" },
                                    guestName = new { type = "STRING", description = "Misafir adı soyadı" },
                                    nights = new { type = "INTEGER", description = "Konaklama gece sayısı" }
                                },
                                required = new[] { "guestName", "nights" }
                            }
                        },
                        new
                        {
                            name = "CreatePackageReservation",
                            description = "Seçilen otel ve uçuşu birleştirerek dinamik paket rezervasyonu oluşturur. ID'ler doğrudan verilebilir veya isim/havayolu adı belirtilebilir.",
                            parameters = new
                            {
                                type = "OBJECT",
                                properties = new
                                {
                                    hotelId = new { type = "INTEGER", description = "Otel ID numarası (varsa)" },
                                    hotelName = new { type = "STRING", description = "Otel adı (örn: Grand Hotel)" },
                                    flightId = new { type = "INTEGER", description = "Uçuş ID numarası (varsa)" },
                                    airlineName = new { type = "STRING", description = "Havayolu adı veya uçuş numarası (örn: Pegasus, THY, VF3046)" },
                                    guestName = new { type = "STRING", description = "Misafir adı soyadı" },
                                    nights = new { type = "INTEGER", description = "Konaklama gece sayısı" }
                                },
                                required = new[] { "guestName", "nights" }
                            }
                        }
                    }
                }
            }
        };

        var httpResponse = await _httpClient.PostAsJsonAsync(requestUrl, requestBody);
        var responseString = await httpResponse.Content.ReadAsStringAsync();

        if (!httpResponse.IsSuccessStatusCode)
        {
            responseDto.Message = $"Gemini Hatası: {responseString}";
            return responseDto;
        }

        using var doc = JsonDocument.Parse(responseString);
        var root = doc.RootElement;

        // Metrik takibi
        if (root.TryGetProperty("usageMetadata", out var usage))
        {
            int pTokens = usage.TryGetProperty("promptTokenCount", out var pt) ? pt.GetInt32() : 0;
            int cTokens = usage.TryGetProperty("candidatesTokenCount", out var ct) ? ct.GetInt32() : 0;
            _metricsService.TrackTokens(pTokens, cTokens);
        }

        if (root.TryGetProperty("candidates", out var candidates) && candidates.GetArrayLength() > 0)
        {
            var firstCandidate = candidates[0];
            var parts = firstCandidate.GetProperty("content").GetProperty("parts");

            foreach (var part in parts.EnumerateArray())
            {
                if (part.TryGetProperty("text", out var textProp))
                {
                    responseDto.Message += textProp.GetString();
                }

                if (part.TryGetProperty("functionCall", out var functionCall))
                {
                    var functionName = functionCall.GetProperty("name").GetString();
                    var args = functionCall.GetProperty("args");

                    await ExecuteFunctionCallAsync(functionName, args, responseDto);
                }
            }
        }

        if (string.IsNullOrWhiteSpace(responseDto.Message))
        {
            responseDto.Message = "İşlem başarıyla tamamlandı.";
        }

        return responseDto;
    }

    private async Task ExecuteFunctionCallAsync(string? functionName, JsonElement args, AgentChatResponseDto responseDto)
    {
        switch (functionName)
        {
            case "SearchHotels":
                string? dest = args.TryGetProperty("destination", out var d) ? d.GetString() : null;
                int? stars = args.TryGetProperty("minStars", out var s) ? s.GetInt32() : null;
                decimal? maxPrice = args.TryGetProperty("maxPrice", out var p) ? p.GetDecimal() : null;

                var hotels = await _travelService.SearchHotelsAsync(dest ?? string.Empty, maxPrice, stars);
                responseDto.FoundHotels = hotels;
                break;

            case "SearchFlights":
                string? dep = args.TryGetProperty("departure", out var dp) ? dp.GetString() : null;
                string? arr = args.TryGetProperty("arrival", out var ar) ? ar.GetString() : null;

                var flights = await _travelService.SearchFlightsAsync(dep ?? string.Empty, arr ?? string.Empty);
                responseDto.FoundFlights = flights;
                break;

            case "CreateHotelReservation":
                int resolvedHotelId = await ResolveHotelIdAsync(args);
                string gName = args.TryGetProperty("guestName", out var gn) ? (gn.GetString() ?? "Misafir") : "Misafir";
                int nights = args.TryGetProperty("nights", out var n) ? n.GetInt32() : 1;

                var hRes = await _travelService.CreateHotelReservationAsync(resolvedHotelId, gName, nights);
                if (hRes != null)
                {
                    responseDto.Reservation = hRes;
                    _metricsService.TrackReservation(hRes);
                }
                break;

            case "CreatePackageReservation":
                int pkgHotelId = await ResolveHotelIdAsync(args);
                int pkgFlightId = await ResolveFlightIdAsync(args);
                string pkgGuest = args.TryGetProperty("guestName", out var pgn) ? (pgn.GetString() ?? "Misafir") : "Misafir";
                int pkgNights = args.TryGetProperty("nights", out var pn) ? pn.GetInt32() : 1;

                var pkgRes = await _travelService.CreatePackageReservationAsync(pkgHotelId, pkgFlightId, pkgGuest, pkgNights);
                if (pkgRes != null)
                {
                    responseDto.Reservation = pkgRes;
                    _metricsService.TrackReservation(pkgRes);
                }
                break;
        }
    }

    private async Task<int> ResolveHotelIdAsync(JsonElement args)
    {
        if (args.TryGetProperty("hotelId", out var hIdProp) && hIdProp.GetInt32() > 0)
        {
            return hIdProp.GetInt32();
        }

        if (args.TryGetProperty("hotelName", out var nameProp))
        {
            var searchName = nameProp.GetString() ?? string.Empty;
            var allHotels = await _travelService.SearchHotelsAsync(string.Empty, null, null);
            var match = allHotels.FirstOrDefault(h => h.Name.Contains(searchName, StringComparison.OrdinalIgnoreCase));
            if (match != null) return match.Id;
        }

        return 101; // Varsayılan fallback ID
    }

    private async Task<int> ResolveFlightIdAsync(JsonElement args)
    {
        if (args.TryGetProperty("flightId", out var fIdProp) && fIdProp.GetInt32() > 0)
        {
            return fIdProp.GetInt32();
        }

        if (args.TryGetProperty("airlineName", out var airProp))
        {
            var searchAir = airProp.GetString() ?? string.Empty;
            var allFlights = await _travelService.SearchFlightsAsync(string.Empty, string.Empty);
            var match = allFlights.FirstOrDefault(f => 
                f.Airline.Contains(searchAir, StringComparison.OrdinalIgnoreCase) || 
                f.FlightNumber.Contains(searchAir, StringComparison.OrdinalIgnoreCase));
            if (match != null) return match.Id;
        }

        return 201; // Varsayılan fallback ID
    }
}