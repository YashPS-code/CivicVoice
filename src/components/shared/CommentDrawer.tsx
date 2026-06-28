import React, { useState } from "react";
import { X, Heart, ShieldCheck, ShieldAlert, Sparkles, Clock, CheckCircle2, AlertTriangle, RotateCcw, Target } from "lucide-react";
import { Comment, FeedItem, User } from "../../types";

interface CommentDrawerProps {
  currentUser: User;
  selectedItem: FeedItem;
  comments: Comment[];
  onClose: () => void;
  onLikeItem: () => void;
  onAddComment: (text: string) => Promise<boolean>;
  onDraftOfficialResponse: () => Promise<string | null>;
  onSubmitOfficialResponse: (text: string) => void;
}

export default function CommentDrawer({
  currentUser,
  selectedItem,
  comments,
  onClose,
  onLikeItem,
  onAddComment,
  onDraftOfficialResponse,
  onSubmitOfficialResponse
}: CommentDrawerProps) {
  const [newCommentText, setNewCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [officialResponseText, setOfficialResponseText] = useState("");
  const [isDraftingOfficialResponse, setIsDraftingOfficialResponse] = useState(false);

  const handleCommentSubmit = async () => {
    if (!newCommentText.trim()) return;
    setIsSubmittingComment(true);
    const success = await onAddComment(newCommentText);
    if (success) {
      setNewCommentText("");
    }
    setIsSubmittingComment(false);
  };

  const handleAIDraft = async () => {
    setIsDraftingOfficialResponse(true);
    const drafted = await onDraftOfficialResponse();
    if (drafted) {
      setOfficialResponseText(drafted);
    }
    setIsDraftingOfficialResponse(false);
  };

  const handleOfficialSubmit = () => {
    if (!officialResponseText.trim()) return;
    onSubmitOfficialResponse(officialResponseText);
    setOfficialResponseText("");
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 flex justify-end">
      <div className="flex-1" onClick={onClose} />
      
      <div className="w-full max-w-lg bg-white h-screen flex flex-col shadow-2xl relative animate-fade-in">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10 text-left">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Discussion Thread</span>
            <span className="text-xs font-bold text-twitter-blue truncate max-w-[300px]">
              #{selectedItem.id}
            </span>
          </div>
          <button 
            id="close-drawer-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Thread Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 text-left">
          
          {/* Context Post */}
          <div className="border-b border-slate-100 pb-4">
            <div className="flex gap-2.5 items-center text-xs text-slate-400 mb-2">
              <img
                src={selectedItem.author.avatar}
                alt={selectedItem.author.displayName}
                className="w-9 h-9 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-slate-800">{selectedItem.author.displayName}</span>
                  {selectedItem.author.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />}
                </div>
                <span>@{selectedItem.author.username}</span>
              </div>
            </div>

            {selectedItem.title && (
              <h3 className="font-display font-black text-slate-900 text-base leading-snug">
                {selectedItem.title}
              </h3>
            )}
            {selectedItem.pollQuestion && (
              <h3 className="font-display font-black text-blue-700 text-base leading-snug">
                🗳️ {selectedItem.pollQuestion}
              </h3>
            )}
            <p className="text-xs text-slate-600 mt-1.5 whitespace-pre-wrap leading-relaxed font-medium">
              {selectedItem.content}
            </p>

            {selectedItem.image && (
              <div className="mt-3 rounded-2xl overflow-hidden border border-slate-100 max-h-48">
                <img src={selectedItem.image} alt="Report Attachment Detail" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex flex-wrap gap-1.5 mt-3 text-[10px] font-bold text-slate-400">
              <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-500">
                WARD: {selectedItem.ward}
              </span>
              <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-500">
                TYPE: {selectedItem.type.toUpperCase()}
              </span>
            </div>

            {/* Vote prioritize in details */}
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mt-4 border-t border-b border-slate-50 py-2">
              <span className="font-bold text-slate-700">{selectedItem.upvotes} prioritizations</span>
              
              <button
                id="drawer-upvote-button"
                type="button"
                onClick={onLikeItem}
                className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 font-bold text-xs rounded-full cursor-pointer hover:bg-red-100 transition"
              >
                <Heart className="w-3.5 h-3.5 fill-red-600" />
                <span>Upvote / Like</span>
              </button>
            </div>
          </div>

          {/* Status timeline for reports */}
          {selectedItem.type === "report" && (selectedItem.statusHistory?.length || selectedItem.predictedResolutionDays) && (
            <StatusTimeline item={selectedItem} />
          )}

          {/* Councillor Response bubble in details */}
          {selectedItem.officialResponse && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/30 border border-amber-200 text-left">
              <div className="flex items-center gap-2 mb-1.5">
                <img
                  src={selectedItem.officialResponse.responder.avatar}
                  alt="Official responder"
                  className="w-8 h-8 rounded-full object-cover border border-amber-300 shrink-0"
                />
                <div className="flex flex-col leading-none">
                  <div className="flex items-center gap-0.5">
                    <span className="font-bold text-xs text-slate-900">{selectedItem.officialResponse.responder.displayName}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  </div>
                  <span className="text-[9px] text-amber-700 bg-amber-100 px-1 rounded-full uppercase w-fit mt-0.5 font-bold">Ward Councillor</span>
                </div>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                {selectedItem.officialResponse.text}
              </p>
              <span className="text-[10px] text-slate-400 mt-2 block font-medium">
                Posted on {new Date(selectedItem.officialResponse.createdAt).toLocaleString()}
              </span>
            </div>
          )}

          {/* Councillor response draft inputs if official */}
          {currentUser.role === "official" && selectedItem.type === "report" && !selectedItem.officialResponse && (
            <div className="p-3.5 rounded-2xl bg-amber-50/40 border border-amber-100 text-left flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-amber-800">Publish Resolution Order</span>
                <button
                  id="btn-ai-draft-reply"
                  type="button"
                  onClick={handleAIDraft}
                  disabled={isDraftingOfficialResponse}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-600 text-white font-bold text-[10px] hover:bg-amber-700 disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 animate-pulse" />
                  <span>{isDraftingOfficialResponse ? "Drafting..." : "AI Response Assistant"}</span>
                </button>
              </div>
              <textarea
                id="official-response-textarea-detail"
                placeholder="Enter dispatch updates, budget allocations, or public scheduled repair inspection deadlines..."
                value={officialResponseText}
                onChange={(e) => setOfficialResponseText(e.target.value)}
                className="w-full text-xs p-2 rounded-lg bg-white border border-slate-200 focus:outline-none h-20 text-slate-700 font-medium"
              />
              <button
                id="btn-publish-official-reply"
                type="button"
                onClick={handleOfficialSubmit}
                className="w-full py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Broadcast Councillor Update
              </button>
            </div>
          )}

          {/* Replies/Comments Loop */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
              Ward Discussion ({selectedItem.commentsCount})
            </h4>

            {/* Input form */}
            <div className="flex gap-2 items-start mt-1">
              <img src={currentUser.avatar} alt="Current replier avatar" className="w-8 h-8 rounded-full object-cover border border-slate-100 shrink-0" />
              <div className="flex-1 flex flex-col gap-1.5">
                <textarea
                  id="reply-comment-textarea"
                  placeholder="Add respectful, local neighborhood context..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-twitter-blue font-medium text-slate-700"
                />
                <div className="flex justify-between items-center">
                  <span className="text-[9.5px] text-slate-400 font-semibold leading-none text-left">
                    ⚠️ Dynamic AI Content Guard evaluates dialogue safety.
                  </span>
                  <button
                    id="btn-comment-publish"
                    type="button"
                    onClick={handleCommentSubmit}
                    disabled={isSubmittingComment || !newCommentText.trim()}
                    className="py-1 px-4 bg-twitter-blue hover:bg-twitter-hover disabled:opacity-50 text-white font-bold text-xs rounded-lg transition duration-150 cursor-pointer"
                  >
                    {isSubmittingComment ? "Evaluating..." : "Reply"}
                  </button>
                </div>
              </div>
            </div>

            {/* List */}
            <div className="flex flex-col gap-3.5 mt-4">
              {comments.map((com) => (
                <div key={com.id} className="flex gap-2.5 items-start text-xs border-b border-slate-50 pb-2 text-left">
                  <img src={com.author.avatar} alt="Replier list avatar" className="w-8 h-8 rounded-full object-cover shrink-0" />
                  <div className="flex-1 flex flex-col gap-0.5">
                    <div className="flex items-center gap-1 font-bold text-slate-800 flex-wrap">
                      <span>{com.author.displayName}</span>
                      {com.author.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                      <span className="text-slate-400 font-medium">@{com.author.username}</span>
                      <span className="text-[10px] text-slate-300 mx-1">·</span>
                      <span className="text-[10px] text-slate-400 font-medium">{new Date(com.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    {com.isFlagged && (
                      <div className="flex items-center gap-1 text-[9.5px] text-red-600 bg-red-50 border border-red-100 py-0.5 px-2 rounded-full w-fit mb-1 font-extrabold leading-none">
                        <ShieldAlert className="w-3 h-3 shrink-0" />
                        <span>Redacted: Toxicity Warning</span>
                      </div>
                    )}

                    <p className={`leading-relaxed text-slate-600 font-medium ${com.isFlagged ? "italic text-slate-400" : ""}`}>
                      {com.text}
                    </p>
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <span className="text-xs text-slate-400 italic text-center py-6 block">
                  No replies posted yet. Start the ward discussion!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusTimeline({ item }: { item: FeedItem }) {
  const statusConfig = {
    open:         { icon: AlertTriangle, color: "text-red-500",      bg: "bg-red-50 border-red-200",       label: "Reported"     },
    under_review: { icon: RotateCcw,     color: "text-amber-600",    bg: "bg-amber-50 border-amber-200",   label: "Under Review" },
    in_progress:  { icon: Clock,         color: "text-twitter-blue", bg: "bg-twitter-light border-twitter-blue/30", label: "In Progress" },
    resolved:     { icon: CheckCircle2,  color: "text-emerald-600",  bg: "bg-emerald-50 border-emerald-200", label: "Resolved"   },
  };

  const allSteps: (keyof typeof statusConfig)[] = ["open", "under_review", "in_progress", "resolved"];
  const currentIdx = allSteps.indexOf(item.status as keyof typeof statusConfig);

  return (
    <div className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50">
      <div className="flex items-center gap-2 mb-3">
        <Target className="w-4 h-4 text-twitter-blue" />
        <h4 className="text-xs font-bold text-slate-700">Issue Progress</h4>
        {item.predictedResolutionDays && item.status !== "resolved" && (
          <span className="ml-auto text-[10px] font-bold text-violet-600 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full">
            AI: ~{item.predictedResolutionDays}d est.
          </span>
        )}
      </div>
      <div className="flex items-start">
        {allSteps.map((step, i) => {
          const done = i <= currentIdx;
          const cfg = statusConfig[step];
          const Icon = cfg.icon;
          const history = item.statusHistory?.find(h => h.status === step);
          return (
            <div key={step} className="flex-1 flex flex-col items-center relative">
              {i > 0 && (
                <div className={`absolute right-1/2 left-0 top-3.5 h-0.5 -translate-y-1/2 ${done ? "bg-twitter-blue" : "bg-slate-200"}`} />
              )}
              {i < allSteps.length - 1 && (
                <div className={`absolute left-1/2 right-0 top-3.5 h-0.5 -translate-y-1/2 ${i < currentIdx ? "bg-twitter-blue" : "bg-slate-200"}`} />
              )}
              <div className={`relative z-10 w-7 h-7 rounded-full border-2 flex items-center justify-center ${done ? `${cfg.bg} ${cfg.color} border-current` : "bg-white border-slate-200 text-slate-300"}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className={`text-[8px] font-bold text-center mt-1 leading-tight ${done ? cfg.color : "text-slate-400"}`}>
                {cfg.label}
              </span>
              {history && (
                <span className="text-[7px] text-slate-400 mt-0.5">
                  {new Date(history.changedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
