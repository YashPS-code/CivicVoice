import React, { useState } from "react";
import {
  TrendingUp, TrendingDown, CheckCircle2, AlertTriangle, Users,
  BarChart2, MapPin, Zap, Brain, Target, Clock, Award,
  ChevronRight, RefreshCw, Shield, Activity
} from "lucide-react";
import { City } from "../../types";
import { CITY_DASHBOARDS, AIInsight } from "../../data/dashboard";

interface DashboardPageProps {
  selectedCity: City;
  currentUserId: string;
}

export default function DashboardPage({ selectedCity, currentUserId }: DashboardPageProps) {
  const [activeSection, setActiveSection] = useState<"overview" | "map" | "ai" | "leaderboard">("overview");
  const data = CITY_DASHBOARDS[selectedCity];

  return (
    <div className="flex flex-col text-left pb-8">
      {/* Page header */}
      <div className="px-5 pt-6 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-2 text-twitter-blue text-xs font-extrabold uppercase tracking-wider mb-1">
          <Activity className="w-3.5 h-3.5" />
          Impact Dashboard
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display font-black text-2xl text-slate-900 leading-tight">
              {selectedCity} Civic Intelligence
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Real-time transparency · AI-powered insights · Community accountability
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-full shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live data
          </div>
        </div>

        {/* Section tabs */}
        <div className="flex gap-1 mt-4 overflow-x-auto">
          {([
            { id: "overview",    label: "Overview",    icon: BarChart2  },
            { id: "map",         label: "Ward Map",    icon: MapPin     },
            { id: "ai",          label: "AI Insights", icon: Brain      },
            { id: "leaderboard", label: "Leaderboard", icon: Award      },
          ] as const).map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveSection(id)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeSection === id
                  ? "bg-twitter-blue text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}>
              <Icon className="w-3 h-3" />{label}
            </button>
          ))}
        </div>
      </div>

      {/* ── OVERVIEW ── */}
      {activeSection === "overview" && (
        <div className="flex flex-col gap-6 px-5 pt-5">
          {/* KPI grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <KPICard label="Total Reports"       value={data.totalReports.toLocaleString()} icon="📋" color="blue"   trend="+12% vs last month" up />
            <KPICard label="Resolved"             value={data.resolvedReports.toLocaleString()} icon="✅" color="green"  trend={`${data.resolutionRate}% rate`} up />
            <KPICard label="Open Issues"          value={data.openReports.toLocaleString()}     icon="🔴" color="red"    trend="-8% vs last month"  up />
            <KPICard label="Avg Resolution"       value={`${data.avgResolutionDays}d`}           icon="⏱️" color="amber"  trend="days per issue" />
            <KPICard label="Citizens Engaged"     value={data.citizensEngaged.toLocaleString()}  icon="👥" color="violet" trend="+340 this week" up />
            <KPICard label="Reports Today"        value={data.reportsToday.toString()}           icon="📍" color="teal"   trend="filed today" up />
          </div>

          {/* Resolution rate arc */}
          <div className="p-4 rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-twitter-light/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-sm text-slate-800">Resolution Rate</h3>
              <span className="text-[10px] font-bold text-twitter-blue bg-twitter-light px-2 py-0.5 rounded-full">
                {data.resolutionRate}% resolved
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-twitter-blue to-emerald-500 transition-all duration-1000"
                style={{ width: `${data.resolutionRate}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-medium">
              <span>0%</span><span>Target: 80%</span><span>100%</span>
            </div>
          </div>

          {/* 7-day trend chart */}
          <DailyTrendChart stats={data.dailyStats} />

          {/* Category breakdown */}
          <CategoryBreakdown stats={data.categoryStats} />
        </div>
      )}

      {/* ── WARD MAP ── */}
      {activeSection === "map" && (
        <div className="px-5 pt-5">
          <WardHeatmap wardStats={data.wardStats} city={selectedCity} />
        </div>
      )}

      {/* ── AI INSIGHTS ── */}
      {activeSection === "ai" && (
        <div className="px-5 pt-5 flex flex-col gap-4">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-violet-50 border border-violet-100">
            <Brain className="w-4 h-4 text-violet-600 shrink-0" />
            <p className="text-xs text-violet-700 font-medium">
              Gemini AI analyses historical patterns, current report density, and weather data to surface predictive civic alerts.
            </p>
          </div>
          {data.aiInsights.map(insight => (
            <AIInsightCard key={insight.id} insight={insight} />
          ))}
          <PredictiveResolutionTable stats={data.categoryStats} />
        </div>
      )}

      {/* ── LEADERBOARD ── */}
      {activeSection === "leaderboard" && (
        <div className="px-5 pt-5 flex flex-col gap-4">
          <div className="p-4 rounded-2xl border border-twitter-blue/20 bg-twitter-light/30">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-twitter-blue" />
              <h3 className="font-display font-bold text-sm text-slate-800">Civic Champions — {selectedCity}</h3>
            </div>
            <p className="text-[11px] text-slate-500">Top contributors by Civic Points this month</p>
          </div>
          {data.leaderboard.map(entry => (
            <LeaderboardRow key={entry.userId} entry={entry} isCurrentUser={entry.userId === currentUserId} />
          ))}
          <GamificationGuide />
        </div>
      )}
    </div>
  );
}

/* ── Sub-components ── */

function KPICard({ label, value, icon, color, trend, up }: {
  label: string; value: string; icon: string; color: string; trend: string; up?: boolean;
}) {
  const colorMap: Record<string, string> = {
    blue:   "from-twitter-light to-cyan-50 border-twitter-blue/20 text-twitter-blue",
    green:  "from-emerald-50 to-green-50 border-emerald-200 text-emerald-600",
    red:    "from-red-50 to-rose-50 border-red-200 text-red-500",
    amber:  "from-amber-50 to-yellow-50 border-amber-200 text-amber-600",
    violet: "from-violet-50 to-purple-50 border-violet-200 text-violet-600",
    teal:   "from-teal-50 to-cyan-50 border-teal-200 text-teal-600",
  };
  return (
    <div className={`p-3.5 rounded-2xl border bg-gradient-to-br ${colorMap[color]} flex flex-col gap-1`}>
      <span className="text-lg leading-none">{icon}</span>
      <span className="font-display font-black text-2xl text-slate-900 leading-none mt-1">{value}</span>
      <span className="text-[10px] font-bold text-slate-500 leading-tight">{label}</span>
      <span className={`text-[9px] font-bold mt-0.5 flex items-center gap-0.5 ${up ? "text-emerald-600" : "text-slate-400"}`}>
        {up && <TrendingUp className="w-2.5 h-2.5" />}
        {trend}
      </span>
    </div>
  );
}

function DailyTrendChart({ stats }: { stats: { date: string; reported: number; resolved: number }[] }) {
  const maxVal = Math.max(...stats.flatMap(s => [s.reported, s.resolved]));
  return (
    <div className="p-4 rounded-2xl border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-sm text-slate-800">7-Day Issue Trend</h3>
        <div className="flex items-center gap-3 text-[10px] font-semibold">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-twitter-blue" />Reported</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" />Resolved</span>
        </div>
      </div>
      <div className="flex items-end gap-2 h-28">
        {stats.map((s, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
            <div className="w-full flex items-end gap-0.5" style={{ height: "88px" }}>
              <div className="flex-1 rounded-t-sm bg-twitter-blue/30 hover:bg-twitter-blue/60 transition"
                style={{ height: `${(s.reported / maxVal) * 100}%` }} title={`Reported: ${s.reported}`} />
              <div className="flex-1 rounded-t-sm bg-emerald-500/40 hover:bg-emerald-500/70 transition"
                style={{ height: `${(s.resolved / maxVal) * 100}%` }} title={`Resolved: ${s.resolved}`} />
            </div>
            <span className="text-[8px] text-slate-400 font-medium">{s.date.split(" ")[1]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryBreakdown({ stats }: { stats: { category: string; label: string; emoji: string; count: number; resolved: number; avgDays: number; color: string }[] }) {
  const maxCount = Math.max(...stats.map(s => s.count));
  return (
    <div className="p-4 rounded-2xl border border-slate-100">
      <h3 className="font-display font-bold text-sm text-slate-800 mb-4">Category Breakdown</h3>
      <div className="flex flex-col gap-3">
        {stats.map(s => {
          const resRate = s.count > 0 ? Math.round((s.resolved / s.count) * 100) : 0;
          return (
            <div key={s.category}>
              <div className="flex items-center justify-between mb-1 text-xs">
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <span>{s.emoji}</span>{s.label}
                </span>
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <span className="text-slate-400">{s.count}</span>
                  <span className="text-emerald-600">{resRate}%</span>
                  {s.avgDays > 0 && <span className="text-slate-400">{s.avgDays}d avg</span>}
                </div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="h-2 rounded-full flex gap-0 overflow-hidden"
                  style={{ width: `${(s.count / maxCount) * 100}%` }}>
                  <div className="h-full rounded-full" style={{ width: `${resRate}%`, backgroundColor: s.color, opacity: 0.9 }} />
                  <div className="h-full flex-1 rounded-r-full" style={{ backgroundColor: s.color, opacity: 0.2 }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WardHeatmap({ wardStats, city }: { wardStats: { ward: string; issueCount: number; resolved: number; pending: number }[]; city: string }) {
  const maxIssues = Math.max(...wardStats.map(w => w.issueCount));
  const getIntensity = (count: number) => Math.round((count / maxIssues) * 100);
  const getColor = (intensity: number) => {
    if (intensity >= 80) return "bg-red-500 text-white";
    if (intensity >= 60) return "bg-orange-400 text-white";
    if (intensity >= 40) return "bg-amber-400 text-slate-800";
    if (intensity >= 20) return "bg-yellow-300 text-slate-800";
    return "bg-emerald-200 text-slate-700";
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="p-4 rounded-2xl border border-slate-100">
        <h3 className="font-display font-bold text-sm text-slate-800 mb-1">Ward Issue Heatmap</h3>
        <p className="text-[11px] text-slate-400 mb-4">Intensity by unresolved report count · Click a ward to filter feed</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {wardStats.map(w => {
            const intensity = getIntensity(w.pending);
            const resRate = Math.round((w.resolved / w.issueCount) * 100);
            return (
              <div key={w.ward}
                className={`p-3 rounded-xl cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md ${getColor(intensity)}`}>
                <p className="font-bold text-xs leading-tight truncate">{w.ward}</p>
                <p className="text-[10px] mt-1 font-medium opacity-90">{w.pending} open · {resRate}% resolved</p>
                <div className="mt-1.5 w-full bg-black/10 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-white/70" style={{ width: `${resRate}%` }} />
                </div>
              </div>
            );
          })}
        </div>
        {/* Legend */}
        <div className="flex items-center gap-2 mt-4 text-[9px] font-bold text-slate-500">
          <span>Low</span>
          {["bg-emerald-200", "bg-yellow-300", "bg-amber-400", "bg-orange-400", "bg-red-500"].map((c, i) => (
            <div key={i} className={`w-6 h-3 rounded-sm ${c}`} />
          ))}
          <span>Critical</span>
        </div>
      </div>

      {/* Ward comparison table */}
      <div className="p-4 rounded-2xl border border-slate-100">
        <h3 className="font-display font-bold text-sm text-slate-800 mb-3">Ward Performance Table</h3>
        <div className="flex flex-col gap-0 divide-y divide-slate-50">
          {wardStats.sort((a, b) => b.pending - a.pending).map((w, i) => (
            <div key={w.ward} className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-black text-slate-300 w-4">{i + 1}</span>
                <div>
                  <p className="text-xs font-bold text-slate-700">{w.ward}</p>
                  <p className="text-[9px] text-slate-400">{w.issueCount} total reports</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-bold">
                <span className="text-red-500">{w.pending} open</span>
                <span className="text-emerald-600">{w.resolved} done</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AIInsightCard({ insight }: { insight: AIInsight; key?: string }) {
  const severityMap = {
    critical: { bg: "bg-red-50 border-red-200",      text: "text-red-700",    badge: "bg-red-100 text-red-700"    },
    warning:  { bg: "bg-amber-50 border-amber-200",   text: "text-amber-700",  badge: "bg-amber-100 text-amber-700" },
    info:     { bg: "bg-twitter-light border-twitter-blue/20", text: "text-twitter-blue", badge: "bg-twitter-light text-twitter-blue" },
  };
  const typeLabel = { hotspot: "🔥 Hotspot", prediction: "🔮 Prediction", trend: "📈 Trend", alert: "🚨 Alert" };
  const s = severityMap[insight.severity];
  return (
    <div className={`p-4 rounded-2xl border ${s.bg} flex flex-col gap-2`}>
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">{typeLabel[insight.type]}</span>
        <div className="flex items-center gap-1.5">
          {insight.ward && (
            <span className="text-[9px] font-bold text-slate-500 bg-white px-1.5 py-0.5 rounded-full border">
              <MapPin className="w-2.5 h-2.5 inline mr-0.5" />{insight.ward}
            </span>
          )}
          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${s.badge}`}>
            {insight.confidence}% conf.
          </span>
        </div>
      </div>
      <div className="flex items-start gap-2.5">
        <span className="text-xl shrink-0">{insight.emoji}</span>
        <div>
          <h4 className={`font-display font-bold text-sm leading-snug ${s.text}`}>{insight.title}</h4>
          <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{insight.description}</p>
        </div>
      </div>
      <div className="flex items-center justify-between pt-1 border-t border-white/60">
        <div className="flex items-center gap-1 text-[9px] text-slate-400 font-medium">
          <Brain className="w-2.5 h-2.5" />Powered by Gemini AI
        </div>
        <button className={`text-[10px] font-bold ${s.text} hover:underline flex items-center gap-0.5`}>
          View related reports <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

function PredictiveResolutionTable({ stats }: { stats: { label: string; emoji: string; avgDays: number; count: number; resolved: number }[] }) {
  return (
    <div className="p-4 rounded-2xl border border-slate-100">
      <div className="flex items-center gap-2 mb-3">
        <Target className="w-4 h-4 text-violet-500" />
        <h3 className="font-display font-bold text-sm text-slate-800">Predicted Resolution Times</h3>
      </div>
      <div className="flex flex-col gap-0 divide-y divide-slate-50">
        {stats.filter(s => s.avgDays > 0).sort((a, b) => b.avgDays - a.avgDays).map(s => (
          <div key={s.label} className="flex items-center justify-between py-2.5">
            <span className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
              {s.emoji} {s.label}
            </span>
            <div className="flex items-center gap-2">
              <div className="w-20 bg-slate-100 rounded-full h-1.5">
                <div className="h-1.5 rounded-full bg-twitter-blue"
                  style={{ width: `${Math.min((s.avgDays / 30) * 100, 100)}%` }} />
              </div>
              <span className={`text-[10px] font-extrabold ${s.avgDays > 14 ? "text-red-500" : s.avgDays > 7 ? "text-amber-600" : "text-emerald-600"}`}>
                {s.avgDays}d avg
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeaderboardRow({ entry, isCurrentUser }: { entry: any; isCurrentUser: boolean; key?: string }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl transition ${isCurrentUser ? "bg-twitter-light border border-twitter-blue/20" : "hover:bg-slate-50"}`}>
      <span className="text-lg w-6 text-center shrink-0">{entry.badge || `#${entry.rank}`}</span>
      <img src={entry.avatar} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="font-bold text-sm text-slate-800 truncate">{entry.displayName}</p>
          {isCurrentUser && <span className="text-[9px] font-extrabold text-twitter-blue bg-twitter-light px-1.5 py-0.5 rounded-full">You</span>}
        </div>
        <p className="text-[10px] text-slate-400"><MapPin className="w-2.5 h-2.5 inline mr-0.5" />{entry.ward}</p>
      </div>
      <div className="flex flex-col items-end gap-0.5 shrink-0">
        <span className="text-sm font-black text-twitter-blue">⚡{entry.civicPoints}</span>
        <span className="text-[9px] text-slate-400 font-medium">{entry.resolvedCount}/{entry.reportsCount} resolved</span>
      </div>
    </div>
  );
}

function GamificationGuide() {
  return (
    <div className="mt-2 p-4 rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-twitter-light/20">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-4 h-4 text-amber-500" />
        <h3 className="font-display font-bold text-sm text-slate-800">How to earn Civic Points</h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { action: "File a report",            pts: "+25",  emoji: "📝" },
          { action: "Report gets resolved",      pts: "+50",  emoji: "✅" },
          { action: "Community verifies report", pts: "+10",  emoji: "👥" },
          { action: "Create a poll",             pts: "+15",  emoji: "🗳️" },
          { action: "Post an update",            pts: "+10",  emoji: "💬" },
          { action: "Verify residency",          pts: "+100", emoji: "🛡️" },
        ].map(({ action, pts, emoji }) => (
          <div key={action} className="flex items-center gap-2 text-xs">
            <span>{emoji}</span>
            <span className="flex-1 text-slate-600 text-[11px]">{action}</span>
            <span className="font-extrabold text-twitter-blue text-[11px]">{pts}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
