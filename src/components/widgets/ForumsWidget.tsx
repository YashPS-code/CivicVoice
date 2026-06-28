import React from "react";
import { MessageSquare, Users, Flame, ArrowRight } from "lucide-react";
import { Forum } from "../../data/forums";

interface ForumsWidgetProps {
  forums: Forum[];
  city: string;
  onOpenForums: () => void;
}

export default function ForumsWidget({ forums, city, onOpenForums }: ForumsWidgetProps) {
  const cityForums = forums.filter((f) => f.city === city).slice(0, 4);

  return (
    <div className="rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 bg-gradient-to-r from-twitter-light to-cyan-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-twitter-blue" />
          <h3 className="font-display font-bold text-sm text-slate-800">Popular Forums</h3>
        </div>
        <button
          onClick={onOpenForums}
          className="text-[10px] font-bold text-twitter-blue hover:text-twitter-hover flex items-center gap-0.5 transition"
        >
          See all <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="flex flex-col divide-y divide-slate-100">
        {cityForums.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">
            No forums for {city} yet.
          </p>
        ) : (
          cityForums.map((forum) => (
            <button
              key={forum.id}
              onClick={onOpenForums}
              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition text-left group"
            >
              {/* Emoji avatar */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-twitter-light to-cyan-100 border border-twitter-blue/20 flex items-center justify-center text-lg shrink-0">
                {forum.emoji}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p className="text-xs font-bold text-slate-700 group-hover:text-twitter-blue transition truncate">
                    {forum.name}
                  </p>
                  {forum.isHot && <Flame className="w-3 h-3 text-orange-400 shrink-0" />}
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                  <span className="flex items-center gap-0.5">
                    <Users className="w-2.5 h-2.5" />
                    {forum.members.toLocaleString()}
                  </span>
                  <span>·</span>
                  <span>{forum.postsToday} posts today</span>
                </div>
              </div>

              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                forum.category === "Emergency"
                  ? "bg-red-50 text-red-600"
                  : forum.category === "Environment"
                  ? "bg-emerald-50 text-emerald-600"
                  : forum.category === "Traffic"
                  ? "bg-indigo-50 text-indigo-600"
                  : "bg-twitter-light text-twitter-blue"
              }`}>
                {forum.category}
              </span>
            </button>
          ))
        )}
      </div>

      {cityForums.length > 0 && (
        <div className="px-4 py-3 border-t border-slate-100">
          <button
            onClick={onOpenForums}
            className="w-full text-xs font-semibold text-twitter-blue hover:text-twitter-hover transition"
          >
            Browse all {city} forums →
          </button>
        </div>
      )}
    </div>
  );
}
