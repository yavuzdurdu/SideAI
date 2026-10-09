using SideAI.Domain.Entities;

namespace SideAI.Application.DTOs;

public class ReservationDto
{
    public string PnrCode { get; set; } = string.Empty;
    public string GuestName { get; set; } = string.Empty;
    public ReservationType Type { get; set; }
    public string DetailsSummary { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public string Currency { get; set; } = "EUR";
    public string Status { get; set; } = "Confirmed";
    public DateTime CreatedAt { get; set; }
}

public class AgentChatResponseDto
{
    public string Message { get; set; } = string.Empty;
    public List<HotelDto> FoundHotels { get; set; } = new();
    public List<FlightDto> FoundFlights { get; set; } = new();
    public ReservationDto? Reservation { get; set; }
}