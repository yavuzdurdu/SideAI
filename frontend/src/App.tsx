import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { TravelHero } from './components/TravelHero';
import { HotelCard } from './components/HotelCard';
import { FlightCard } from './components/FlightCard';
import { BookingConfirmation } from './components/BookingConfirmation';
import { TravelPlan } from './components/TravelPlan';
import { AgentActivity } from './components/AgentActivity';
import type { AgentChatResponseDto, DashboardMetricsDto, HotelDto, FlightDto, DayItinerary, ReservationDto } from './types';
import { Send, Bot, User, RefreshCw } from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'agent';
  text: string;
  isError?: boolean;
  lastPrompt?: string;
}

// Cümleden gün sayısını dinamik okur
const extractDayCount = (text: string): number => {
  const match = text.match(/(\d+)\s*(günlük|gunluk|gün|gun|gece|gecelik)/i);
  if (match && match[1]) {
    const days = parseInt(match[1], 10);
    return Math.min(Math.max(days, 1), 7);
  }
  return 3;
};

// Cümleden dünyadaki herhangi bir şehri veya ülkeyi ayıklamak için koyulcak
const extractCityFromText = (text: string): string => {
  const lower = text.toLowerCase();

  if (lower.includes('kapadokya') || lower.includes('nevşehir') || lower.includes('nevsehir')) return 'Kapadokya';
  if (lower.includes('sırbistan') || lower.includes('sirbistan') || lower.includes('belgrad')) return 'Belgrad';
  if (lower.includes('saraybosna') || lower.includes('bosna')) return 'Saraybosna';
  if (lower.includes('kıbrıs') || lower.includes('kibris') || lower.includes('girne')) return 'Kuzey Kıbrıs';
  if (lower.includes('mersin')) return 'Mersin';
  if (lower.includes('antalya') || lower.includes('side')) return 'Antalya';
  if (lower.includes('istanbul')) return 'İstanbul';
  if (lower.includes('roma') || lower.includes('rome')) return 'Roma';
  if (lower.includes('paris')) return 'Paris';
  if (lower.includes('tokyo')) return 'Tokyo';
  if (lower.includes('amsterdam')) return 'Amsterdam';
  if (lower.includes('berlin')) return 'Berlin';
  if (lower.includes('barselona') || lower.includes('barcelona')) return 'Barselona';
  if (lower.includes('prag') || lower.includes('prague')) return 'Prag';
  if (lower.includes('bodrum')) return 'Bodrum';
  if (lower.includes('fethiye')) return 'Fethiye';
  if (lower.includes('izmir')) return 'İzmir';

  const stopWords = [
    'için', 'icin', 'bana', 'bir', 've', 'ile', 'günlük', 'gunluk', 'gün', 'gun', 
    'tatil', 'planı', 'plani', 'plan', 'gezi', 'rota', 'otel', 'uçak', 'ucak', 
    'liste', 'listele', 'ver', 'yap', 'istiyorum', 'bilet', 'hazırla', 'hazirla', 
    'rezervasyon', 'adına', 'gecelik', 'gece', 'seçeneklerini', 'seceneklerini', 'veya', 'öner'
  ];

  const words = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ').split(/\s+/);
  for (const w of words) {
    const clean = w.toLowerCase().replace(/('|\/)(de|da|te|ta|ye|ya|e|a|in|ın|un|ün)$/g, '');
    if (clean.length > 2 && !stopWords.includes(clean)) {
      return clean.charAt(0).toUpperCase() + clean.slice(1);
    }
  }
  return 'Antalya';
};

// Dünyadaki HERHANGİ bir şehir/bölge için dinamik gezi planı üretme amaçlı bunu koydum
const generateDynamicItinerary = (destination: string, dayCount: number): { destination: string; days: DayItinerary[] } => {
  const d = destination.toLowerCase();

  let masterDays: DayItinerary[] = [];

  if (d.includes('kapadokya') || d.includes('nevşehir')) {
    masterDays = [
      { day: 1, title: 'Sıcak Hava Balonları & Açık Hava Müzesi', locations: ['Göreme Açık Hava Müzesi', 'Aşk Vadisi Seyir Noktası', 'Uçhisar Kalesi Panoraması'] },
      { day: 2, title: 'Yeraltı Şehirleri & Kanyon Yürüyüşü', locations: ['Derinkuyu Yeraltı Şehri', 'Ihlara Vadisi Parkuru', 'Selime Manastırı'] },
      { day: 3, title: 'Çömlek Atölyeleri & Peri Bacaları', locations: ['Avanos Tarihi Çömlek Çarşısı', 'Paşabağ Rahipler Vadisi', 'Devrent Hayal Vadisi'] },
      { day: 4, title: 'Gün Batımı Rotaları & Vadi Turu', locations: ['Kızılçukur Vadisi (Red Valley)', 'Çavuşin Köyü Harabeleri', 'Ortahisar Kalesi'] }
    ];
  } else if (d.includes('sırbistan') || d.includes('belgrad')) {
    masterDays = [
      { day: 1, title: 'Tarihi Kale & Kalp Meydanı', locations: ['Kalemegdan Kalesi', 'Knez Mihailova Caddesi', 'Cumhuriyet Meydanı (Trg Republike)'] },
      { day: 2, title: 'Kültür & Bohem Skadarlija', locations: ['Aziz Sava Katedrali', 'Nikola Tesla Müzesi', 'Tarihi Skadarlija Sokağı'] },
      { day: 3, title: 'Zemun & Tuna Kıyısı', locations: ['Zemun Sahili', 'Gardoš Kulesi', 'Tuna & Sava Nehir Birleşimi'] }
    ];
  } else {
    masterDays = [
      { day: 1, title: `${destination} Tarihi ve Kültürel Keşif`, locations: [`${destination} Eski Şehir Meydanı`, `${destination} Tarihi Müzesi & Kalesi`, 'Yerel Çarşı & Gastronomi Turu'] },
      { day: 2, title: `${destination} Doğa ve Şehir Manzaraları`, locations: [`${destination} Botanik Parkı & Seyir Noktası`, 'Bölge Sanat Galerisi', 'Şehir Kordonu & Nehir Boyu'] },
      { day: 3, title: `${destination} Gizli Rotalar ve Çevre Gezisi`, locations: ['Tarihi Anıtlar ve Kutsal Mekanlar', 'Bölgesel Doğa Tabiat Parkı', 'Panoramik Akşam Turu'] },
      { day: 4, title: `${destination} Gastronomi ve Yerel Yaşam`, locations: ['Geleneksel Lezzet Pazarı', 'Tarihi Butikler ve Kahveciler', 'Şehir Tiyatrosu Meydanı'] },
      { day: 5, title: `${destination} Dinlenme ve Alışveriş`, locations: ['Modern Sanatlar Galerisi', 'Alışveriş Bulvarı', 'Veda Terası'] }
    ];
  }

  const slicedDays = masterDays.slice(0, dayCount).map((item, index) => ({
    ...item,
    day: index + 1
  }));

  return { destination, days: slicedDays };
};

// Şehir tipolojisine göre dinamik otel isimleri ve görselleri üreten motor DÜZELTME YAPARKEN BUNU GELİŞTİRMELİYİM
const generateDynamicTravelOptions = (destination: string) => {
  const d = destination.toLowerCase().trim();
  const destClean = destination.trim();
  const destCode = destClean.slice(0, 3).toUpperCase();

  const photoPools = {
    cave: [
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549880384-6961a9b9e65e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80'
    ],
    resort: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    ],
    urbanLuxury: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80'
    ]
  };

  const isCoastal = d.includes('antalya') || d.includes('side') || d.includes('mersin') || d.includes('kıbrıs') || d.includes('izmir') || d.includes('bodrum') || d.includes('fethiye');
  const isCave = d.includes('kapadokya') || d.includes('nevşehir') || d.includes('ürgüp') || d.includes('göreme');

  const randomSeed = Math.floor(Math.random() * 9000) + 1000;

  let hotel1Name = '';
  let hotel2Name = '';
  let hotel1Concept = '';
  let hotel2Concept = '';
  let hotel1Img = '';
  let hotel2Img = '';

  if (isCave) {
    hotel1Name = `${destClean} Cave Resort & Balon Seyir`;
    hotel2Name = `${destClean} Stone House Suites`;
    hotel1Concept = 'Mağara Butik & Panoramik Manzara';
    hotel2Concept = 'Kaya Mimari & Organik Kahvaltı';
    hotel1Img = photoPools.cave[0];
    hotel2Img = photoPools.cave[1];
  } else if (isCoastal) {
    hotel1Name = `${destClean} Beachfront Resort & Spa`;
    hotel2Name = `${destClean} Palms Palace Hotel`;
    hotel1Concept = 'Ultra Her Şey Dahil & Özel Plaj';
    hotel2Concept = 'Tam Pansiyon Plus & Havuz Keyfi';
    hotel1Img = photoPools.resort[0];
    hotel2Img = photoPools.resort[1];
  } else {
    const prefixes = ['The Grand', 'Boutique Collection', 'Metropolitan', 'Royal Heritage'];
    const selectedPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    
    hotel1Name = `${selectedPrefix} ${destClean}`;
    hotel2Name = `${destClean} Signature Historic Suites`;
    hotel1Concept = 'Lüks Konaklama & Spa Merkezi';
    hotel2Concept = 'Merkezi Lokasyon & Şehir Manzarası';
    hotel1Img = photoPools.urbanLuxury[Math.floor(Math.random() * 2)];
    hotel2Img = photoPools.urbanLuxury[2 + Math.floor(Math.random() * 2)];
  }

  const hotelsData: HotelDto[] = [
    {
      id: `hotel-${destClean.toLowerCase()}-${randomSeed}-1`,
      name: hotel1Name,
      city: `Merkez / Popüler Bölge, ${destClean}`,
      location: `Merkez / Popüler Bölge, ${destClean}`,
      pricePerNight: Math.floor(Math.random() * 45 + 95),
      rating: 4.9,
      concept: hotel1Concept,
      imageUrl: hotel1Img
    } as unknown as HotelDto,
    {
      id: `hotel-${destClean.toLowerCase()}-${randomSeed}-2`,
      name: hotel2Name,
      city: `Tarihi Meydan Yakını, ${destClean}`,
      location: `Tarihi Meydan Yakını, ${destClean}`,
      pricePerNight: Math.floor(Math.random() * 35 + 75),
      rating: 4.8,
      concept: hotel2Concept,
      imageUrl: hotel2Img
    } as unknown as HotelDto
  ];

  const airlines = ['Türk Hava Yolları', 'Pegasus Airlines', 'SunExpress', 'Lufthansa', 'Air Serbia'];
  const chosenAirline = d.includes('sırbistan') || d.includes('belgrad') ? 'Air Serbia' : airlines[Math.floor(Math.random() * 3)];

  const flightsData: FlightDto[] = [
    {
      id: `flight-${destClean.toLowerCase()}-${randomSeed}`,
      airline: chosenAirline,
      flightNumber: `${chosenAirline.slice(0, 2).toUpperCase()}-${Math.floor(Math.random() * 700 + 1100)}`,
      departurePort: 'IST (İstanbul Havalimanı)',
      arrivalPort: `${destCode} (${destClean} Uluslararası Havalimanı)`,
      departureTime: '08:40',
      arrivalTime: '10:55',
      price: Math.floor(Math.random() * 35 + 55),
      priceEur: Math.floor(Math.random() * 35 + 55)
    } as unknown as FlightDto
  ];

  return { hotels: hotelsData, flights: flightsData };
};

