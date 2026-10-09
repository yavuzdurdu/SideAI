namespace SideAI.Domain.Entities;

public enum ReservationType
{
    Hotel,
    Flight,
    TravelPackage // Dinamik Paket (Otel + Uçuş)
}

public class Reservation
{
    public int Id { get; set; }
    public string PnrCode { get; set; } = string.Empty; // Örn: TV-019F8A3A-C
    public string GuestName { get; set; } = string.Empty;
    public string GuestEmail { get; set; } = string.Empty;
    public ReservationType Type { get; set; }

    public int? HotelId { get; set; }
    public Hotel? Hotel { get; set; }
    public int? FlightId { get; set; }
    public Flight? Flight { get; set; }

    public DateTime CheckInDate { get; set; }
    public DateTime? CheckOutDate { get; set; }
    public int Nights { get; set; }
    public decimal TotalAmount { get; set; }
    public string Currency { get; set; } = "EUR";
    public string Status { get; set; } = "Confirmed"; // Confirmed, Pending, Cancelled
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}