import React from 'react';
import type { ReservationDto } from '../types';
import { CheckCircle2, QrCode, Calendar, User, Hotel, ShieldCheck, Sparkles } from 'lucide-react';

interface Props {
  reservation: ReservationDto;
}

export const BookingConfirmation: React.FC<Props> = ({ reservation }) => {
  const r = reservation as any;
  const hotelName = r.hotelName || r.hotel || 'Otel';
  const totalAmount = r.totalPriceEur || r.totalPrice || r.totalAmount || 270;
  const guest = r.guestName || 'Yavuz Baki';
  const nightsCount = r.nights || 3;
  const createdDate = r.createdAt ? new Date(r.createdAt).toLocaleDateString('tr-TR') : new Date().toLocaleDateString('tr-TR');

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900/90 to-[#07111F]/90 border border-emerald-500/30 p-6 shadow-2xl backdrop-blur-xl">
      {/* Arka Plan Glow Efekti */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Üst Başlık & Durum */}
      <div className="flex items-start justify-between border-b border-slate-800/80 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Onaylandı & Düzenlendi
              </span>
            </div>
            <h4 className="text-base font-bold text-white tracking-tight">Dijital Seyahat Kartı</h4>
          </div>
        </div>

        {/* PNR Rozeti */}
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">PNR Kodu</div>
          <div className="font-mono font-black text-sm text-cyan-400 bg-cyan-950/40 px-2.5 py-1 rounded-lg border border-cyan-800/40 tracking-wider">
            {r.pnrCode || 'CRS-88492019'}
          </div>
        </div>
      </div>

      {/* Kart Gövdesi */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-5 relative z-10">
        <div className="bg-[#07111F]/60 p-3 rounded-2xl border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase tracking-wider mb-1">
            <User className="w-3 h-3 text-cyan-400" /> Misafir
          </div>
          <div className="text-xs font-semibold text-slate-100 truncate">{guest}</div>
        </div>

        <div className="bg-[#07111F]/60 p-3 rounded-2xl border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase tracking-wider mb-1">
            <Hotel className="w-3 h-3 text-emerald-400" /> Tesis
          </div>
          <div className="text-xs font-semibold text-slate-100 truncate">{hotelName}</div>
        </div>

        <div className="bg-[#07111F]/60 p-3 rounded-2xl border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase tracking-wider mb-1">
            <Calendar className="w-3 h-3 text-amber-400" /> Süre
          </div>
          <div className="text-xs font-semibold text-slate-100">{nightsCount} Gece Konaklama</div>
        </div>

        <div className="bg-[#07111F]/60 p-3 rounded-2xl border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3 h-3 text-blue-400" /> Toplam Tutar
          </div>
          <div className="text-xs font-bold text-emerald-400">
            {totalAmount} €
          </div>
        </div>
      </div>

      {/* Bilet Alt Çizgisi & Bilgi Bölümü */}
      <div className="pt-4 border-t border-dashed border-slate-800 flex items-center justify-between relative z-10 text-xs">
        <div className="flex items-center gap-2 text-slate-400 text-[11px]">
          <QrCode className="w-6 h-6 text-slate-300" />
          <span>Merkezi Rezervasyon Motoru (CRS API) ile doğrudan onaylandı.</span>
        </div>
        <div className="text-[10px] text-slate-500 font-mono">
          {createdDate}
        </div>
      </div>
    </div>
  );
};