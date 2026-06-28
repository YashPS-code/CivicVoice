import React, { useState, useEffect, useRef } from "react";
import {
  X,
  FileText,
  AlertTriangle,
  BarChart2,
  Image,
  MapPin,
  Sparkles,
  Loader2,
  Navigation,
  Eye,
} from "lucide-react";
import { User, Category, City, Severity } from "../../types";
import { CATEGORIES } from "../../constants";

interface PostModalProps {
  currentUser: User;
  selectedCity: City;
  selectedWard: string;
  onClose: () => void;
  onPublish: (payload: {
    type: "post" | "report" | "poll";
    content: string;
    image?: string;
    title?: string;
    category?: Category;
    severity?: Severity;
    locationName?: string;
    latitude?: number;
    longitude?: number;
    pollQuestion?: string;
    pollOptions?: string[];
  }) => void;
  showAlert: (text: string, type?: "success" | "error" | "info") => void;
  defaultType?: "post" | "report" | "poll";
}

const TABS: { id: "post" | "report" | "poll"; label: string; icon: React.ElementType; color: string }[] = [
  { id: "post", label: "Post", icon: FileText, color: "text-twitter-blue" },
  { id: "report", label: "Report", icon: AlertTriangle, color: "text-amber-500" },
  { id: "poll", label: "Poll", icon: BarChart2, color: "text-violet-500" },
];

