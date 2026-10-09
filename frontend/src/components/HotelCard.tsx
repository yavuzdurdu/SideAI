import React from 'react';
import type { HotelDto } from '../types';
import { Star, MapPin, Check, Sparkles } from 'lucide-react';

interface Props {
  hotel: HotelDto;
  onBook: (hotel: HotelDto) => void;
}

export const HotelCard: React.FC<Props> = ({ hotel, onBook }) => {
  const h = hotel as any;
  const hotelLocation = h.city || h.location || 'Akdeniz';
  const hotelConcept = h.concept || 'Her Şey Dahil';
  const hotelRating = h.rating || 4.8;
  const hotelPrice = h.pricePerNight || h.price || 90;

  return (
    <div className="group relative rounded-3xl bg-[#0D1B2A]/70 border border-slate-800/80 hover:border-cyan-500/40 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/10 backdrop-blur-md flex flex-col justify-between overflow-hidden">
      {/* Görsel Alanı */}
      <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-3 bg-slate-900">
        <img
          src={h.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'}
          alt={h.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07111F] via-transparent to-transparent opacity-80" />

        {/* Puan Rozeti */}
        <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/70 border border-white/10 backdrop-blur-md text-amber-400 text-[11px] font-bold">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{hotelRating}</span>
        </div>

        {/* Konsept Rozeti */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-blue-600/80 border border-blue-400/30 backdrop-blur-md text-white text-[10px] font-semibold tracking-wide">
          {hotelConcept}
        </div>

        {/* Konum */}
        <div className="absolute bottom-2.5 left-3 flex items-center gap-1 text-[11px] text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          <span className="truncate max-w-[200px]">{hotelLocation}</span>
        </div>
      </div>

      {/* Otel Bilgisi */}
      <div>
        <h4 className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1">
          {h.name}
        </h4>
        <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <Check className="w-3 h-3" /> Ücretsiz İptal
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <Sparkles className="w-3 h-3 text-cyan-400" /> Anında Teyit
          </span>
        </div>
      </div>

      {/* Fiyat ve Buton */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Gecelik</span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-white">{hotelPrice} €</span>
            <span className="text-[10px] text-slate-400">/ oda</span>
          </div>
        </div>

        <button
          onClick={() => onBook(hotel)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
        >
          Rezerve Et
        </button>
      </div>
    </div>
  );
};