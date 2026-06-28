import React from "react";
import { ShieldCheck } from "lucide-react";

interface VerifyWidgetProps {
  onVerify: () => void;
}

export default function VerifyWidget({ onVerify }: VerifyWidgetProps) {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 relative overflow-hidden">
      {/* Background watermark */}
      <div className="absolute -right-3 -bottom-3 opacity-[0.07]">
        <ShieldCheck className="w-24 h-24 text-emerald-800" />
      </div>

      <div className="flex items-center gap-1.5 mb-2">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
        <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider">
          Trust Layer
        </span>
      </div>

      <h4 className="font-display font-bold text-sm text-slate-800 leading-tight mb-1">
        Verify residency, unlock 2× vote power
      </h4>
      <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
        Verified Resident badges give your reports double priority and build community trust.
      </p>

      <button
        onClick={onVerify}
        className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition active:scale-95"
      >
        Claim Resident Badge
      </button>
    </div>
  );
}
