namespace SideAI.Domain.Entities;

public class Hotel
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty; // Side, Kemer, Antalya
    public int Stars { get; set; } // 4, 5
    public string BoardType { get; set; } = string.Empty; // All Inclusive, Ultra All Inclusive, Bed & Breakfast
    public decimal PricePerNight { get; set; }
    public string Currency { get; set; } = "EUR";
    public int AvailableRooms { get; set; }
    public double Rating { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
}