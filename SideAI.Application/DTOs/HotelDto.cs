namespace SideAI.Application.DTOs;

public class HotelDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public int Stars { get; set; }
    public string BoardType { get; set; } = string.Empty;
    public decimal PricePerNight { get; set; }
    public string Currency { get; set; } = "EUR";
    public int AvailableRooms { get; set; }
    public double Rating { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
}