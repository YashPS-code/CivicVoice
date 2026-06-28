import React, { useState } from "react";
import { Search, Users, Flame, TrendingUp, MessageSquare, Globe, Pin } from "lucide-react";
import { Forum, MOCK_FORUMS } from "../../data/forums";
import { City } from "../../types";

interface ForumsPageProps {
  selectedCity: City;
  onJoinForum?: (forumId: string) => void;
}

const CATEGORY_FILTERS = ["All", "General", "Local", "Ward", "Environment", "Traffic", "Emergency", "Culture"];

export default function ForumsPage({ selectedCity, onJoinForum }: ForumsPageProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [joined, setJoined] = useState<Set<string>>(new Set());

  const forums = MOCK_FORUMS.filter((f) => {
    const matchCity = f.city === selectedCity;
    const matchSearch = !search || f.name.toLowerCase().includes(search.toLowerCase()) || f.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "All" || f.category === categoryFilter;
    return matchCity && matchSearch && matchCat;
  });

  const allCityForums = MOCK_FORUMS.filter((f) => f.city === selectedCity);
  const totalMembers = allCityForums.reduce((sum, f) => sum + f.members, 0);
  const totalPosts = allCityForums.reduce((sum, f) => sum + f.postsToday, 0);

  const toggleJoin = (id: string) => {
    setJoined((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    onJoinForum?.(id);
  };

  return (
    <div className="flex flex-col text-left">
      {/* Page header */}
      <div className="px-5 pt-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 text-twitter-blue text-xs font-extrabold uppercase tracking-wider mb-1">
          <MessageSquare className="w-3.5 h-3.5" />
          Community Forums
        </div>
        <h1 className="font-display font-black text-2xl text-slate-900 leading-tight">
          {selectedCity} Civic Boards
        </h1>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Join topic-specific forums, discuss local issues, and stay connected with your ward community.
        </p>

        {/* Quick stats */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-1.5 text-xs">
            <Users className="w-3.5 h-3.5 text-twitter-blue" />
            <span className="font-bold text-slate-700">{totalMembers.toLocaleString()}</span>
            <span className="text-slate-400">members</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <MessageSquare className="w-3.5 h-3.5 text-violet-500" />
            <span className="font-bold text-slate-700">{totalPosts}</span>
            <span className="text-slate-400">posts today</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <Globe className="w-3.5 h-3.5 text-emerald-500" />
            <span className="font-bold text-slate-700">{allCityForums.length}</span>
            <span className="text-slate-400">forums</span>
          </div>
        </div>
      </div>

      {/* Search + filters */}
      <div className="px-5 py-4 border-b border-slate-100 flex flex-col gap-3 sticky top-0 bg-white/95 backdrop-blur-md z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search forums…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700
              placeholder:text-slate-400 focus:outline-none focus:border-twitter-blue/60 focus:bg-white transition"
          />
        </div>

        {/* Category filter chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                categoryFilter === cat
                  ? "bg-twitter-blue text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Forum cards */}
      <div className="flex flex-col divide-y divide-slate-100">
        {forums.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-2xl mb-4">
              🔍
            </div>
            <p className="font-bold text-slate-700 mb-1">No forums found</p>
            <p className="text-xs text-slate-400">Try a different search or category filter.</p>
          </div>
        ) : (
          forums.map((forum) => {
            const isJoined = joined.has(forum.id);
            return (
              <div key={forum.id} className="px-5 py-4 hover:bg-slate-50/50 transition group flex items-center gap-4">
                {/* Forum icon */}
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-twitter-light to-cyan-100 border border-twitter-blue/20 flex items-center justify-center text-2xl shrink-0">
                  {forum.emoji}
                </div>

                {/* Forum info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-display font-bold text-sm text-slate-900 truncate group-hover:text-twitter-blue transition">
                      {forum.name}
                    </h3>
                    {forum.isHot && (
                      <span className="flex items-center gap-0.5 text-[9px] font-extrabold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded-full shrink-0">
                        <Flame className="w-2.5 h-2.5" /> Hot
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate mb-2 leading-relaxed">{forum.description}</p>

                  <div className="flex items-center gap-3 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-2.5 h-2.5" />
                      {forum.members.toLocaleString()} members
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-2.5 h-2.5" />
                      {forum.postsToday} posts today
                    </span>
                    <span className={`ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      forum.category === "Emergency" ? "bg-red-50 text-red-600" :
                      forum.category === "Environment" ? "bg-emerald-50 text-emerald-600" :
                      forum.category === "Traffic" ? "bg-indigo-50 text-indigo-600" :
                      "bg-twitter-light text-twitter-blue"
                    }`}>
                      {forum.category}
                    </span>
                  </div>
                </div>

                {/* Join button */}
                <button
                  onClick={() => toggleJoin(forum.id)}
                  className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                    isJoined
                      ? "bg-twitter-light text-twitter-blue border border-twitter-blue/30 hover:bg-red-50 hover:text-red-500 hover:border-red-200"
                      : "bg-twitter-blue text-white hover:bg-twitter-hover shadow-sm"
                  }`}
                >
                  {isJoined ? "Joined ✓" : "Join"}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* All-city forums section */}
      {search === "" && categoryFilter === "All" && (
        <>
          <div className="px-5 py-4 border-t border-slate-100 mt-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-4">
              <Globe className="w-3.5 h-3.5" />
              National Forums
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { emoji: "🇮🇳", name: "India Civic Network", members: 148203, category: "National" },
                { emoji: "🌿", name: "Green Cities India", members: 52110, category: "Environment" },
                { emoji: "⚡", name: "Smart Infrastructure", members: 34920, category: "Tech" },
                { emoji: "🏫", name: "Education & Youth", members: 28400, category: "Education" },
              ].map((f) => (
                <div
                  key={f.name}
                  className="flex flex-col gap-2 p-3 rounded-xl border border-slate-100 hover:border-twitter-blue/30 hover:bg-twitter-light/30 transition cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{f.emoji}</span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full">
                      {f.category}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-700 group-hover:text-twitter-blue transition leading-tight">
                    {f.name}
                  </p>
                  <p className="text-[10px] text-slate-400">{f.members.toLocaleString()} members</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
