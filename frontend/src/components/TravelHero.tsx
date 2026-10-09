import React, { useState } from 'react';
import { Search, Sparkles, Hotel, Plane, Zap, Map } from 'lucide-react';

interface TravelHeroProps {
  onSearch: (prompt: string) => void;
  isLoading: boolean;
}

export const TravelHero: React.FC<TravelHeroProps> = ({ onSearch, isLoading }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onSearch(prompt);
    setPrompt('');
  };

  const quickActions = [
    { label: 'Otel Bul', icon: Hotel, prompt: "Kapadokya bölgesindeki lüks butik otelleri listele" },
    { label: 'Uçuş Ara', icon: Plane, prompt: "İstanbul'dan Belgrad'a uygun uçuşları listele" },
    { label: 'Hızlı Rezervasyon', icon: Zap, prompt: "Grand Palace Hotel için Yavuz Baki adına 2 gece rezervasyon yap" },
    { label: 'Seyahat Planı', icon: Map, prompt: "Roma için 3 günlük tarihi ve gastronomi odaklı seyahat rotası hazırla" }
  ];

  return (
    <div className="relative py-8 md:py-10 px-4 rounded-3xl bg-gradient-to-b from-[#0D1B2A]/80 to-[#07111F] border border-slate-800/80 mb-8 overflow-hidden shadow-2xl">
      <div className="relative max-w-3xl mx-auto text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/70 text-blue-400 border border-blue-800/40 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Akıllı Seyahat Deneyimi
        </span>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight leading-tight mb-2">
          Hayalindeki seyahati <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">yapay zeka</span> planlasın.
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mb-6">
          Otelini bul, uçuşunu seç ve rezervasyonunu saniyeler içinde oluştur.
        </p>

        <form onSubmit={handleSubmit} className="relative flex items-center mb-5">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Örn: Roma'da 3 günlük tatil planla veya Kapadokya otellerini listele..."
              disabled={isLoading}
              className="w-full pl-11 pr-24 py-3.5 bg-[#07111F]/90 border border-slate-700/80 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs shadow-xl transition"
            />
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl text-xs font-semibold shadow-lg transition disabled:opacity-50"
            >
              {isLoading ? 'Analiz...' : 'Planla'}
            </button>
          </div>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => onSearch(action.prompt)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D1B2A] hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition"
            >
              <action.icon className="w-3.5 h-3.5 text-cyan-400" />
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};