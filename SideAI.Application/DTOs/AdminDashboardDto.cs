namespace SideAI.Application.DTOs;

public class AdminDashboardDto
{
    public int TotalReservations { get; set; }
    public decimal TotalRevenueEur { get; set; }
    public int TotalPromptTokens { get; set; }
    public int TotalCompletionTokens { get; set; }
    public int TotalTokens => TotalPromptTokens + TotalCompletionTokens;
    public decimal EstimatedAiCostUsd { get; set; }
    public List<ReservationDto> RecentReservations { get; set; } = new();
}