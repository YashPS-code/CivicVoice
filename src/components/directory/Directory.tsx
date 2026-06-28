import React from "react";
import { Award, ShieldCheck } from "lucide-react";
import { User } from "../../types";

interface DirectoryProps {
  currentUser: User;
  citizens: User[];
  directorySearch: string;
  setDirectorySearch: (query: string) => void;
  onFollowUser: (userId: string) => void;
}

export default function Directory({
  currentUser,
  citizens,
  directorySearch,
  setDirectorySearch,
  onFollowUser
}: DirectoryProps) {
  return (
    <div className="p-4 text-left">
      {/* Search Bar & Stats */}
      <div className="mb-4">
        <h2 className="font-display font-black text-slate-900 text-lg">Ward Residents Directory</h2>
        <p className="text-xs text-slate-500 leading-normal mb-3">
          Connect directly with local active citizens, view unlocked civic badges, follow their updates, or see the top contributors on the reputation board.
        </p>
        
        <input
          id="directory-search-input"
          type="text"
          placeholder="Search active neighbors, officials, or handle name..."
          value={directorySearch}
          onChange={(e) => setDirectorySearch(e.target.value)}
          className="w-full text-xs p-3 rounded-2xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:border-twitter-blue font-medium"
        />
      </div>

      {/* Split screen: Followers List (Left) & Leaderboard (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Residents List */}
        <div className="md:col-span-3 flex flex-col gap-3">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Ward Members</h3>
          
          {citizens
            .filter(cit => {
              const q = directorySearch.toLowerCase();
              return (
                cit.displayName.toLowerCase().includes(q) ||
                cit.username.toLowerCase().includes(q) ||
                cit.ward.toLowerCase().includes(q)
              );
            })
            .map(cit => {
              const isFollowing = currentUser.following?.includes(cit.id);
              return (
                <div 
                  key={cit.id}
                  className="p-3 bg-white border border-slate-100 rounded-2xl flex items-start gap-3 shadow-sm hover:border-slate-200 transition"
                >
                  <img
                    src={cit.avatar}
                    alt={cit.displayName}
                    className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-100"
                  />
                  <div className="flex-1 flex flex-col gap-0.5 overflow-hidden text-left">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="font-bold text-xs text-slate-800 leading-tight truncate max-w-[120px]">{cit.displayName}</span>
                      {cit.isVerified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-500 fill-blue-50 shrink-0" />
                      )}
                      <span className="text-[10px] text-slate-400">@{cit.username}</span>
                    </div>
                    <span className="text-[10px] font-extrabold text-twitter-blue bg-slate-50 px-1.5 py-0.5 rounded w-fit">
                      {cit.ward.split(" (")[1]?.replace(")", "") || cit.ward}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1 font-medium leading-relaxed italic truncate">
                      "{cit.bio}"
                    </p>
                    
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold mt-2">
                      <span>{cit.followersCount} Followers</span>
                      <span>·</span>
                      <span className="text-amber-600">{cit.civicPoints} Civic Rep Points</span>
                    </div>
                  </div>

                  <button
                    id={`follow-user-btn-${cit.id}`}
                    type="button"
                    onClick={() => onFollowUser(cit.id)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-black cursor-pointer transition shrink-0 ${
                      isFollowing 
                        ? "bg-slate-100 text-slate-600 hover:bg-slate-200" 
                        : "bg-twitter-blue text-white hover:bg-twitter-hover"
                    }`}
                  >
                    {isFollowing ? "Following" : "+ Follow"}
                  </button>
                </div>
              );
            })}
        </div>

        {/* Leaderboard */}
        <div className="md:col-span-2 flex flex-col gap-3">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Reputation Leaderboard</h3>
          
          <div className="p-4 bg-gradient-to-br from-amber-50/55 to-orange-50/20 border border-amber-100 rounded-3xl text-left">
            <div className="flex items-center gap-1 text-amber-800 font-black text-xs mb-3">
              <Award className="w-4 h-4 text-amber-600" />
              <span>TOP CONSTITUENTS</span>
            </div>
            
            <div className="flex flex-col gap-2.5">
              {[currentUser, ...citizens]
                .sort((a, b) => b.civicPoints - a.civicPoints)
                .slice(0, 5)
                .map((cit, index) => (
                  <div key={cit.id} className="flex items-center justify-between text-xs font-semibold p-1">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="text-[11px] font-black text-amber-700 w-4">#{index+1}</span>
                      <img src={cit.avatar} alt="Leaderboard avatar" className="w-6.5 h-6.5 rounded-full object-cover shrink-0" />
                      <span className="text-slate-700 truncate font-bold">{cit.displayName}</span>
                    </div>
                    <span className="text-amber-700 font-extrabold">{cit.civicPoints} pts</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
