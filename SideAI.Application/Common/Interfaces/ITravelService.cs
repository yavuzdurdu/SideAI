using SideAI.Application.DTOs;

namespace SideAI.Application.Common.Interfaces;

public interface ITravelService
{
    Task<List<HotelDto>> SearchHotelsAsync(string destination, decimal? maxPrice, int? stars);
    Task<List<FlightDto>> SearchFlightsAsync(string departurePort, string arrivalPort);
    Task<ReservationDto> CreateHotelReservationAsync(int hotelId, string guestName, int nights);
    Task<ReservationDto> CreatePackageReservationAsync(int hotelId, int flightId, string guestName, int nights);
}