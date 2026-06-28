import React from "react";
import { Award, ShieldCheck, MapPin } from "lucide-react";
import { FeedItem, User } from "../../types";

interface ProfileTabProps {
  currentUser: User;
  feedItems: FeedItem[];
  onOpenVerifyModal: () => void;
  onSelectItem: (item: FeedItem) => void;
  setActiveTab: (tab: string) => void;
}

export default function ProfileTab({
  currentUser,
  feedItems,
  onOpenVerifyModal,
  onSelectItem,
  setActiveTab
}: ProfileTabProps) {
  return (
    <div className="text-left">
      {/* Profile Cover Photo */}
      <div className="relative h-36 bg-gradient-to-r from-twitter-blue to-indigo-600 overflow-hidden">
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/10 backdrop-blur-md text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full border border-white/20">
          <Award className="w-3.5 h-3.5" />
          <span>LOCAL LEAD RANK #24</span>
        </div>
      </div>

      {/* Profile Meta Cards */}
      <div className="px-4 pb-4 border-b border-slate-100 relative">
        {/* Big floating Avatar */}
        <div className="absolute -top-12 left-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.displayName}
            className="w-22 h-22 rounded-full object-cover border-4 border-white shadow-md bg-white shrink-0"
          />
        </div>

        {/* Actions column */}
        <div className="flex justify-end pt-3">
          <button
            id="profile-verify-trigger"
            type="button"
            onClick={onOpenVerifyModal}
            className="py-1.5 px-4 rounded-full border border-slate-200 text-xs font-black text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            {currentUser.isVerified ? "Claimed Verification" : "Verify Aadhaar"}
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <h2 className="font-display font-black text-slate-900 text-lg leading-tight">
              {currentUser.displayName}
            </h2>
            {currentUser.isVerified && (
              <ShieldCheck className="w-5 h-5 text-blue-500 fill-blue-50" />
            )}
          </div>
          <span className="text-xs text-slate-400 font-extrabold leading-none">
            @{currentUser.username}
          </span>

          <p className="text-xs text-slate-600 leading-relaxed mt-3 max-w-md font-medium">
            "{currentUser.bio}"
          </p>

          {/* Followers Count metrics */}
          <div className="flex items-center gap-4 text-xs mt-3.5 text-slate-500 font-black">
            <span>
              <span className="text-slate-800">{currentUser.followingCount}</span> Following
            </span>
            <span>
              <span className="text-slate-800">{currentUser.followersCount}</span> Followers
            </span>
            <span>
              <span className="text-amber-600">{currentUser.civicPoints}</span> Civic Points
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-400 font-bold mt-2">
            <MapPin className="w-3.5 h-3.5 text-twitter-blue" />
            <span>{currentUser.ward}</span>
          </div>
        </div>
      </div>

      {/* Gamified Badges earned container */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
          Unlocked Civic Badges
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-white border border-slate-100 text-left flex gap-2 shadow-sm">
            <span className="text-lg">🛡️</span>
            <div className="flex flex-col leading-none justify-center">
              <span className="font-bold text-slate-700 text-[11px]">Sentinel Warden</span>
              <span className="text-[9px] text-slate-400 mt-0.5">Joined CivicVoice</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white border border-slate-100 text-left flex gap-2 shadow-sm">
            <span className="text-lg">🔥</span>
            <div className="flex flex-col leading-none justify-center">
              <span className="font-bold text-slate-700 text-[11px]">Pothole Patrol</span>
              <span className="text-[9px] text-slate-400 mt-0.5">Reported 3 roads</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white border border-slate-100 text-left flex gap-2 shadow-sm">
            <span className="text-lg">⚡</span>
            <div className="flex flex-col leading-none justify-center">
              <span className="font-bold text-slate-700 text-[11px]">Super Voter</span>
              <span className="text-[9px] text-slate-400 mt-0.5">Voted on active decisions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timelines of user's own posts */}
      <div className="p-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
          Your Civic Timeline
        </h3>

        <div className="flex flex-col gap-2">
          {feedItems
            .filter(item => item.author.id === currentUser.id)
            .map(item => (
              <div 
                key={item.id} 
                onClick={() => { onSelectItem(item); setActiveTab("feed"); }}
                className="p-3 bg-white border border-slate-100 rounded-xl hover:border-slate-200 shadow-sm transition duration-150 cursor-pointer flex justify-between items-center text-xs text-left"
              >
                <div className="overflow-hidden">
                  <span className="font-bold text-slate-700 truncate block">
                    {item.title || item.pollQuestion || item.content?.substring(0, 40) + "..."}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Published on {new Date(item.createdAt).toLocaleDateString()} · {item.upvotes} prioritizations · {item.type}
                  </span>
                </div>
                
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase shrink-0 ${
                  item.type === "post" ? "bg-slate-100 text-slate-600" :
                  item.type === "report" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
                }`}>
                  {item.status || "active"}
                </span>
              </div>
            ))}
          {feedItems.filter(item => item.author.id === currentUser.id).length === 0 && (
            <span className="text-xs text-slate-400 py-3 text-center block">
              No published posts found on your timeline.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
