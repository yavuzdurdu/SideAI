using SideAI.Application.DTOs;

namespace SideAI.Application.Common.Interfaces;

public interface IAdminMetricsService
{
    void TrackTokens(int promptTokens, int completionTokens);
    void TrackReservation(ReservationDto reservation);
    AdminDashboardDto GetDashboardMetrics();
}