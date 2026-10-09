import React from 'react';
import { MapPin, Compass } from 'lucide-react';
import type { DayItinerary } from '../types';

interface TravelPlanProps {
  destination: string;
  days: DayItinerary[];
}

export const TravelPlan: React.FC<TravelPlanProps> = ({ destination, days }) => {
  return (
    <div className="p-4 rounded-3xl bg-[#0D1B2A] border border-slate-800 mb-5">
      <div className="flex items-center gap-2 mb-3">
        <Compass className="w-4 h-4 text-cyan-400" />
        <div>
          <h3 className="font-bold text-slate-100 text-xs tracking-tight">{destination} Seyahat Planı</h3>
          <span className="text-[10px] text-slate-400">Yapay Zeka Tarafından Önerilen Rota</span>
        </div>
      </div>

      <div className="relative border-l border-slate-800 ml-2.5 space-y-3">
        {days.map((item) => (
          <div key={item.day} className="relative pl-5">
            <span className="absolute -left-1.5 top-0.5 w-3 h-3 rounded-full bg-blue-600 border-2 border-[#0D1B2A]" />
            <div className="text-[11px] font-bold text-blue-400 mb-1">
              GÜN {item.day} • {item.title}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {item.locations.map((loc, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-800/80 text-[10px] text-slate-300 border border-slate-700/50">
                  <MapPin className="w-2.5 h-2.5 text-cyan-400" /> {loc}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};