import React from "react";
import { Zap, Trophy, ChevronRight, Lock } from "lucide-react";
import { User } from "../../types";
import { ALL_ACHIEVEMENTS, RARITY_CONFIG } from "../../data/achievements";

interface GamificationWidgetProps {
  currentUser: User;
  onOpenProfile: () => void;
}

export default function GamificationWidget({ currentUser, onOpenProfile }: GamificationWidgetProps) {
  const unlockedIds = new Set((currentUser.achievements || []).map(a => a.id));

  const previewAchievements = ALL_ACHIEVEMENTS.slice(0, 6);
  const unlockedCount = previewAchievements.filter(a => unlockedIds.has(a.id)).length;

  const streakDays = currentUser.streak || 0;
  const nextMilestone = streakDays < 7 ? 7 : streakDays < 30 ? 30 : 90;
  const streakProgress = Math.min((streakDays / nextMilestone) * 100, 100);

  return (
    <div className="flex flex-col gap-3 p-4 rounded-2xl border border-slate-100 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-black text-slate-700">
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          Achievements
        </div>
        <button onClick={onOpenProfile}
          className="text-[10px] font-bold text-twitter-blue hover:underline flex items-center gap-0.5">
          All <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Points + streak row */}
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 p-2.5 rounded-xl bg-twitter-light border border-twitter-blue/20">
          <Zap className="w-4 h-4 text-twitter-blue shrink-0" />
          <div>
            <p className="font-black text-sm text-twitter-blue leading-none">{currentUser.civicPoints}</p>
            <p className="text-[9px] text-slate-500 font-semibold">Civic Points</p>
          </div>
        </div>
        {streakDays > 0 && (
          <div className="flex-1 flex items-center gap-2 p-2.5 rounded-xl bg-orange-50 border border-orange-200">
            <span className="text-base shrink-0">🔥</span>
            <div>
              <p className="font-black text-sm text-orange-600 leading-none">{streakDays}d</p>
              <p className="text-[9px] text-slate-500 font-semibold">Streak</p>
            </div>
          </div>
        )}
      </div>

      {/* Streak progress (if active) */}
      {streakDays > 0 && (
        <div>
          <div className="flex justify-between text-[9px] font-bold text-slate-400 mb-1">
            <span>{streakDays} days active</span>
            <span>Goal: {nextMilestone}d</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5">
            <div className="h-1.5 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 transition-all"
              style={{ width: `${streakProgress}%` }} />
          </div>
        </div>
      )}

      {/* Achievement badges grid */}
      <div className="grid grid-cols-3 gap-1.5">
        {previewAchievements.map(a => {
          const unlocked = unlockedIds.has(a.id);
          const cfg = RARITY_CONFIG[a.rarity];
          return (
            <div key={a.id} title={a.name}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition ${
                unlocked ? `${cfg.bg} ${cfg.border}` : "bg-slate-50 border-slate-100 opacity-40 grayscale"
              }`}>
              <span className="text-lg leading-none">{unlocked ? a.emoji : "🔒"}</span>
              <span className={`text-[8px] font-bold text-center leading-tight ${unlocked ? cfg.color : "text-slate-400"}`}>
                {a.name}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-slate-400 text-center">
        {unlockedCount}/{previewAchievements.length} unlocked · <button onClick={onOpenProfile} className="text-twitter-blue font-bold hover:underline">View all badges</button>
      </p>
    </div>
  );
}
