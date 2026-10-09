import React from 'react';
import { Compass } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#07111F]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
        {/* Tek Parça Logo */}
        <div 
          className="flex items-center cursor-pointer select-none py-1 transition-opacity hover:opacity-90" 
          onClick={() => window.location.reload()}
        >
          <img 
            src="/sideai-logo-A-rota.svg" 
            alt="SideAI" 
            className="h-10 sm:h-11 w-auto object-contain"
          />
        </div>

        {/* Sağ Taraf: Yeni Arama Butonu */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 transition"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Yeni Arama</span>
          </button>
        </div>
      </div>
    </header>
  );
};