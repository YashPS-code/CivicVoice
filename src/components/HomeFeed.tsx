import React, { useState } from "react";
import { 
  ArrowBigUp, 
  MessageCircle, 
  BarChart2, 
  Share2, 
  MapPin, 
  Filter, 
  Sparkles, 
  ShieldCheck,
  CheckCircle2,
  X,
  Paperclip
} from "lucide-react";
import { FeedItem, User, Category, City, Status } from "../types";
import { CATEGORIES } from "../constants";

interface HomeFeedProps {
  currentUser: User;
  selectedCity: City;
  selectedWard: string;
  feedItems: FeedItem[];
  feedFilter: string;
  setFeedFilter: (filter: string) => void;
  categoryFilter: string;
  setCategoryFilter: (filter: string) => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onLikeItem: (itemId: string, e?: React.MouseEvent) => void;
  onVotePoll: (pollId: string, optionId: string, e?: React.MouseEvent) => void;
  onSelectItem: (item: FeedItem) => void;
  onShowStats: (item: FeedItem) => void;
  onPublishItem: (payload: {
    type: "post" | "report" | "poll";
    content: string;
    image?: string;
    title?: string;
    category?: Category;
    locationName?: string;
    pollQuestion?: string;
    pollOptions?: string[];
  }) => void;
  showAlert: (text: string, type?: "success" | "error" | "info") => void;
  composeType: "post" | "report" | "poll";
  setComposeType: (type: "post" | "report" | "poll") => void;
}

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
  onPublishItem,
  showAlert,
  composeType,
  setComposeType
}: HomeFeedProps) {
  // Composer States
  const [composeText, setComposeText] = useState("");
  const [composeImage, setComposeImage] = useState("");
  
  // Grievance Report Fields
  const [reportTitle, setReportTitle] = useState("");
  const [reportCategory, setReportCategory] = useState<Category>("potholes");
  const [reportLandmark, setReportLandmark] = useState("");
  const [isEnhancingReport, setIsEnhancingReport] = useState(false);

  // Filter
  const [showFilters, setShowFilters] = useState(false);

  // Poll Fields
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);

  // Gemini AI suggest description & category
  const handleAISuggestReport = async () => {
    if (!reportTitle) {
      showAlert("Please enter a short title first to generate AI suggestions.", "error");
      return;
    }
    setIsEnhancingReport(true);

    try {
      const response = await fetch("/api/gemini/suggest-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: reportTitle,
          rawDescription: composeText,
          city: selectedCity,
          ward: selectedWard === "All Wards" ? currentUser.ward : selectedWard
        })
      });
      const data = await response.json();

      setComposeText(data.enhancedDescription || composeText);
      setReportCategory((data.suggestedCategory as Category) || reportCategory);

      showAlert(`AI Enhanced: Autofilled Category & enhanced details (${data.impactScore || "High Impact"})!`, "success");
    } catch (err) {
      console.error(err);
      showAlert("Gemini enhancement is busy. Please type description manually.", "error");
    } finally {
      setIsEnhancingReport(false);
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();

    if (composeType === "post" && !composeText.trim()) {
      showAlert("Please enter text for your social thought.", "error");
      return;
    }
    if (composeType === "report" && (!reportTitle.trim() || !composeText.trim())) {
      showAlert("Title and description are required for grievances.", "error");
      return;
    }
    if (composeType === "poll" && (!pollQuestion.trim() || pollOptions.some(opt => !opt.trim()))) {
      showAlert("Question and all options are required to publish a poll.", "error");
      return;
    }

    onPublishItem({
      type: composeType,
      content: composeText,
      image: composeImage || undefined,
      title: composeType === "report" ? reportTitle : undefined,
      category: composeType === "report" ? reportCategory : undefined,
      locationName: composeType === "report" ? reportLandmark || undefined : undefined,
      pollQuestion: composeType === "poll" ? pollQuestion : undefined,
      pollOptions: composeType === "poll" ? pollOptions : undefined
    });

    // Reset fields
    setComposeText("");
    setComposeImage("");
    setReportTitle("");
    setReportCategory("potholes");
    setReportLandmark("");
    setPollQuestion("");
    setPollOptions(["", ""]);
  };

  // Filter feed items based on filters (city, ward, type, search)
  const filteredFeedItems = feedItems.filter(item => {
    if (item.city !== selectedCity) return false;
    if (selectedWard !== "All Wards" && item.ward !== selectedWard) return false;
    if (feedFilter !== "all" && item.type !== feedFilter) return false;
    if (item.type === "report") {
      if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const contentMatch = (item.content || "").toLowerCase().includes(q);
      const titleMatch = (item.title || "").toLowerCase().includes(q);
      const questionMatch = (item.pollQuestion || "").toLowerCase().includes(q);
      const authorMatch = item.author.displayName.toLowerCase().includes(q) || item.author.username.toLowerCase().includes(q);
      return contentMatch || titleMatch || questionMatch || authorMatch;
    }
    return true;
  });

  return (
    <div className="divide-y divide-slate-100">
      {/* Microblogging Twitter-style Compose Area */}
      

      {/* Filter Grid Section */}
      <div className="sticky top-0 z-30 backdrop-blur-md border-b border-slate-100 px-2 py-3 flex justify-end">
  <div className="relative">
    <button
      onClick={() => setShowFilters(!showFilters)}
      className="flex items-center gap-2 px-2 py-1 rounded-xl border border-slate-100 cursor-pointer hover:opacity-50 transition"
    >
      <Filter className="w-4 h-4" />
      <span className="text-sm font-medium">Filters</span>
    </button>

    {showFilters && (
      <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-slate-200 bg-white shadow-xl p-4 z-50 space-y-5">

        {/* Feed Type */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-2">
            Feed Type
          </label>

          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "all", label: "👥 All Feed" },
              { id: "post", label: "📝 Thoughts" },
              { id: "report", label: "⚠️ Grievances" },
              { id: "poll", label: "📊 Polls" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFeedFilter(tab.id)}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  feedFilter === tab.id
                    ? "bg-twitter-blue text-white"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Show these only for reports */}
        {(feedFilter === "all" || feedFilter === "report") && (
          <>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2">
                Category
              </label>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-twitter-blue"
              >
                <option value="all">📁 All Categories</option>

                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2">
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-twitter-blue"
              >
                <option value="all">📍 All Statuses</option>
                <option value="open">🔴 Open Grievance</option>
                <option value="under_review">🟡 Under Review</option>
                <option value="in_progress">🔵 In Progress</option>
                <option value="resolved">🟢 Resolved Work</option>
              </select>
            </div>
          </>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => {
              setFeedFilter("all");
              setCategoryFilter("all");
              setStatusFilter("all");
            }}
            className="flex-1 rounded-lg bg-slate-100 py-2 text-sm font-medium hover:bg-slate-200"
          >
            Reset
          </button>

          <button
            onClick={() => setShowFilters(false)}
            className="flex-1 rounded-lg bg-twitter-blue py-2 text-sm font-medium text-white hover:bg-twitter-hover"
          >
            Apply
          </button>
        </div>
      </div>
    )}
  </div>
</div>

      {/* Main Feed List Stream */}
      {filteredFeedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-4">
            <Filter className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="font-display font-bold text-slate-700 text-base mb-1">No local content matches</h3>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
            Be the first to post a neighborhood update, raise a ward grievance, or launch a public opinion poll!
          </p>
          <button
            id="reset-filters-feed-btn"
            onClick={() => { setFeedFilter("all"); setCategoryFilter("all"); setStatusFilter("all"); setSearchQuery(""); }}
            className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Clear Filter Criteria
          </button>
        </div>
      ) : (
        filteredFeedItems.map((item) => {
          const hasLiked = item.upvotedBy.includes(currentUser.id);
          const categoryItem = CATEGORIES.find(c => c.value === item.category);
          const hasVotedOnPoll = item.pollVotedBy && item.pollVotedBy[currentUser.id];
          const userVoteOptionId = item.pollVotedBy && item.pollVotedBy[currentUser.id];

          return (
            <article
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="p-4 flex gap-3 hover:bg-slate-50/50 cursor-pointer transition-colors duration-150 text-left border-b border-slate-100 group"
            >
              {/* Left Side Avatar Column */}
              <div className="flex flex-col items-center shrink-0">
                <img
                  src={item.author.avatar}
                  alt={item.author.displayName}
                  className="w-10 h-10 rounded-full object-cover border border-slate-100 shrink-0 shadow-sm"
                />
                <div className="w-0.5 grow bg-slate-100 group-hover:bg-slate-200 transition duration-150 my-2" />
              </div>

              {/* Right Content Stream Column */}
              <div className="flex-1 flex flex-col gap-1.5 overflow-hidden">
                {/* Card Header Row */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <span className="font-bold text-slate-800 hover:underline hover:text-twitter-blue truncate max-w-[150px] leading-tight">
                      {item.author.displayName}
                    </span>
                    {item.author.isVerified && (
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-500 fill-blue-50 shrink-0" />
                    )}
                    <span className="text-slate-400 font-medium truncate max-w-[100px] leading-tight">
                      @{item.author.username}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-400 font-medium whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                  </div>

                  {/* Optional Post Type Indicator Badge */}
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider ${
                    item.type === "post" ? "bg-slate-100 text-slate-600" :
                    item.type === "report" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                  }`}>
                    {item.type}
                  </span>
                </div>

                {/* Ward Geographic Tag */}
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400/90 bg-slate-50 px-2 py-0.5 rounded-md w-fit leading-none">
                  <MapPin className="w-3 h-3 text-twitter-blue shrink-0" />
                  <span>{item.locationName || item.ward}</span>
                </div>

                {/* Report Specific Details Title Block */}
                {item.type === "report" && (
                  <div className="mt-1 flex items-center justify-between gap-2 border-l-4 border-amber-500 pl-2">
                    <h2 className="font-display font-black text-slate-900 text-sm md:text-base tracking-tight leading-snug">
                      {item.title}
                    </h2>
                    <div className="flex items-center gap-1.5 shrink-0 bg-slate-100/80 px-2 py-1 rounded-md">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        item.status === "open" ? "bg-red-500 animate-pulse" :
                        item.status === "under_review" ? "bg-amber-500" :
                        item.status === "in_progress" ? "bg-blue-500" : "bg-emerald-500"
                      }`} />
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">
                        {item.status?.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                )}

                {/* Poll Specific Question Block */}
                {item.type === "poll" && (
                  <h2 className="font-display font-black text-slate-900 text-sm md:text-base tracking-tight leading-snug mt-1 flex items-center gap-1 text-blue-700">
                    <span>🗳️</span>
                    <span>{item.pollQuestion}</span>
                  </h2>
                )}

                {/* Main Text Content */}
                {item.content && (
                  <p className="text-xs text-slate-600 font-medium leading-relaxed whitespace-pre-wrap mt-0.5">
                    {item.content}
                  </p>
                )}

                {/* Interactive Poll Choices UI */}
                {item.type === "poll" && item.pollOptions && (
                  <div className="flex flex-col gap-2 mt-3 overflow-hidden">
                    {item.pollOptions.map((opt) => {
                      const totalVotes = item.pollTotalVotes || 0;
                      const votesCount = opt.votes;
                      const ratio = totalVotes > 0 ? Math.round((votesCount / totalVotes) * 100) : 0;
                      const isUserVotedChoice = userVoteOptionId === opt.id;

                      return (
                        <div key={opt.id} className="relative overflow-hidden rounded-xl border border-slate-100">
                          {hasVotedOnPoll && (
                            <div 
                              className={`absolute top-0 left-0 bottom-0 transition-all duration-700 ${
                                isUserVotedChoice ? "bg-sky-100/80" : "bg-slate-100/50"
                              }`}
                              style={{ width: `${ratio}%`, zIndex: 0 }}
                            />
                          )}

                          <button
                            id={`feed-poll-option-${opt.id}`}
                            type="button"
                            disabled={!!hasVotedOnPoll}
                            onClick={(e) => onVotePoll(item.id, opt.id, e)}
                            className={`w-full py-2.5 px-3 relative z-10 flex items-center justify-between text-xs font-semibold text-left ${
                              hasVotedOnPoll ? "cursor-default" : "hover:bg-slate-50/50 cursor-pointer"
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              {hasVotedOnPoll && isUserVotedChoice && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-twitter-blue stroke-[3]" />
                              )}
                              <span className={isUserVotedChoice ? "text-twitter-blue font-bold" : "text-slate-700"}>
                                {opt.text}
                              </span>
                            </div>
                            {hasVotedOnPoll && (
                              <span className="text-slate-500 font-extrabold text-[10.5px]">
                                {ratio}% ({votesCount})
                              </span>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Image Attachment Rendering */}
                {item.image && (
                  <div className="mt-2.5 rounded-2xl overflow-hidden border border-slate-100 max-h-56">
                    <img
                      src={item.image}
                      alt="Social post evidence"
                      className="w-full h-full object-cover hover:scale-101 transition duration-200"
                    />
                  </div>
                )}

                {/* Extra Metadata Row */}
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {item.type === "report" && categoryItem && (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-slate-100 border border-slate-200 text-slate-600 flex items-center gap-1 leading-none">
                      <span>{categoryItem.icon}</span>
                      <span>{categoryItem.label}</span>
                    </span>
                  )}
                  {item.type === "poll" && (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-blue-50 border border-blue-100 text-blue-700 flex items-center gap-1 leading-none">
                      <BarChart2 className="w-3 h-3" />
                      <span>{item.pollTotalVotes} citizen votes</span>
                    </span>
                  )}
                  {item.upvotes > 100 && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full animate-pulse leading-none">
                      🔥 Hot Priority Topic
                    </span>
                  )}
                </div>

                {/* Official Councillor Response Badge Block */}
                {item.officialResponse && (
                  <div className="mt-3 p-3 rounded-2xl bg-amber-50/50 border border-amber-100 text-left flex gap-2.5">
                    <img
                      src={item.officialResponse.responder.avatar}
                      alt="Councillor response badge"
                      className="w-7 h-7 rounded-full object-cover border border-amber-200 shrink-0"
                    />
                    <div className="flex-1 flex flex-col gap-0.5 overflow-hidden">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-slate-800">
                        <span>{item.officialResponse.responder.displayName}</span>
                        <span className="text-[9px] text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded font-black uppercase">Official Desk</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-normal truncate max-w-[400px] font-medium">
                        "{item.officialResponse.text}"
                      </p>
                    </div>
                  </div>
                )}

                {/* Social Interaction Buttons Panel */}
                <div className="flex items-center justify-between text-slate-400 font-bold text-xs mt-3.5 border-t border-slate-50 pt-2.5 max-w-[450px]">
                  {/* Like / Heart Action */}
                  <button
                    id={`like-feeditem-btn-${item.id}`}
                    type="button"
                    onClick={(e) => onLikeItem(item.id, e)}
                    className={`flex items-center gap-1.5 transition duration-150 py-1 px-2.5 rounded-full cursor-pointer select-none ${
                      hasLiked 
                        ? "text-red-500 bg-red-50/40" 
                        : "hover:text-red-500 hover:bg-red-50/20"
                    }`}
                  >
                    <ArrowBigUp className={`w-4 h-4 ${hasLiked ? "fill-red-500" : ""}`} />
                    <span>{item.upvotes}</span>
                  </button>

                  {/* Reply Comment Action */}
                  <div className="flex items-center gap-1.5 hover:text-twitter-blue hover:bg-sky-50/30 py-1 px-2.5 rounded-full">
                    <MessageCircle className="w-4 h-4" />
                    <span>{item.commentsCount}</span>
                  </div>

                  {/* Demographics / Graph toggle for polls */}
                  {item.type === "poll" && (
                    <button
                      id={`view-demographics-btn-${item.id}`}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onShowStats(item);
                      }}
                      className="flex items-center gap-1 hover:text-indigo-600 hover:bg-indigo-50/30 py-1 px-2.5 rounded-full cursor-pointer"
                    >
                      <BarChart2 className="w-4 h-4 text-indigo-500" />
                      <span className="hidden sm:inline">Stats</span>
                    </button>
                  )}

                  {/* Share Action */}
                  <button
                    id={`share-feeditem-btn-${item.id}`}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      showAlert("Interactive link copied to clipboard! Share with ward chats.", "success");
                    }}
                    className="flex items-center gap-1.5 hover:text-emerald-500 hover:bg-emerald-50/30 py-1 px-2.5 rounded-full cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                </div>

              </div>
            </article>
          );
        })
      )}
    </div>
  );
}
