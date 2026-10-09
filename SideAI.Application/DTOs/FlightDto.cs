namespace SideAI.Application.DTOs;

public class FlightDto
{
    public int Id { get; set; }
    public string FlightNumber { get; set; } = string.Empty;
    public string Airline { get; set; } = string.Empty;
    public string DeparturePort { get; set; } = string.Empty;
    public string ArrivalPort { get; set; } = string.Empty;
    public string DepartureTime { get; set; } = string.Empty;
    public string ArrivalTime { get; set; } = string.Empty;
    public string Duration { get; set; } = string.Empty;
    public bool IsDirect { get; set; } = true;
    public decimal Price { get; set; }
    public string Currency { get; set; } = "EUR";
    public string FlightClass { get; set; } = "BASIC";
    public int BaggageKg { get; set; } = 15;
}