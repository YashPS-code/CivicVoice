import React from "react";
import { X } from "lucide-react";
import { FeedItem } from "../types";

interface PollStatsDrawerProps {
  selectedItem: FeedItem;
  onClose: () => void;
}

export default function PollStatsDrawer({
  selectedItem,
  onClose
}: PollStatsDrawerProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-45 flex justify-end">
      <div className="flex-1" onClick={onClose} />
      
      <div className="w-full max-w-lg bg-white h-screen flex flex-col shadow-2xl relative animate-fade-in">
        
        <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10 text-left">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Demographic Insights</span>
            <span className="text-xs font-bold text-indigo-600 truncate max-w-[300px]">
              #{selectedItem.id} Stats
            </span>
          </div>
          <button 
            id="close-demographics-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 text-left">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-display font-black text-slate-900 text-base leading-snug">
              🗳️ {selectedItem.pollQuestion}
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-normal font-medium">
              {selectedItem.content}
            </p>
            <span className="text-[10px] font-bold text-slate-400 mt-2 block uppercase">
              Total Votes Cast: {selectedItem.pollTotalVotes}
            </span>
          </div>

          {/* Age & Area cohorts charts */}
          <div className="flex flex-col gap-4">
            {/* Age */}
            <div className="p-4 rounded-3xl border border-slate-100 bg-slate-50/50">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Voter Cohorts: Age Ratios</h4>
              
              <div className="flex flex-col gap-3">
                {selectedItem.ageBreakdown && Object.entries(selectedItem.ageBreakdown).map(([age, ratio]) => (
                  <div key={age} className="text-xs font-bold flex flex-col gap-1">
                    <div className="flex justify-between text-slate-600">
                      <span>{age}</span>
                      <span>{ratio}%</span>
                    </div>
                    <div className="w-full bg-slate-200/50 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-twitter-blue rounded-full" style={{ width: `${ratio}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Area */}
            <div className="p-4 rounded-3xl border border-slate-100 bg-slate-50/50">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Voter Cohorts: Area Distribution</h4>
              
              <div className="flex flex-col gap-3">
                {selectedItem.areaBreakdown && Object.entries(selectedItem.areaBreakdown).map(([area, ratio]) => (
                  <div key={area} className="text-xs font-bold flex flex-col gap-1">
                    <div className="flex justify-between text-slate-600">
                      <span>{area}</span>
                      <span>{ratio}%</span>
                    </div>
                    <div className="w-full bg-slate-200/50 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${ratio}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