export default function PostModal({
  currentUser,
  selectedCity,
  selectedWard,
  onClose,
  onPublish,
  showAlert,
  defaultType = "post",
}: PostModalProps) {
  const [activeType, setActiveType] = useState<"post" | "report" | "poll">(defaultType);
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [reportTitle, setReportTitle] = useState("");
  const [reportCategory, setReportCategory] = useState<Category>("potholes");
  const [reportLandmark, setReportLandmark] = useState("");
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [reportSeverity, setReportSeverity] = useState<Severity>("medium");
  const [geoCoords, setGeoCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isGeoLoading, setIsGeoLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [activeType]);

  // Escape key to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleGeoTag = () => {
    if (!navigator.geolocation) { showAlert("Geolocation not supported.", "error"); return; }
    setIsGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoCoords({ lat: parseFloat(pos.coords.latitude.toFixed(5)), lng: parseFloat(pos.coords.longitude.toFixed(5)) });
        setIsGeoLoading(false);
        showAlert("Location captured!", "success");
      },
      () => { showAlert("Could not get location — enable browser permissions.", "error"); setIsGeoLoading(false); }
    );
  };

  const handleAIEnhance = async () => {
    if (!reportTitle) { showAlert("Enter a title first.", "error"); return; }
    setIsEnhancing(true);
    try {
      const res = await fetch("/api/gemini/suggest-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: reportTitle, rawDescription: content, city: selectedCity, ward: selectedWard }),
      });
      const data = await res.json();
      setContent(data.enhancedDescription || content);
      setReportCategory((data.suggestedCategory as Category) || reportCategory);
      showAlert("AI enhanced description and category!", "success");
    } catch {
      showAlert("AI enhance unavailable — write manually.", "error");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeType === "post" && !content.trim()) { showAlert("Write something first.", "error"); return; }
    if (activeType === "report" && (!reportTitle.trim() || !content.trim())) { showAlert("Title and description are required.", "error"); return; }
    if (activeType === "poll" && (!pollQuestion.trim() || pollOptions.some((o) => !o.trim()))) { showAlert("Fill in all poll fields.", "error"); return; }

    onPublish({
      type: activeType,
      content,
      image: image || undefined,
      title: activeType === "report" ? reportTitle : undefined,
      category: activeType === "report" ? reportCategory : undefined,
      severity: activeType === "report" ? reportSeverity : undefined,
      locationName: activeType === "report" ? reportLandmark || undefined : undefined,
      latitude: geoCoords?.lat,
      longitude: geoCoords?.lng,
      pollQuestion: activeType === "poll" ? pollQuestion : undefined,
      pollOptions: activeType === "poll" ? pollOptions : undefined,
    });
    onClose();
  };

  const placeholders = {
    post: "What's happening in your ward? Share a civic update…",
    report: "Describe the issue in detail — location, severity, impact…",
    poll: "Explain the context behind your community poll…",
  };

  return (
    /* Full overlay to the right of sidebar */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ paddingLeft: "var(--sidebar-offset, 0px)" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal card */}
      <div className="relative w-full max-w-xl mx-4 bg-white dark:bg-[#061018] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#0f2d3a] animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100 dark:border-[#0f2d3a]">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.displayName}
              className="w-9 h-9 rounded-full object-cover border-2 border-twitter-light"
            />
            <div>
              <p className="font-bold text-sm text-slate-900 dark:text-[#e2f8fc]">
                {currentUser.displayName}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-[#6fa3b3]">
                {selectedWard === "All Wards" ? selectedCity : selectedWard}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-[#0f2d3a] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type tabs */}
        <div className="flex gap-1 px-5 pt-4">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveType(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  active
                    ? "bg-twitter-light text-twitter-blue border border-twitter-blue/30"
                    : "text-slate-500 hover:bg-slate-50 dark:hover:bg-[#0f2d3a]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? "text-twitter-blue" : tab.color}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 flex flex-col gap-4">
          {/* Report-specific fields */}
          {activeType === "report" && (
            <div className="flex flex-col gap-3">
              <input
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                placeholder="Issue title (e.g. Broken streetlight on MG Road)"
                className="w-full rounded-xl border border-slate-200 dark:border-[#1a4055] bg-slate-50 dark:bg-[#0a1a24] px-4 py-2.5 text-sm text-slate-900 dark:text-[#e2f8fc] placeholder:text-slate-400 focus:outline-none focus:border-twitter-blue/60 transition"
              />
              <div className="flex gap-2">
                <select
                  value={reportCategory}
                  onChange={(e) => setReportCategory(e.target.value as Category)}
                  className="flex-1 rounded-xl border border-slate-200 dark:border-[#1a4055] bg-slate-50 dark:bg-[#0a1a24] px-3 py-2.5 text-sm text-slate-700 dark:text-[#a8d8e4] focus:outline-none focus:border-twitter-blue/60 transition"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
                  ))}
                </select>
                <input
                  value={reportLandmark}
                  onChange={(e) => setReportLandmark(e.target.value)}
                  placeholder="Landmark / address"
                  className="flex-1 rounded-xl border border-slate-200 dark:border-[#1a4055] bg-slate-50 dark:bg-[#0a1a24] px-3 py-2.5 text-sm text-slate-700 dark:text-[#a8d8e4] placeholder:text-slate-400 focus:outline-none focus:border-twitter-blue/60 transition"
                />
              </div>
              {/* Severity picker */}
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Severity</p>
                <div className="flex gap-1.5">
                  {(["low", "medium", "high", "critical"] as Severity[]).map((s) => {
                    const cfg = { low: "border-emerald-300 text-emerald-700 bg-emerald-50", medium: "border-amber-300 text-amber-700 bg-amber-50", high: "border-orange-400 text-orange-700 bg-orange-50", critical: "border-red-400 text-red-700 bg-red-50" };
                    const active = reportSeverity === s;
                    return (
                      <button key={s} type="button" onClick={() => setReportSeverity(s)}
                        className={`capitalize text-[11px] font-bold px-2.5 py-1 rounded-lg border transition ${cfg[s]} ${active ? "ring-2 ring-offset-1 ring-current opacity-100" : "opacity-50 hover:opacity-80"}`}>
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Poll question */}
          {activeType === "poll" && (
            <input
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e.target.value)}
              placeholder="What would you like citizens to vote on?"
              className="w-full rounded-xl border border-slate-200 dark:border-[#1a4055] bg-slate-50 dark:bg-[#0a1a24] px-4 py-2.5 text-sm text-slate-900 dark:text-[#e2f8fc] placeholder:text-slate-400 focus:outline-none focus:border-twitter-blue/60 transition"
            />
          )}

          {/* Main content textarea */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholders[activeType]}
            rows={activeType === "post" ? 4 : 3}
            className="w-full rounded-xl border border-slate-200 dark:border-[#1a4055] bg-slate-50 dark:bg-[#0a1a24] px-4 py-3 text-sm text-slate-900 dark:text-[#e2f8fc] placeholder:text-slate-400 focus:outline-none focus:border-twitter-blue/60 resize-none transition leading-relaxed"
          />

          {/* Poll options */}
          {activeType === "poll" && (
            <div className="flex flex-col gap-2">
              {pollOptions.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 w-5">{i + 1}.</span>
                  <input
                    value={opt}
                    onChange={(e) => {
                      const updated = [...pollOptions];
                      updated[i] = e.target.value;
                      setPollOptions(updated);
                    }}
                    placeholder={`Option ${i + 1}`}
                    className="flex-1 rounded-xl border border-slate-200 dark:border-[#1a4055] bg-slate-50 dark:bg-[#0a1a24] px-3 py-2 text-sm text-slate-900 dark:text-[#e2f8fc] placeholder:text-slate-400 focus:outline-none focus:border-twitter-blue/60 transition"
                  />
                  {pollOptions.length > 2 && (
                    <button
                      type="button"
                      onClick={() => setPollOptions(pollOptions.filter((_, j) => j !== i))}
                      className="text-slate-400 hover:text-red-500 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {pollOptions.length < 4 && (
                <button
                  type="button"
                  onClick={() => setPollOptions([...pollOptions, ""])}
                  className="text-xs font-semibold text-twitter-blue hover:text-twitter-hover transition self-start ml-7"
                >
                  + Add option
                </button>
              )}
            </div>
          )}

          {/* Image URL with preview */}
          {activeType !== "poll" && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Image className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Paste image URL to attach photo evidence"
                  className="flex-1 rounded-xl border border-slate-200 dark:border-[#1a4055] bg-slate-50 dark:bg-[#0a1a24] px-3 py-2 text-xs text-slate-700 dark:text-[#a8d8e4] placeholder:text-slate-400 focus:outline-none focus:border-twitter-blue/60 transition"
                />
                {image && (
                  <button type="button" onClick={() => setImage("")} className="text-slate-400 hover:text-red-500 transition">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {image && (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 max-h-36 group">
                  <img src={image} alt="Preview" className="w-full h-full object-cover" onError={() => setImage("")} />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer actions */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-[#0f2d3a]">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-twitter-blue" />
                <span>{geoCoords ? `${geoCoords.lat}, ${geoCoords.lng}` : (selectedWard === "All Wards" ? selectedCity : selectedWard)}</span>
              </div>
              {activeType === "report" && (
                <button type="button" onClick={handleGeoTag} disabled={isGeoLoading}
                  className="flex items-center gap-1 text-[10px] font-bold text-twitter-blue bg-twitter-light px-2 py-1 rounded-lg hover:bg-cyan-100 transition disabled:opacity-50">
                  {isGeoLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Navigation className="w-3 h-3" />}
                  {geoCoords ? "Re-tag" : "Geo-tag"}
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              {activeType === "report" && (
                <button
                  type="button"
                  onClick={handleAIEnhance}
                  disabled={isEnhancing}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-violet-50 text-violet-600 hover:bg-violet-100 transition disabled:opacity-50"
                >
                  {isEnhancing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  AI Enhance
                </button>
              )}
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-twitter-blue hover:bg-twitter-hover text-white text-xs font-bold transition active:scale-95"
              >
                {activeType === "report" ? "File Report" : activeType === "poll" ? "Launch Poll" : "Publish"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
