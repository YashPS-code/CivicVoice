import React from "react";
import { Search, MapPin } from "lucide-react";
import { City, TrendingTopic, User } from "../../types";
import { Forum } from "../../data/forums";
import TrendingWidget from "./TrendingWidget";
import ForumsWidget from "./ForumsWidget";
import VerifyWidget from "./VerifyWidget";
import InsightsWidget from "./InsightsWidget";
import GamificationWidget from "./GamificationWidget";

interface WidgetsProps {
  selectedCity: City;
  setSelectedCity: (city: City) => void;
  selectedWard: string;
  setSelectedWard: (ward: string) => void;
  trendingTopics: TrendingTopic[];
  forums: Forum[];
  currentUser: User;
  onOpenVerifyModal: () => void;
  onSelectTag: (tag: string) => void;
  isCurrentUserVerified: boolean;
  onSearch: (query: string) => void;
  onOpenForums: () => void;
  onOpenDashboard: () => void;
  onOpenProfile: () => void;
}

const CITIES: City[] = ["Mumbai", "Bengaluru", "Delhi", "Kolkata", "Chennai"];

const CITY_WARDS: Record<City, string[]> = {
  Mumbai: ["All Wards", "Ward 12 (Andheri West)", "Ward 15 (Bandra West)", "Ward 3 (Juhu-Koliwada)", "Ward 21 (Colaba)"],
  Bengaluru: ["All Wards", "Ward 54 (HSR Layout)", "Ward 89 (Indiranagar)", "Ward 104 (Koramangala)", "Ward 12 (Whitefield)"],
  Delhi: ["All Wards", "Ward 8 (Saket)", "Ward 15 (Connaught Place)", "Ward 24 (Karol Bagh)", "Ward 5 (Vasant Kunj)"],
  Kolkata: ["All Wards", "Ward 63 (Park Street)", "Ward 82 (Alipore)", "Ward 45 (Salt Lake)"],
  Chennai: ["All Wards", "Ward 112 (Adyar)", "Ward 156 (Velachery)", "Ward 170 (Mylapore)"],
};

export default function Widgets({
  selectedCity,
  setSelectedCity,
  selectedWard,
  setSelectedWard,
  trendingTopics,
  forums,
  currentUser,
  onOpenVerifyModal,
  onSelectTag,
  isCurrentUserVerified,
  onSearch,
  onOpenForums,
  onOpenDashboard,
  onOpenProfile,
}: WidgetsProps) {
  const [searchVal, setSearchVal] = React.useState("");
  const wards = CITY_WARDS[selectedCity] || ["All Wards"];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setSearchVal(v);
    onSearch(v);
  };

  return (
    <aside
      id="widgets-container"
      className="hidden lg:flex flex-col gap-5 p-5 h-screen overflow-y-auto sticky top-0
        border-l border-slate-200 bg-white w-80 xl:w-[22rem]"
    >
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchVal}
          onChange={handleSearch}
          placeholder="Search civic posts…"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700
            placeholder:text-slate-400 focus:outline-none focus:border-twitter-blue/60 focus:bg-white transition"
        />
      </div>

      {/* City + Ward selectors */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider px-0.5">
          <MapPin className="w-3 h-3 text-twitter-blue" />
          Location filter
        </div>
        <div className="flex gap-2">
          <select
            value={selectedCity}
            onChange={(e) => { setSelectedCity(e.target.value as City); setSelectedWard("All Wards"); }}
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700
              focus:outline-none focus:border-twitter-blue/60 transition cursor-pointer"
          >
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700
              focus:outline-none focus:border-twitter-blue/60 transition cursor-pointer"
          >
            {wards.map((w) => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>
      </div>

      {/* Verify prompt */}
      {!isCurrentUserVerified && <VerifyWidget onVerify={onOpenVerifyModal} />}

      {/* Trending topics */}
      <TrendingWidget
        topics={trendingTopics}
        city={selectedCity}
        onSelectTag={onSelectTag}
      />

      {/* AI insights */}
      <InsightsWidget city={selectedCity} onOpenDashboard={onOpenDashboard} />

      {/* Popular forums */}
      <ForumsWidget
        forums={forums}
        city={selectedCity}
        onOpenForums={onOpenForums}
      />

      {/* Gamification */}
      <GamificationWidget currentUser={currentUser} onOpenProfile={onOpenProfile} />

      {/* Footer */}
      <p className="text-[10px] text-slate-300 text-center mt-auto pb-2">
        CivicVoice · Built for India's civic future
      </p>
    </aside>
  );
}
