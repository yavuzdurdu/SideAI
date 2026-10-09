namespace SideAI.Domain.Entities;

public class Flight
{
    public int Id { get; set; }
    public string FlightNumber { get; set; } = string.Empty; // Örn: VF3046
    public string Airline { get; set; } = string.Empty; // AJet, Pegasus, THY
    public string DeparturePort { get; set; } = string.Empty; // SAW, IST
    public string ArrivalPort { get; set; } = string.Empty; // AYT
    public string DepartureTime { get; set; } = string.Empty; // 00:40
    public string ArrivalTime { get; set; } = string.Empty; // 02:05
    public string Duration { get; set; } = string.Empty; // 1s 25dk
    public bool IsDirect { get; set; } = true;
    public decimal Price { get; set; }
    public string Currency { get; set; } = "EUR";
    public string FlightClass { get; set; } = "BASIC"; // BASIC, FLEX
    public int BaggageKg { get; set; } = 15;
}