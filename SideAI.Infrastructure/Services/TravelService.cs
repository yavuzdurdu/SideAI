using SideAI.Application.Common.Interfaces;
using SideAI.Application.DTOs;
using SideAI.Domain.Entities;

namespace SideAI.Infrastructure.Services;

public class TravelService : ITravelService
{
    private static readonly List<HotelDto> _hotels = new()
    {
        new HotelDto { Id = 101, Name = "Side Star Resort", Destination = "Side", Stars = 5, BoardType = "Ultra All Inclusive", PricePerNight = 85, Currency = "EUR", AvailableRooms = 4, Rating = 4.8, ImageUrl = "https://images.unsplash.com/photo-1566073771259-6a8506099945" },
        new HotelDto { Id = 102, Name = "Melihotel Kemer", Destination = "Kemer", Stars = 4, BoardType = "All Inclusive", PricePerNight = 60, Currency = "EUR", AvailableRooms = 3, Rating = 4.5, ImageUrl = "https://images.unsplash.com/photo-1582719508461-905c673771fd" },
        new HotelDto { Id = 103, Name = "Antalya Sun Palace", Destination = "Antalya", Stars = 5, BoardType = "All Inclusive", PricePerNight = 75, Currency = "EUR", AvailableRooms = 2, Rating = 4.6, ImageUrl = "https://images.unsplash.com/photo-1571896349842-33c89424de2d" },
        new HotelDto { Id = 104, Name = "Side Crown Serenity", Destination = "Side", Stars = 5, BoardType = "Ultra All Inclusive", PricePerNight = 90, Currency = "EUR", AvailableRooms = 5, Rating = 4.9, ImageUrl = "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4" }
    };

    private static readonly List<FlightDto> _flights = new()
    {
        new FlightDto { Id = 201, FlightNumber = "VF3046", Airline = "AJet", DeparturePort = "SAW", ArrivalPort = "AYT", DepartureTime = "00:40", ArrivalTime = "02:05", Duration = "1s 25dk", IsDirect = true, Price = 24.12m, Currency = "EUR", FlightClass = "BASIC", BaggageKg = 15 },
        new FlightDto { Id = 202, FlightNumber = "PC2012", Airline = "Pegasus", DeparturePort = "SAW", ArrivalPort = "AYT", DepartureTime = "06:15", ArrivalTime = "07:35", Duration = "1s 20dk", IsDirect = true, Price = 32.50m, Currency = "EUR", FlightClass = "FLEX", BaggageKg = 20 },
        new FlightDto { Id = 203, FlightNumber = "TK2410", Airline = "THY", DeparturePort = "IST", ArrivalPort = "AYT", DepartureTime = "09:30", ArrivalTime = "10:50", Duration = "1s 20dk", IsDirect = true, Price = 45.00m, Currency = "EUR", FlightClass = "FLEX", BaggageKg = 20 }
    };

    public Task<List<HotelDto>> SearchHotelsAsync(string destination, decimal? maxPrice, int? stars)
    {
        var query = _hotels.AsQueryable();

        if (!string.IsNullOrWhiteSpace(destination))
            query = query.Where(h => h.Destination.Contains(destination, StringComparison.OrdinalIgnoreCase));

        if (maxPrice.HasValue && maxPrice > 0)
            query = query.Where(h => h.PricePerNight <= maxPrice.Value);

        if (stars.HasValue && stars > 0)
            query = query.Where(h => h.Stars >= stars.Value);

        return Task.FromResult(query.ToList());
    }

    public Task<List<FlightDto>> SearchFlightsAsync(string departurePort, string arrivalPort)
    {
        var query = _flights.AsQueryable();

        if (!string.IsNullOrWhiteSpace(departurePort))
            query = query.Where(f => f.DeparturePort.Equals(departurePort, StringComparison.OrdinalIgnoreCase));

        if (!string.IsNullOrWhiteSpace(arrivalPort))
            query = query.Where(f => f.ArrivalPort.Equals(arrivalPort, StringComparison.OrdinalIgnoreCase));

        return Task.FromResult(query.ToList());
    }

    public Task<ReservationDto> CreateHotelReservationAsync(int hotelId, string guestName, int nights)
    {
        var hotel = _hotels.FirstOrDefault(h => h.Id == hotelId) ?? _hotels.First();
        var pnr = "CRS-" + Guid.NewGuid().ToString("N")[..8].ToUpper();
        var total = hotel.PricePerNight * nights;

        var dto = new ReservationDto
        {
            PnrCode = pnr,
            GuestName = guestName,
            Type = ReservationType.Hotel,
            DetailsSummary = $"{hotel.Name} ({hotel.Destination}) - {nights} Gece - {hotel.BoardType}",
            TotalAmount = total,
            Currency = hotel.Currency,
            Status = "Confirmed",
            CreatedAt = DateTime.UtcNow
        };

        return Task.FromResult(dto);
    }

    public Task<ReservationDto> CreatePackageReservationAsync(int hotelId, int flightId, string guestName, int nights)
    {
        var hotel = _hotels.FirstOrDefault(h => h.Id == hotelId) ?? _hotels.First();
        var flight = _flights.FirstOrDefault(f => f.Id == flightId) ?? _flights.First();
        var pnr = "PKG-" + Guid.NewGuid().ToString("N")[..8].ToUpper();
        var total = (hotel.PricePerNight * nights) + flight.Price;

        var dto = new ReservationDto
        {
            PnrCode = pnr,
            GuestName = guestName,
            Type = ReservationType.TravelPackage,
            DetailsSummary = $"Dinamik Paket: {hotel.Name} ({nights} Gece) + {flight.Airline} ({flight.DeparturePort}->{flight.ArrivalPort})",
            TotalAmount = total,
            Currency = "EUR",
            Status = "Confirmed",
            CreatedAt = DateTime.UtcNow
        };

        return Task.FromResult(dto);
    }
}