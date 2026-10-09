export interface HotelDto {
  id: number;
  name: string;
  destination: string;
  stars: number;
  boardType: string;
  pricePerNight: number;
  currency: string;
  availableRooms: number;
  rating?: number;
  imageUrl?: string;
}

export interface FlightDto {
  id: number;
  flightNumber: string;
  airline: string;
  departurePort: string;
  arrivalPort: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  isDirect: boolean;
  price: number;
  currency: string;
  flightClass?: string;
  baggageKg?: number;
}

export interface ReservationDto {
  pnrCode: string;
  guestName: string;
  type?: string | number;
  detailsSummary: string;
  totalAmount: number;
  currency: string;
  status: string;
  createdAt: string;
}

export interface AgentChatResponseDto {
  message?: string;
  foundHotels?: HotelDto[];
  foundFlights?: FlightDto[];
  reservation?: ReservationDto;
}

export interface DashboardMetricsDto {
  totalReservations: number;
  totalRevenueEur: number;
  totalPromptTokens: number;
  totalCompletionTokens: number;
  estimatedAiCostUsd: number;
}

export interface DayItinerary {
  day: number;
  title: string;
  locations: string[];
}

// Eski isimlendirmelerle çağrılan yerler varsa tam geriye dönük uyumluluk:
export type Hotel = HotelDto;
export type Flight = FlightDto;
export type Reservation = ReservationDto;
export type DashboardMetrics = DashboardMetricsDto;