import React from "react";
import { Brain, ChevronRight, TrendingUp } from "lucide-react";
import { City } from "../../types";
import { CITY_DASHBOARDS } from "../../data/dashboard";

interface InsightsWidgetProps {
  city: City;
  onOpenDashboard: () => void;
}

export default function InsightsWidget({ city, onOpenDashboard }: InsightsWidgetProps) {
  const data = CITY_DASHBOARDS[city];
  const topInsight = data.aiInsights[0];
  if (!topInsight) return null;

  const severityColor = {
    critical: "text-red-600 bg-red-50 border-red-200",
    warning:  "text-amber-600 bg-amber-50 border-amber-200",
    info:     "text-twitter-blue bg-twitter-light border-twitter-blue/20",
  }[topInsight.severity];

  return (
    <div className="flex flex-col gap-3 p-4 rounded-2xl border border-slate-100 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-black text-slate-700">
          <Brain className="w-3.5 h-3.5 text-violet-500" />
          AI Civic Insights
        </div>
        <button onClick={onOpenDashboard}
          className="text-[10px] font-bold text-twitter-blue hover:underline flex items-center gap-0.5">
          All <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Top insight card */}
      <div className={`p-3 rounded-xl border text-left ${severityColor}`}>
        <div className="flex items-start gap-2">
          <span className="text-base shrink-0">{topInsight.emoji}</span>
          <div>
            <p className="text-[11px] font-bold leading-snug">{topInsight.title}</p>
            <p className="text-[10px] mt-0.5 opacity-80 leading-relaxed line-clamp-2">{topInsight.description}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-current/10">
          <span className="text-[9px] font-bold opacity-60">Gemini AI · {topInsight.confidence}% confidence</span>
          {topInsight.ward && <span className="text-[9px] font-bold opacity-70">📍 {topInsight.ward}</span>}
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-0 divide-x divide-slate-100">
        <div className="flex-1 text-center">
          <p className="font-black text-sm text-twitter-blue">{data.aiInsights.length}</p>
          <p className="text-[9px] text-slate-400 font-semibold">Alerts</p>
        </div>
        <div className="flex-1 text-center">
          <p className="font-black text-sm text-emerald-600">{data.resolutionRate}%</p>
          <p className="text-[9px] text-slate-400 font-semibold">Resolved</p>
        </div>
        <div className="flex-1 text-center flex items-center justify-center gap-0.5">
          <TrendingUp className="w-3 h-3 text-violet-500" />
          <p className="font-black text-sm text-violet-600">{data.reportsToday}</p>
          <p className="text-[9px] text-slate-400 font-semibold ml-0.5">today</p>
        </div>
      </div>
    </div>
  );
}
