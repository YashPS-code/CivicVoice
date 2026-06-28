import { Achievement } from "../types";

export const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: "first_report", name: "First Report", description: "Filed your first civic grievance", emoji: "📝", rarity: "common" },
  { id: "pothole_hunter", name: "Pothole Hunter", description: "Reported 5 road issues", emoji: "🛣️", rarity: "common" },
  { id: "verified_resident", name: "Verified Resident", description: "Completed Aadhaar-based residency verification", emoji: "🛡️", rarity: "rare" },
  { id: "community_voice", name: "Community Voice", description: "Received 50 upvotes on your reports", emoji: "📢", rarity: "rare" },
  { id: "poll_pioneer", name: "Poll Pioneer", description: "Created 3 community polls", emoji: "🗳️", rarity: "rare" },
  { id: "first_resolution", name: "First Resolution", description: "Had a grievance marked as resolved", emoji: "✅", rarity: "rare" },
  { id: "serial_reporter", name: "Serial Reporter", description: "Filed 10 reports in a single month", emoji: "🔥", rarity: "epic" },
  { id: "civic_champion", name: "Civic Champion", description: "Earned 500 Civic Points", emoji: "⚡", rarity: "epic" },
  { id: "ward_guardian", name: "Ward Guardian", description: "Top 3 contributor in your ward for 30 days", emoji: "🏆", rarity: "epic" },
  { id: "resolution_catalyst", name: "Resolution Catalyst", description: "5 of your reports were resolved within 48 hours", emoji: "🚀", rarity: "legendary" },
  { id: "civic_legend", name: "Civic Legend", description: "Reached 1000 Civic Points and 25 resolved reports", emoji: "👑", rarity: "legendary" },
  { id: "transparency_hero", name: "Transparency Hero", description: "Actively followed up on 20 official responses", emoji: "🔍", rarity: "legendary" },
];

export const RARITY_CONFIG = {
  common:    { color: "text-slate-600",  bg: "bg-slate-100",   border: "border-slate-200",  label: "Common"    },
  rare:      { color: "text-blue-600",   bg: "bg-blue-50",     border: "border-blue-200",   label: "Rare"      },
  epic:      { color: "text-violet-600", bg: "bg-violet-50",   border: "border-violet-200", label: "Epic"      },
  legendary: { color: "text-amber-600",  bg: "bg-amber-50",    border: "border-amber-200",  label: "Legendary" },
};