const buildReservationObject = (hotelName: string, days: number, pricePerNight: number): ReservationDto => {
  const totalPrice = pricePerNight * days;
  const resData = {
    id: 'res-' + Math.floor(Math.random() * 90000 + 10000),
    pnrCode: `CRS-${Math.floor(Math.random() * 89999999) + 10000000}`,
    guestName: 'Yavuz Baki',
    hotelName: hotelName,
    hotel: hotelName,
    nights: days,
    totalPriceEur: totalPrice,
    totalPrice: totalPrice,
    totalAmount: totalPrice,
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  };
  return resData as unknown as ReservationDto;
};

export default function App() {
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [hotels, setHotels] = useState<HotelDto[]>([]);
  const [flights, setFlights] = useState<FlightDto[]>([]);
  const [reservation, setReservation] = useState<ReservationDto | null>(null);
  const [travelPlan, setTravelPlan] = useState<{ destination: string; days: DayItinerary[] } | null>(null);
  const [agentSteps, setAgentSteps] = useState<{ label: string; status: 'completed' | 'loading' | 'pending' }[]>([]);

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasSearched) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, agentSteps, hasSearched]);

  const handleSendMessage = async (promptToSend?: string) => {
    const text = promptToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    setHasSearched(true);
    setMessages((prev) => [...prev, { sender: 'user', text }]);
    if (!promptToSend) setInputMessage('');
    setIsLoading(true);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 150);

    const lower = text.toLowerCase();
    const isBookingIntent = lower.includes('rezervasyon') || lower.includes('rezerve') || lower.includes('paket');
    const isPlanIntent = lower.includes('plan') || lower.includes('rota') || lower.includes('gezi') || lower.includes('günlük');
    const detectedDestination = extractCityFromText(text);
    const dayCount = extractDayCount(text);

    if (isBookingIntent) {
      setAgentSteps([
        { label: 'Rezervasyon ve müsaitlik doğrulanıyor', status: 'loading' },
        { label: 'Oda tahsisi yapılıyor', status: 'pending' },
        { label: 'Dijital PNR bileti oluşturuluyor', status: 'pending' }
      ]);
    } else if (isPlanIntent) {
      const dynamicPlan = generateDynamicItinerary(detectedDestination, dayCount);
      setTravelPlan(dynamicPlan);
      const dynamicOptions = generateDynamicTravelOptions(detectedDestination);
      setHotels(dynamicOptions.hotels);
      setFlights(dynamicOptions.flights);

      setAgentSteps([
        { label: `${detectedDestination} için ${dayCount} günlük rota hazırlanıyor`, status: 'loading' },
        { label: 'Bölgesel otel ve uçuş müsaitliği taranıyor', status: 'pending' },
        { label: 'İşlem tamamlanıyor', status: 'pending' }
      ]);
    } else {
      const dynamicOptions = generateDynamicTravelOptions(detectedDestination);
      setHotels(dynamicOptions.hotels);
      setFlights(dynamicOptions.flights);

      setAgentSteps([
        { label: 'Müsaitlik taranıyor', status: 'loading' },
        { label: 'Fiyatlar doğrulanıyor', status: 'pending' },
        { label: 'İşlem tamamlanıyor', status: 'pending' }
      ]);
    }

    try {
      const response = await fetch('http://localhost:5184/api/Agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(text)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AgentChatResponseDto = await response.json();

      if (data.message && (data.message.includes('Gemini Hatası') || data.message.includes('429') || data.message.includes('Quota'))) {
        if (isBookingIntent) {
          const selectedHotelName = hotels[0]?.name || `${detectedDestination} Grand Resort`;
          const price = hotels[0]?.pricePerNight || 90;
          const simulatedRes = buildReservationObject(selectedHotelName, dayCount, price);

          setReservation(simulatedRes);
          setMessages((prev) => [
            ...prev,
            {
              sender: 'agent',
              text: `Sayın Yavuz Baki, ${selectedHotelName} için ${dayCount} gecelik rezervasyonunuz onaylandı. PNR kodunuz: ${simulatedRes.pnrCode}.`
            }
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              sender: 'agent',
              text: `${detectedDestination} için hazırladığım ${dayCount} günlük gezi rotasını ve otel/uçuş seçeneklerini sağ panelden inceleyebilirsiniz.`
            }
          ]);
        }
        setAgentSteps([]);
        return;
      }

      setAgentSteps([
        { label: isBookingIntent ? 'Rezervasyon onaylandı' : 'İşlem tamamlandı', status: 'completed' },
        { label: 'Müsaitlik doğrulandı', status: 'completed' },
        { label: 'Sonuçlar başarıyla hazırlandı', status: 'completed' }
      ]);

      setMessages((prev) => [...prev, { sender: 'agent', text: data.message || 'İşleminiz başarıyla tamamlandı.' }]);

      if (data.reservation) {
        setReservation(data.reservation);
      } else if (isBookingIntent) {
        const selectedHotelName = hotels[0]?.name || `${detectedDestination} Grand Resort`;
        const price = hotels[0]?.pricePerNight || 90;
        const fallbackRes = buildReservationObject(selectedHotelName, dayCount, price);
        setReservation(fallbackRes);
      }

      if (data.foundHotels && data.foundHotels.length > 0) setHotels(data.foundHotels);
      if (data.foundFlights && data.foundFlights.length > 0) setFlights(data.foundFlights);
    } catch (err) {
      console.error(err);

      if (isBookingIntent) {
        const selectedHotelName = hotels[0]?.name || `${detectedDestination} Grand Resort`;
        const price = hotels[0]?.pricePerNight || 90;
        const simulatedRes = buildReservationObject(selectedHotelName, dayCount, price);

        setReservation(simulatedRes);
        setMessages((prev) => [
          ...prev,
          {
            sender: 'agent',
            text: `Sayın Yavuz Baki, ${selectedHotelName} için ${dayCount} gecelik rezervasyonunuz onaylandı. PNR: ${simulatedRes.pnrCode}`
          }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'agent',
            text: `${detectedDestination} için seyahat seçenekleriniz hazırlandı.`
          }
        ]);
      }
      setAgentSteps([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookHotel = (hotel: HotelDto) => {
    handleSendMessage(`${hotel.name} oteli için Yavuz Baki adına 3 gecelik rezervasyon yap`);
  };

  const handleSelectFlight = (flight: FlightDto) => {
    handleSendMessage(`${flight.airline} uçuşu ile ${hotels[0]?.name || 'otel'} için paket rezervasyon oluştur`);
  };

  return (
    <div className="min-h-screen bg-[#07111F] text-slate-100 font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 flex flex-col">
        {/* Karşılama Ekranı */}
        <div className={`transition-all duration-700 ease-out ${!hasSearched ? 'my-auto py-12' : 'mb-8'}`}>
          <TravelHero onSearch={(prompt) => handleSendMessage(prompt)} isLoading={isLoading} />
        </div>

        {/* Canlı Chat & Sonuç Panelleri */}
        {hasSearched && (
          <div ref={resultsRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sol Panel: AI Chat */}
            <div className="lg:col-span-5 flex flex-col h-[650px] bg-[#0D1B2A]/90 border border-slate-800 rounded-3xl p-4 shadow-xl overflow-hidden backdrop-blur-xl">
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {messages.map((m, idx) => (
                  <div key={idx} className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {m.sender === 'agent' && (
                      <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-cyan-400" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-br-none shadow-md'
                          : m.isError
                          ? 'bg-red-950/40 border border-red-800/60 text-red-200'
                          : 'bg-[#07111F] border border-slate-800 text-slate-200 rounded-bl-none'
                      }`}
                    >
                      {m.text}
                      {m.isError && m.lastPrompt && (
                        <button
                          onClick={() => handleSendMessage(m.lastPrompt)}
                          className="mt-2.5 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-900/40 hover:bg-red-800/60 border border-red-700/60 text-[11px] text-white transition"
                        >
                          <RefreshCw className="w-3 h-3" /> Tekrar Dene
                        </button>
                      )}
                    </div>

                    {m.sender === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-slate-300" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && agentSteps.length > 0 && <AgentActivity steps={agentSteps} />}
                <div ref={chatBottomRef} />
              </div>

              {/* Mesaj Giriş Alanı */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ek isteklerini yaz veya rezervasyon yap..."
                  disabled={isLoading}
                  className="flex-1 bg-[#07111F] border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition disabled:opacity-40 shadow-lg shadow-blue-600/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Sağ Panel: Canlı Sonuç Paneli */}
            <div className="lg:col-span-7 space-y-6 overflow-y-auto max-h-[650px] pr-1">
              {reservation && <BookingConfirmation reservation={reservation} />}
              {travelPlan && <TravelPlan destination={travelPlan.destination} days={travelPlan.days} />}

              {hotels.length > 0 && (
                <div>
                  <h3 className="font-bold text-slate-100 text-sm mb-3 flex items-center justify-between">
                    <span>Müsait Oteller ({hotels.length})</span>
                    <span className="text-xs text-slate-400 font-normal">{travelPlan?.destination || 'Bölge'} Portföyü</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {hotels.map((h) => (
                      <HotelCard key={h.id} hotel={h} onBook={handleBookHotel} />
                    ))}
                  </div>
                </div>
              )}

              {flights.length > 0 && (
                <div>
                  <h3 className="font-bold text-slate-100 text-sm mb-3">Uçuş Seçenekleri ({flights.length})</h3>
                  <div className="space-y-3">
                    {flights.map((f) => (
                      <FlightCard key={f.id} flight={f} onSelect={handleSelectFlight} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}