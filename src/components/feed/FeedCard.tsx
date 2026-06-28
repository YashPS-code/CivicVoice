import React from "react";
import {
  ArrowBigUp,
  MessageCircle,
  BarChart2,
  Share2,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Users,
} from "lucide-react";
import { FeedItem, User } from "../../types";
import { CATEGORIES } from "../../constants";

interface FeedCardProps {
  item: FeedItem;
  currentUser: User;
  onLike: (id: string, e: React.MouseEvent) => void;
  onVotePoll: (pollId: string, optionId: string, e: React.MouseEvent) => void;
  onSelect: (item: FeedItem) => void;
  onShowStats: (item: FeedItem) => void;
  onShare: () => void;
  onVerify?: (id: string, e: React.MouseEvent) => void;
  key?: string;
}

export default function FeedCard({
  item,
  currentUser,
  onLike,
  onVotePoll,
  onSelect,
  onShowStats,
  onShare,
  onVerify,
}: FeedCardProps) {
  const hasLiked = item.upvotedBy.includes(currentUser.id);
  const categoryItem = CATEGORIES.find((c) => c.value === item.category);
  const hasVotedOnPoll = item.pollVotedBy && item.pollVotedBy[currentUser.id];
  const userVoteOptionId = item.pollVotedBy && item.pollVotedBy[currentUser.id];
  const hasVerified = item.communityVerifications?.includes(currentUser.id);
  const witnessCount = item.communityVerifications?.length ?? 0;

  const typeConfig = {
    post: { label: "Post", bg: "bg-slate-100 text-slate-500", border: "" },
    report: { label: "Report", bg: "bg-amber-50 text-amber-600", border: "border-l-4 border-amber-400" },
    poll: { label: "Poll", bg: "bg-violet-50 text-violet-600", border: "" },
  };
  const cfg = typeConfig[item.type];

  return (
    <article
      onClick={() => onSelect(item)}
      className="px-5 py-4 flex gap-3 hover:bg-slate-50/60 cursor-pointer transition-colors duration-150 text-left border-b border-slate-100 group"
    >
      {/* Avatar column */}
      <div className="flex flex-col items-center shrink-0">
        <img
          src={item.author.avatar}
          alt={item.author.displayName}
          className="w-10 h-10 rounded-full object-cover border-2 border-twitter-light shadow-sm shrink-0"
        />
        <div className="w-px flex-1 bg-slate-100 group-hover:bg-twitter-blue/20 transition duration-300 my-2" />
      </div>

      {/* Content column */}
      <div className="flex-1 flex flex-col gap-1.5 overflow-hidden min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-hidden min-w-0">
            <span className="font-bold text-sm text-slate-800 hover:text-twitter-blue truncate leading-tight transition">
              {item.author.displayName}
            </span>
            {item.author.isVerified && (
              <ShieldCheck className="w-3.5 h-3.5 text-twitter-blue shrink-0" />
            )}
            <span className="text-xs text-slate-400 truncate hidden sm:block">@{item.author.username}</span>
            <span className="text-slate-300 text-xs hidden sm:block">·</span>
            <span className="text-xs text-slate-400 whitespace-nowrap hidden sm:block">
              {new Date(item.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </span>
          </div>
          <span className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider shrink-0 ${cfg.bg}`}>
            {cfg.label}
          </span>
        </div>

        {/* Ward tag */}
        <div className="flex items-center gap-1 text-[10px] font-semibold text-twitter-blue bg-twitter-light px-2 py-0.5 rounded-md w-fit">
          <MapPin className="w-2.5 h-2.5 shrink-0" />
          {item.locationName || item.ward}
        </div>

        {/* Report title */}
        {item.type === "report" && (
          <div className={`mt-0.5 pl-2.5 ${cfg.border}`}>
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display font-black text-slate-900 text-sm leading-snug">
                {item.title}
              </h2>
              <StatusPill status={item.status} />
            </div>
          </div>
        )}

        {/* Poll question */}
        {item.type === "poll" && (
          <h2 className="font-display font-bold text-slate-900 text-sm leading-snug mt-0.5 flex items-center gap-1.5">
            <span className="text-base">🗳️</span>
            {item.pollQuestion}
          </h2>
        )}

        {/* Content body */}
        {item.content && (
          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap mt-0.5 line-clamp-3">
            {item.content}
          </p>
        )}

        {/* Poll options */}
        {item.type === "poll" && item.pollOptions && (
          <div className="flex flex-col gap-1.5 mt-2">
            {item.pollOptions.map((opt) => {
              const total = item.pollTotalVotes || 0;
              const ratio = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
              const isMyVote = userVoteOptionId === opt.id;

              return (
                <div key={opt.id} className="relative overflow-hidden rounded-xl border border-slate-200">
                  {hasVotedOnPoll && (
                    <div
                      className={`absolute inset-y-0 left-0 transition-all duration-700 ${isMyVote ? "bg-twitter-light" : "bg-slate-50"}`}
                      style={{ width: `${ratio}%` }}
                    />
                  )}
                  <button
                    type="button"
                    disabled={!!hasVotedOnPoll}
                    onClick={(e) => onVotePoll(item.id, opt.id, e)}
                    className={`relative w-full py-2 px-3 flex items-center justify-between text-xs font-semibold text-left z-10 ${
                      hasVotedOnPoll ? "cursor-default" : "hover:bg-slate-50 cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {hasVotedOnPoll && isMyVote && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-twitter-blue stroke-[2.5]" />
                      )}
                      <span className={isMyVote ? "text-twitter-blue font-bold" : "text-slate-700"}>{opt.text}</span>
                    </div>
                    {hasVotedOnPoll && (
                      <span className="text-slate-500 font-bold text-[10px]">{ratio}%</span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Image */}
        {item.image && (
          <div className="mt-2 rounded-2xl overflow-hidden border border-slate-100 max-h-52">
            <img
              src={item.image}
              alt="Attachment"
              className="w-full h-full object-cover transition duration-300 group-hover:scale-[1.01]"
            />
          </div>
        )}

        {/* Tags row */}
        <div className="flex flex-wrap items-center gap-1.5 mt-1">
          {item.type === "report" && categoryItem && (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-50 border border-amber-100 text-amber-700 flex items-center gap-1">
              {categoryItem.icon} {categoryItem.label}
            </span>
          )}
          {item.type === "report" && item.severity && (
            <SeverityBadge severity={item.severity} />
          )}
          {item.type === "poll" && (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-violet-50 border border-violet-100 text-violet-600 flex items-center gap-1">
              <BarChart2 className="w-2.5 h-2.5" />
              {item.pollTotalVotes?.toLocaleString()} votes
            </span>
          )}
          {item.upvotes > 100 && (
            <span className="text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full animate-pulse">
              🔥 Hot
            </span>
          )}
          {item.type === "report" && witnessCount > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center gap-1">
              <Users className="w-2.5 h-2.5" /> {witnessCount} witness{witnessCount !== 1 ? "es" : ""}
            </span>
          )}
        </div>

        {/* Official response */}
        {item.officialResponse && (
          <div className="mt-2 p-3 rounded-xl bg-amber-50 border border-amber-100 flex gap-2.5">
            <img
              src={item.officialResponse.responder.avatar}
              alt=""
              className="w-7 h-7 rounded-full object-cover border border-amber-200 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[11px] font-bold text-slate-800">
                  {item.officialResponse.responder.displayName}
                </span>
                <span className="text-[9px] font-extrabold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded uppercase tracking-wide">
                  Official
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                "{item.officialResponse.text}"
              </p>
            </div>
          </div>
        )}

        {/* Action bar */}
        <div className="flex items-center gap-1 mt-2 pt-2 border-t border-slate-50 text-xs text-slate-400">
          <ActionBtn
            onClick={(e) => onLike(item.id, e)}
            active={hasLiked}
            activeClass="text-red-500 bg-red-50"
            hoverClass="hover:text-red-500 hover:bg-red-50/40"
            icon={<ArrowBigUp className={`w-4 h-4 ${hasLiked ? "fill-red-500" : ""}`} />}
            label={String(item.upvotes)}
          />
          <ActionBtn
            icon={<MessageCircle className="w-4 h-4" />}
            label={String(item.commentsCount)}
            hoverClass="hover:text-twitter-blue hover:bg-twitter-light/50"
          />
          {item.type === "poll" && (
            <ActionBtn
              onClick={(e) => { e.stopPropagation(); onShowStats(item); }}
              icon={<BarChart2 className="w-4 h-4 text-violet-400" />}
              label="Stats"
              hoverClass="hover:text-violet-600 hover:bg-violet-50"
            />
          )}
          {item.type === "report" && onVerify && (
            <ActionBtn
              onClick={(e) => { e.stopPropagation(); onVerify(item.id, e); }}
              active={hasVerified}
              activeClass="text-emerald-600 bg-emerald-50"
              hoverClass="hover:text-emerald-600 hover:bg-emerald-50/40"
              icon={<Users className="w-4 h-4" />}
              label={hasVerified ? "Witnessed" : "Verify"}
            />
          )}
          <ActionBtn
            onClick={(e) => { e.stopPropagation(); onShare(); }}
            icon={<Share2 className="w-4 h-4" />}
            label="Share"
            hoverClass="hover:text-emerald-500 hover:bg-emerald-50/30"
            className="ml-auto"
          />
        </div>
      </div>
    </article>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, string> = {
    low:      "bg-emerald-50 border-emerald-200 text-emerald-700",
    medium:   "bg-amber-50 border-amber-200 text-amber-700",
    high:     "bg-orange-50 border-orange-200 text-orange-700",
    critical: "bg-red-50 border-red-200 text-red-700",
  };
  const labels: Record<string, string> = { low: "🟢 Low", medium: "🟡 Medium", high: "🟠 High", critical: "🔴 Critical" };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${map[severity] || "bg-slate-50 text-slate-500"}`}>
      {labels[severity] || severity}
    </span>
  );
}

function StatusPill({ status }: { status?: string }) {
  if (!status) return null;
  const map: Record<string, { dot: string; label: string }> = {
    open: { dot: "bg-red-500 animate-pulse", label: "Open" },
    under_review: { dot: "bg-amber-500", label: "Under Review" },
    in_progress: { dot: "bg-twitter-blue", label: "In Progress" },
    resolved: { dot: "bg-emerald-500", label: "Resolved" },
  };
  const s = map[status] || { dot: "bg-slate-400", label: status };
  return (
    <div className="flex items-center gap-1.5 shrink-0 px-2 py-1 rounded-lg bg-slate-50 border border-slate-200">
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">{s.label}</span>
    </div>
  );
}

function ActionBtn({
  onClick,
  active,
  activeClass = "",
  hoverClass = "",
  icon,
  label,
  className = "",
}: {
  onClick?: (e: React.MouseEvent) => void;
  active?: boolean;
  activeClass?: string;
  hoverClass?: string;
  icon: React.ReactNode;
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 py-1 px-2 rounded-full font-bold transition duration-150 cursor-pointer select-none ${
        active ? activeClass : hoverClass
      } ${className}`}
    >
      {icon}
      {label && <span>{label}</span>}
    </button>
  );
}
