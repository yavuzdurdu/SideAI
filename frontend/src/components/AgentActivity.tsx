import React from 'react';
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';

interface AgentActivityProps {
  steps: { label: string; status: 'completed' | 'loading' | 'pending' }[];
}

export const AgentActivity: React.FC<AgentActivityProps> = ({ steps }) => {
  return (
    <div className="p-3.5 rounded-2xl bg-[#0D1B2A]/90 border border-slate-800 text-xs mb-3">
      <div className="flex items-center gap-2 mb-2 font-semibold text-slate-200">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        Agent İşlem Aşamaları
      </div>
      <div className="space-y-1.5">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {step.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
            {step.status === 'loading' && <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin shrink-0" />}
            {step.status === 'pending' && <span className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0 inline-block" />}
            <span className={step.status === 'loading' ? 'text-cyan-300 font-medium' : step.status === 'completed' ? 'text-slate-300' : 'text-slate-500'}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};