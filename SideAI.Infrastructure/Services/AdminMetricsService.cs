using SideAI.Application.Common.Interfaces;
using SideAI.Application.DTOs;

namespace SideAI.Infrastructure.Services;

public class AdminMetricsService : IAdminMetricsService
{
    private static int _promptTokens = 0;
    private static int _completionTokens = 0;
    private static readonly List<ReservationDto> _reservations = new();
    private static readonly object _lock = new();

    private const decimal CostPerMillionTokensUsd = 0.15m;

    public void TrackTokens(int promptTokens, int completionTokens)
    {
        lock (_lock)
        {
            _promptTokens += promptTokens;
            _completionTokens += completionTokens;
        }
    }

    public void TrackReservation(ReservationDto reservation)
    {
        lock (_lock)
        {
            _reservations.Insert(0, reservation);
        }
    }

    public AdminDashboardDto GetDashboardMetrics()
    {
        lock (_lock)
        {
            var totalTokens = _promptTokens + _completionTokens;
            var estimatedCost = (totalTokens / 1_000_000m) * CostPerMillionTokensUsd;

            return new AdminDashboardDto
            {
                TotalReservations = _reservations.Count,
                TotalRevenueEur = _reservations.Sum(r => r.TotalAmount),
                TotalPromptTokens = _promptTokens,
                TotalCompletionTokens = _completionTokens,
                EstimatedAiCostUsd = Math.Round(estimatedCost, 4),
                RecentReservations = _reservations.Take(10).ToList()
            };
        }
    }
}