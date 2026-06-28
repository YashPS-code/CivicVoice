import React, { useState } from "react";
import { Filter, SlidersHorizontal, X } from "lucide-react";
import { FeedItem, User, Category, City } from "../../types";
import { CATEGORIES } from "../../constants";
import { filterFeedItems } from "../../utils/filters";
import FeedCard from "./FeedCard";

interface HomeFeedProps {
  currentUser: User;
  selectedCity: City;
  selectedWard: string;
  feedItems: FeedItem[];
  feedFilter: string;
  setFeedFilter: (f: string) => void;
  categoryFilter: string;
  setCategoryFilter: (f: string) => void;
  statusFilter: string;
  setStatusFilter: (f: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onLikeItem: (id: string, e?: React.MouseEvent) => void;
  onVotePoll: (pollId: string, optionId: string, e?: React.MouseEvent) => void;
  onSelectItem: (item: FeedItem) => void;
  onShowStats: (item: FeedItem) => void;
  onVerifyReport: (id: string, e: React.MouseEvent) => void;
  showAlert: (text: string, type?: "success" | "error" | "info") => void;
}

const TYPE_TABS = [
  { id: "all",    label: "All",       emoji: "📋" },
  { id: "post",   label: "Posts",     emoji: "✏️" },
  { id: "report", label: "Grievances",emoji: "⚠️" },
  { id: "poll",   label: "Polls",     emoji: "🗳️" },
];

export default function HomeFeed({
  currentUser,
  selectedCity,
  selectedWard,
  feedItems,
  feedFilter,
  setFeedFilter,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  onLikeItem,
  onVotePoll,
  onSelectItem,
  onShowStats,
  onVerifyReport,
  showAlert,
}: HomeFeedProps) {
  const [showFilters, setShowFilters] = useState(false);

  const activeFiltersCount = [
    feedFilter !== "all",
    categoryFilter !== "all",
    statusFilter !== "all",
    searchQuery !== "",
  ].filter(Boolean).length;

  const resetFilters = () => {
    setFeedFilter("all");
    setCategoryFilter("all");
    setStatusFilter("all");
    setSearchQuery("");
  };

  const filtered = filterFeedItems(feedItems, {
    city: selectedCity,
    ward: selectedWard,
    feedFilter,
    categoryFilter,
    statusFilter,
    searchQuery,
  });

  return (
    <div className="flex flex-col">
      {/* Type tabs + filter toggle */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center justify-between px-4 pt-3 pb-2 gap-2">
          {/* Type pills */}
          <div className="flex items-center gap-1">
            {TYPE_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFeedFilter(tab.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  feedFilter === tab.id
                    ? "bg-twitter-blue text-white shadow-sm shadow-twitter-blue/30"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                <span className="hidden sm:inline">{tab.emoji}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Advanced filter */}
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                activeFiltersCount > 0
                  ? "bg-twitter-light border-twitter-blue/30 text-twitter-blue"
                  : "border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 bg-twitter-blue text-white rounded-full text-[9px] font-extrabold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {showFilters && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-slate-200 bg-white shadow-xl p-4 z-50 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Advanced Filters</span>
                  <button onClick={() => setShowFilters(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {(feedFilter === "all" || feedFilter === "report") && (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Category</label>
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-twitter-blue/60 transition"
                      >
                        <option value="all">All Categories</option>
                        {CATEGORIES.map((c) => (
                          <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Status</label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-twitter-blue/60 transition"
                      >
                        <option value="all">All Statuses</option>
                        <option value="open">🔴 Open</option>
                        <option value="under_review">🟡 Under Review</option>
                        <option value="in_progress">🔵 In Progress</option>
                        <option value="resolved">🟢 Resolved</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={resetFilters}
                    className="flex-1 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
                  >
                    Reset all
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="flex-1 py-2 rounded-xl bg-twitter-blue text-xs font-semibold text-white hover:bg-twitter-hover transition"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feed items */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-3xl mb-4">
            🔍
          </div>
          <h3 className="font-display font-bold text-slate-800 text-base mb-1">No posts found</h3>
          <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-5">
            Be the first to post a neighborhood update, file a grievance, or launch a community poll!
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2 rounded-xl bg-twitter-light border border-twitter-blue/30 text-twitter-blue text-xs font-bold hover:bg-twitter-blue hover:text-white transition"
          >
            Clear filters
          </button>
        </div>
      ) : (
        filtered.map((item) => (
          <FeedCard
            key={item.id}
            item={item}
            currentUser={currentUser}
            onLike={(id, e) => onLikeItem(id, e)}
            onVotePoll={onVotePoll}
            onSelect={onSelectItem}
            onShowStats={onShowStats}
            onVerify={onVerifyReport}
            onShare={() => showAlert("Link copied to clipboard!", "success")}
          />
        ))
      )}
    </div>
  );
}
