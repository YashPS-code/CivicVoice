import React, { useState } from "react";
import { 
  Search, 
  TrendingUp, 
  MapPin, 
  ShieldCheck, 
  UserCheck, 
  HelpCircle,
  Sparkles
} from "lucide-react";
import { City, TrendingTopic, User } from "../types";

interface WidgetsProps {
  selectedCity: City;
  setSelectedCity: (city: City) => void;
  selectedWard: string;
  setSelectedWard: (ward: string) => void;
  trendingTopics: TrendingTopic[];
  councillors: User[];
  onOpenVerifyModal: () => void;
  onSelectTag: (tag: string) => void;
  isCurrentUserVerified: boolean;
  onSearch: (query: string) => void;
}

const CITIES: City[] = ["Mumbai", "Bengaluru", "Delhi", "Kolkata", "Chennai"];

// Simple list of wards per city to simulate filtering
const CITY_WARDS: { [key in City]: string[] } = {
  Mumbai: [
    "All Wards",
    "Ward 12 (Andheri West)",
    "Ward 15 (Bandra West)",
    "Ward 3 (Juhu-Koliwada)",
    "Ward 21 (Colaba)"
  ],
  Bengaluru: [
    "All Wards",
    "Ward 54 (HSR Layout)",
    "Ward 89 (Indiranagar)",
    "Ward 104 (Koramangala)",
    "Ward 12 (Whitefield)"
  ],
  Delhi: [
    "All Wards",
    "Ward 8 (Saket)",
    "Ward 15 (Connaught Place)",
    "Ward 24 (Karol Bagh)",
    "Ward 5 (Vasant Kunj)"
  ],
  Kolkata: [
    "All Wards",
    "Ward 63 (Park Street)",
    "Ward 82 (Alipore)",
    "Ward 45 (Salt Lake)"
  ],
  Chennai: [
    "All Wards",
    "Ward 112 (Adyar)",
    "Ward 156 (Velachery)",
    "Ward 170 (Mylapore)"
  ]
};

export default function Widgets({
  selectedCity,
  setSelectedCity,
  selectedWard,
  setSelectedWard,
  trendingTopics,
  councillors,
  onOpenVerifyModal,
  onSelectTag,
  isCurrentUserVerified,
  onSearch
}: WidgetsProps) {
  const [searchVal, setSearchVal] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchVal(val);
    onSearch(val);
  };

  const currentWards = CITY_WARDS[selectedCity] || ["All Wards"];

  return (
    <aside id="widgets-container" className="hidden lg:flex flex-col gap-5 p-6 h-screen overflow-y-auto sticky top-0 border-l border-slate-100 bg-white w-80 xl:w-96">

      {/* Trust & Aadhaar/Mobile Verification Prompt */}
      {!isCurrentUserVerified && (
        <div className="p-4 rounded-2xl bg-emerald-50/40 border text-left relative overflow-hidden group">
          <div className="absolute right-2 -bottom-2 opacity-5 group-hover:scale-110 transition-transform duration-300">
            <ShieldCheck className="w-24 h-24 text-emerald-800" />
          </div>
          <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs mb-1">
            <ShieldCheck className="w-4 h-4 shrink-0 stroke-[2.5]" />
            <span>TRUST LAYER PROMOTED</span>
          </div>
          <h4 className="font-display font-bold text-xs text-slate-800 mb-1 leading-tight">
            Verify residency, prevent bot votes
          </h4>
          <p className="text-[11px] text-slate-500 leading-normal mb-3">
            Verified Resident badges unlock double vote priority and give credibility to your reports.
          </p>
          <button
            id="widget-btn-verify"
            onClick={onOpenVerifyModal}
            className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition duration-200 cursor-pointer"
          >
            Claim Resident Badge
          </button>
        </div>
      )}

      {/* Trending Topics (What's Happening in Civic World) */}
      <div className="p-4 rounded-2xl border border-slate-100 text-left">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-slate-600" />
            <h3 className="font-display font-bold text-sm text-slate-800">
              Trending in {selectedCity}
            </h3>
          </div>
        </div>

        <div className="flex flex-col gap-3.5">
          {trendingTopics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => onSelectTag(topic.tag)}
              className="flex flex-col cursor-pointer group"
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {topic.category.replace("_", " ")}
                </span>
                <span className="text-[10px] text-slate-400 group-hover:text-twitter-blue transition duration-150">
                  {topic.postCount} reports
                </span>
              </div>
              <span className="font-bold text-slate-700 text-xs group-hover:text-twitter-blue group-hover:underline transition duration-150 mt-0.5">
                {topic.tag}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Ward Representative Contact Board */}
      <div className="p-4 rounded-2xl border border-slate-100 text-left">
        <h3 className="font-display font-bold text-sm text-slate-800 mb-4">
          Popular Forums
        </h3>

        <div className="flex flex-col gap-4">
          {councillors
            .filter((c) => c.city === selectedCity)
            .map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <img
                    src={c.avatar}
                    alt={c.displayName}
                    className="w-8.5 h-8.5 rounded-full object-cover shrink-0"
                  />
                  <div className="flex flex-col overflow-hidden">
                    <div className="flex items-center gap-0.5">
                      <span className="font-bold text-slate-700 truncate leading-tight">
                        {c.displayName}
                      </span>
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    </div>
                    <span className="text-[10px] text-slate-400 truncate leading-none mt-0.5">
                      {c.ward.split(" (")[1]?.replace(")", "") || c.ward}
                    </span>
                  </div>
                </div>

                <button
                  id={`btn-contact-${c.id}`}
                  onClick={() => alert(`Simulating connection with ${c.displayName}. Official email drafted to municipal-desk@gov.in`)}
                  className="px-2.5 py-1 rounded-full border border-slate-200 text-[10px] font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition duration-150 shrink-0"
                >
                  Contact
                </button>
              </div>
            ))}
          {councillors.filter((c) => c.city === selectedCity).length === 0 && (
            <span className="text-xs text-slate-400 text-center py-2">
              No registered officials found for this city.
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}
