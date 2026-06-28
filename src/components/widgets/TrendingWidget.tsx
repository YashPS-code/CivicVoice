import React from "react";
import { TrendingUp, Flame } from "lucide-react";
import { TrendingTopic } from "../../types";

interface TrendingWidgetProps {
  topics: TrendingTopic[];
  city: string;
  onSelectTag: (tag: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  potholes: "text-amber-600 bg-amber-50",
  streetlights: "text-yellow-600 bg-yellow-50",
  water_leakage: "text-blue-600 bg-blue-50",
  garbage: "text-emerald-600 bg-emerald-50",
  pollution: "text-teal-600 bg-teal-50",
  traffic: "text-indigo-600 bg-indigo-50",
  others: "text-slate-600 bg-slate-50",
};

export default function TrendingWidget({ topics, city, onSelectTag }: TrendingWidgetProps) {
  return (
    <div className="rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 bg-gradient-to-r from-twitter-light to-cyan-50 border-b border-slate-200 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-twitter-blue" />
        <h3 className="font-display font-bold text-sm text-slate-800">
          Trending in {city}
        </h3>
      </div>

      <div className="flex flex-col divide-y divide-slate-100">
        {topics.map((topic, idx) => {
          const colorClass = CATEGORY_COLORS[topic.category] || "text-slate-600 bg-slate-50";
          return (
            <button
              key={topic.id}
              onClick={() => onSelectTag(topic.tag)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition text-left group"
            >
              <span className="text-xs font-black text-slate-300 w-4 shrink-0">{idx + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide ${colorClass}`}>
                    {topic.category.replace("_", " ")}
                  </span>
                  {topic.postCount > 1000 && <Flame className="w-3 h-3 text-orange-400" />}
                </div>
                <p className="text-xs font-bold text-slate-700 group-hover:text-twitter-blue transition truncate">
                  {topic.tag}
                </p>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                {topic.postCount.toLocaleString()}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
