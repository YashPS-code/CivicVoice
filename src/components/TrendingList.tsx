import React, { useState } from "react";
import { TrendingUp, CheckCircle, Clock, AlertCircle, Heart, MapPin, Search, ArrowRight } from "lucide-react";
import { FeedItem, User, City, Category } from "../types";
import { CATEGORIES } from "../constants";

interface TrendingListProps {
  currentUser: User;
  feedItems: FeedItem[];
  selectedCity: City;
  selectedWard: string;
  onLikeItem: (itemId: string, e?: React.MouseEvent) => void;
  onSelectItem: (item: FeedItem) => void;
  showAlert: (text: string, type?: "success" | "error" | "info") => void;
}

export default function TrendingList({
  currentUser,
  feedItems,
  selectedCity,
  selectedWard,
  onLikeItem,
  onSelectItem,
  showAlert
}: TrendingListProps) {
  const [filter, setFilter] = useState<"all" | "unresolved" | "resolved">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Define structured Hot Topics of Social Concern based on municipal categories
  const hotTopicsList = [
    {
      id: "topic_potholes",
      title: "Road Integrity & Post-Monsoon Potholes",
      tag: "#PotholeFreeMonsoon",
      category: "potholes" as Category,
      baseVotes: 245,
      description: "Severe road damage, crater-sized potholes, and water-logged asphalt impeding commuter safety.",
    },
    {
      id: "topic_streetlights",
      title: "Dark Zones & Streetlight Blackouts",
      tag: "#BrightenOurStreets",
      category: "streetlights" as Category,
      baseVotes: 180,
      description: "Non-functioning streetlamp corridors creating security dark-zones for pedestrians and riders.",
    },
    {
      id: "topic_garbage",
      title: "Uncontrolled Dumping & Waste Clearing",
      tag: "#CleanGreenNeighborhood",
      category: "garbage" as Category,
      baseVotes: 195,
      description: "Unattended waste heaps, public black-spots, and delayed garbage truck rounds.",
    },
    {
      id: "topic_water",
      title: "Water Scarcity & Utility Pipeline Leakage",
      tag: "#SaveEveryDrop",
      category: "water_leakage" as Category,
      baseVotes: 160,
      description: "Drinking water supply disruptions, pipeline bursts, and severe water logging leakage.",
    },
    {
      id: "topic_traffic",
      title: "Traffic Congestion & Junction Snarls",
      tag: "#SmoothTransit",
      category: "traffic" as Category,
      baseVotes: 210,
      description: "Bottlenecks at major ward intersections due to signal outages or poor road design.",
    },
    {
      id: "topic_pollution",
      title: "Air Quality & Construction Dust Control",
      tag: "#BreathCleanAir",
      category: "pollution" as Category,
      baseVotes: 130,
      description: "Dust control negligence at infrastructure sites and local industrial emissions.",
    }
  ];

  // For each hot topic, dynamically calculate stats from the live feed items
  const aggregatedTopics = hotTopicsList.map(topic => {
    // Filter feed reports matching this category and city
    const relatedReports = feedItems.filter(
      item => item.type === "report" && 
              item.category === topic.category && 
              item.city === selectedCity &&
              (selectedWard === "All Wards" || item.ward === selectedWard)
    );

    const unresolvedReports = relatedReports.filter(item => item.status !== "resolved");
    const resolvedReports = relatedReports.filter(item => item.status === "resolved");

    // Dynamic upvotes = base static votes + upvotes of matching live reports
    const liveUpvotesCount = relatedReports.reduce((sum, item) => sum + item.upvotes, 0);
    const totalPrioritizations = topic.baseVotes + liveUpvotesCount;

    // Determine status of the concern
    // If there are related reports and all of them are resolved, or if the ratio is very high, mark as resolved
    // If unresolved is high, mark as unresolved
    let status: "unresolved" | "resolved" = "unresolved";
    if (relatedReports.length > 0 && unresolvedReports.length === 0) {
      status = "resolved";
    } else if (relatedReports.length === 0 && topic.baseVotes % 2 === 0) {
      // Curated default resolved states if no live reports exist to keep mock alive
      status = "resolved";
    }

    return {
      ...topic,
      relatedReports,
      unresolvedCount: unresolvedReports.length,
      resolvedCount: resolvedReports.length,
      totalCount: relatedReports.length,
      totalPrioritizations,
      status
    };
  });

  // Filter topics based on user filters
  const filteredTopics = aggregatedTopics.filter(topic => {
    // Search query matches
    const matchesSearch = 
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === "unresolved") {
      // Unresolved means there is at least one unresolved active report, or status is unresolved
      return topic.status === "unresolved" || topic.unresolvedCount > 0;
    }
    if (filter === "resolved") {
      // Resolved means status is resolved
      return topic.status === "resolved" && topic.unresolvedCount === 0;
    }
    return true;
  });

  return (
    <div className="p-4 text-left">
      {/* Page Title & Context Header */}
      <div className="mb-5">
        <div className="flex items-center gap-1.5 text-twitter-blue font-extrabold text-xs mb-1">
          <TrendingUp className="w-4 h-4 stroke-[2.5]" />
          <span>REAL-TIME CITIZEN INTEREST</span>
        </div>
        <h2 className="font-display font-black text-slate-900 text-lg">
          Trending Social Concerns
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed mt-0.5 font-medium">
          Monitor hot civic bottlenecks in <span className="text-slate-800 font-bold">{selectedCity}</span>. See which issues remain unresolved or have been successfully resolved by ward councils.
        </p>
      </div>

      {/* Mini Controls Block */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-5">
        {/* Toggle States */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl w-full sm:w-auto shrink-0 border border-slate-200/50">
          <button
            onClick={() => setFilter("all")}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
              filter === "all"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            All Concerns
          </button>
          <button
            onClick={() => setFilter("unresolved")}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 flex items-center justify-center gap-1 ${
              filter === "unresolved"
                ? "bg-white text-red-600 shadow-sm"
                : "text-slate-500 hover:text-red-500"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Unresolved</span>
          </button>
          <button
            onClick={() => setFilter("resolved")}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 flex items-center justify-center gap-1 ${
              filter === "resolved"
                ? "bg-white text-emerald-600 shadow-sm"
                : "text-slate-500 hover:text-emerald-500"
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Resolved</span>
          </button>
        </div>

        {/* Uncluttered Search Filter */}
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search hot topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs p-2.5 pl-9 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-twitter-blue font-medium text-slate-700"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* Clean, Uncluttered Grid of Concern Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTopics.map(topic => {
          const catObj = CATEGORIES.find(c => c.value === topic.category);
          const isCurrentlyUnresolved = topic.unresolvedCount > 0 || topic.status === "unresolved";

          return (
            <div
              key={topic.id}
              className={`p-4 rounded-3xl border transition shadow-sm ${
                isCurrentlyUnresolved
                  ? "bg-white border-slate-100 hover:border-red-100"
                  : "bg-white border-slate-100 hover:border-emerald-100"
              }`}
            >
              {/* Header Info */}
              <div className="flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[10px] font-black text-twitter-blue bg-blue-50/70 px-2 py-0.5 rounded-full">
                      {topic.tag}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                      <span>{catObj?.icon}</span>
                      <span>{catObj?.label}</span>
                    </span>
                  </div>
                  <h3 className="font-display font-black text-slate-800 text-sm leading-tight sm:text-base">
                    {topic.title}
                  </h3>
                </div>

                {/* Status Pill */}
                <div className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide uppercase shrink-0 flex items-center gap-1 ${
                  isCurrentlyUnresolved
                    ? "bg-red-50 text-red-600 border border-red-100"
                    : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                }`}>
                  {isCurrentlyUnresolved ? (
                    <>
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Unresolved ({topic.unresolvedCount || 1} Active)</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Resolved ({topic.resolvedCount || 1} Fixed)</span>
                    </>
                  )}
                </div>
              </div>

              {/* Concern Description */}
              <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">
                {topic.description}
              </p>

              {/* Aggregated Statistics & Live Counter */}
              <div className="grid grid-cols-3 gap-3 bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100/50 mt-3.5 text-center">
                <div>
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    Public Support
                  </span>
                  <span className="text-xs font-black text-slate-700 mt-0.5 block">
                    {topic.totalPrioritizations} upvotes
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    Live Incidents
                  </span>
                  <span className="text-xs font-black text-slate-700 mt-0.5 block">
                    {topic.totalCount} filed cases
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    Resolution Status
                  </span>
                  <span className={`text-xs font-black mt-0.5 block ${
                    isCurrentlyUnresolved ? "text-red-500" : "text-emerald-500"
                  }`}>
                    {isCurrentlyUnresolved ? "Pending fix" : "All cleared"}
                  </span>
                </div>
              </div>

              {/* Nested reports from the actual feed items for high-fidelity interactive links */}
              {topic.relatedReports.length > 0 && (
                <div className="mt-3.5 border-t border-slate-100 pt-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">
                    Live Associated Reports ({topic.relatedReports.length})
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {topic.relatedReports.slice(0, 2).map(report => (
                      <div
                        key={report.id}
                        onClick={() => onSelectItem(report)}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-50/30 border border-slate-100 hover:bg-slate-50 transition cursor-pointer text-xs"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            report.status === "resolved" ? "bg-emerald-500" : "bg-red-400"
                          }`} />
                          <span className="font-bold text-slate-700 truncate max-w-[280px]">
                            {report.title}
                          </span>
                          <span className="text-[9px] text-slate-400">@{report.author.username}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400 font-bold text-[10px] shrink-0">
                          <span>View Thread</span>
                          <ArrowRight className="w-3 h-3 text-twitter-blue" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredTopics.length === 0 && (
          <div className="text-center py-12 border border-slate-100 rounded-3xl bg-white">
            <TrendingUp className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-bold">No trending concerns match your search or filter criteria.</p>
            <p className="text-[10px] text-slate-400 mt-1">Try toggling different filters or updating search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
}
