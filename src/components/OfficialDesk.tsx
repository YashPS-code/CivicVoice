import React from "react";
import { ShieldCheck, ChevronRight } from "lucide-react";
import { FeedItem, User, City, Status } from "../types";
import { CATEGORIES } from "../constants";

interface OfficialDeskProps {
  currentUser: User;
  selectedCity: City;
  feedItems: FeedItem[];
  onUpdateStatus: (itemId: string, status: Status) => void;
  onSelectItem: (item: FeedItem) => void;
}

export default function OfficialDesk({
  currentUser,
  selectedCity,
  feedItems,
  onUpdateStatus,
  onSelectItem
}: OfficialDeskProps) {
  return (
    <div className="p-4 text-left divide-y divide-slate-100">
      {/* Portal Info */}
      <div className="pb-4">
        <div className="flex items-center gap-2 text-amber-700 font-black text-xs mb-1">
          <ShieldCheck className="w-4.5 h-4.5 stroke-[2.5]" />
          <span>VERIFIED REPRESENTATIVE WORKSPACE</span>
        </div>
        <h2 className="font-display font-black text-slate-900 text-lg leading-tight">
          Ward Analytics & Administrative Controls
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed mt-1 font-medium">
          Monitor citizens' prioritizations, view resolution performance metrics, and draft official updates directly. Toggle to **Official Mode** in the sidebar to modify report statuses.
        </p>
      </div>

      {/* Analytical KPIs */}
      <div className="py-5">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
          Ward Performance KPIs
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-red-50/40 border border-red-100 rounded-2xl text-left">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase">Active Open</span>
            <p className="font-display font-black text-red-600 text-2xl mt-1">
              {feedItems.filter(item => item.city === selectedCity && item.type === "report" && item.status !== "resolved").length}
            </p>
            <span className="text-[9px] text-slate-400 font-bold">Needs crew dispatch</span>
          </div>

          <div className="p-3 bg-emerald-50/40 border border-emerald-100 rounded-2xl text-left">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase">Resolved Cases</span>
            <p className="font-display font-black text-emerald-600 text-2xl mt-1">
              {feedItems.filter(item => item.city === selectedCity && item.type === "report" && item.status === "resolved").length}
            </p>
            <span className="text-[9px] text-emerald-500 font-extrabold">+18% this month</span>
          </div>

          <div className="p-3 bg-sky-50/40 border border-sky-100 rounded-2xl text-left">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase">Avg Resolution</span>
            <p className="font-display font-black text-twitter-blue text-2xl mt-1">
              4.2 Days
            </p>
            <span className="text-[9px] text-emerald-600 font-bold">⏱️ 1.2 days saved</span>
          </div>

          <div className="p-3 bg-amber-50/40 border border-amber-100 rounded-2xl text-left">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase">Citizen Trust</span>
            <p className="font-display font-black text-amber-600 text-2xl mt-1">
              89%
            </p>
            <span className="text-[9px] text-slate-400 font-bold">Satisfied feedback</span>
          </div>
        </div>
      </div>

      {/* SVG Visualizations of Frequency */}
      <div className="py-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">
            Issue Frequency by Category ({selectedCity})
          </h3>
          <span className="text-[10px] font-semibold text-slate-400">Aggregated real-time prioritizations</span>
        </div>

        <div className="p-4 rounded-3xl border border-slate-100 bg-slate-50/50 flex flex-col gap-3">
          {CATEGORIES.map(cat => {
            const frequency = feedItems.filter(item => item.city === selectedCity && item.type === "report" && item.category === cat.value).length;
            const votesForCategory = feedItems
              .filter(item => item.city === selectedCity && item.type === "report" && item.category === cat.value)
              .reduce((acc, curr) => acc + curr.upvotes, 0);

            const maxVotes = Math.max(...CATEGORIES.map(c => 
              feedItems
                .filter(item => item.city === selectedCity && item.type === "report" && item.category === c.value)
                .reduce((acc, curr) => acc + curr.upvotes, 0)
            )) || 1;

            const percentage = Math.max(10, Math.min(100, (votesForCategory / maxVotes) * 100));

            return (
              <div key={cat.value} className="flex flex-col gap-1 text-xs font-semibold">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5 font-bold">
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                    <span className="text-[10px] text-slate-400 font-medium">({frequency} cases filed)</span>
                  </span>
                  <span className="text-twitter-blue font-extrabold">{votesForCategory} prioritization points</span>
                </div>
                
                <div className="w-full bg-slate-200/50 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r ${cat.color} transition-all duration-1000`} 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dispatch List */}
      <div className="py-5 text-left">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
          Administrative Action Orders ({selectedCity})
        </h3>

        <div className="flex flex-col gap-3">
          {feedItems
            .filter(item => item.city === selectedCity && item.type === "report")
            .map((report) => (
              <div 
                key={report.id}
                className="p-3 border border-slate-100 rounded-2xl bg-white hover:border-slate-200 shadow-sm transition flex items-center justify-between gap-3 text-xs font-semibold"
              >
                <div className="flex flex-col gap-0.5 text-left overflow-hidden">
                  <span className="font-bold text-slate-800 truncate leading-snug">
                    {report.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-black truncate leading-none">
                    {report.ward} · {report.upvotes} prioritizations · {report.status?.replace("_", " ")}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {currentUser.role === "official" ? (
                    <div className="flex gap-1">
                      <button
                        id={`deploy-crew-btn-${report.id}`}
                        type="button"
                        onClick={() => onUpdateStatus(report.id, "in_progress")}
                        className={`px-2 py-1 rounded text-[10px] font-black cursor-pointer ${
                          report.status === "in_progress" 
                            ? "bg-blue-100 text-blue-700 border border-blue-200" 
                            : "bg-slate-100 hover:bg-blue-50 text-slate-600"
                        }`}
                      >
                        Deploy Crew
                      </button>
                      <button
                        id={`solved-btn-${report.id}`}
                        type="button"
                        onClick={() => onUpdateStatus(report.id, "resolved")}
                        className={`px-2 py-1 rounded text-[10px] font-black cursor-pointer ${
                          report.status === "resolved" 
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
                            : "bg-slate-100 hover:bg-emerald-50 text-slate-600"
                        }`}
                      >
                        Mark Solved
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] font-extrabold text-slate-400 italic">
                      Official eyes only
                    </span>
                  )}
                  <ChevronRight 
                    className="w-4 h-4 text-slate-400 cursor-pointer" 
                    onClick={() => onSelectItem(report)}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
