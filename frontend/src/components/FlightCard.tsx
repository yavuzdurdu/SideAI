import React from 'react';
import { Plane, Luggage } from 'lucide-react';
import type { FlightDto } from '../types';

interface FlightCardProps {
  flight: FlightDto;
  onSelect: (flight: FlightDto) => void;
}

export const FlightCard: React.FC<FlightCardProps> = ({ flight, onSelect }) => {
  return (
    <div className="p-3.5 rounded-2xl bg-[#0D1B2A] border border-slate-800 hover:border-slate-700 transition flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-cyan-400 border border-slate-700 text-xs">
          {flight.airline.slice(0, 3).toUpperCase()}
        </div>
        <div>
          <h4 className="font-semibold text-slate-100">{flight.airline}</h4>
          <span className="text-[11px] text-slate-400">{flight.flightNumber}</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-5 w-full md:w-auto">
        <div className="text-center">
          <div className="font-bold text-sm text-slate-100">{flight.departureTime}</div>
          <div className="text-[11px] text-slate-400">{flight.departurePort}</div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[10px] text-slate-400 mb-0.5">{flight.duration}</span>
          <div className="flex items-center gap-1 w-20">
            <div className="h-0.5 bg-slate-700 flex-1" />
            <Plane className="w-3 h-3 text-cyan-400 rotate-90" />
            <div className="h-0.5 bg-slate-700 flex-1" />
          </div>
          <span className="text-[9px] text-emerald-400 mt-0.5">{flight.isDirect ? 'Direkt' : 'Aktarmalı'}</span>
        </div>

        <div className="text-center">
          <div className="font-bold text-sm text-slate-100">{flight.arrivalTime}</div>
          <div className="text-[11px] text-slate-400">{flight.arrivalPort}</div>
        </div>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto border-t md:border-t-0 pt-2 md:pt-0 border-slate-800">
        <div className="text-left md:text-right">
          <div className="text-sm font-bold text-slate-100">{flight.price} {flight.currency}</div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <Luggage className="w-3 h-3" /> {(flight as any).baggageKg || 15} kg
          </div>
        </div>
        <button
          onClick={() => onSelect(flight)}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition"
        >
          Seç
        </button>
      </div>
    </div>
  );
};