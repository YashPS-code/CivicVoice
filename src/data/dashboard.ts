import { City } from "../types";

export interface WardStat {
  ward: string;
  issueCount: number;
  resolved: number;
  pending: number;
}

export interface DailyStat {
  date: string;
  reported: number;
  resolved: number;
}

export interface CategoryStat {
  category: string;
  label: string;
  emoji: string;
  count: number;
  resolved: number;
  avgDays: number;
  color: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatar: string;
  ward: string;
  civicPoints: number;
  reportsCount: number;
  resolvedCount: number;
  badge?: string;
}

export interface CityDashboard {
  city: City;
  totalReports: number;
  resolvedReports: number;
  openReports: number;
  inProgressReports: number;
  avgResolutionDays: number;
  citizensEngaged: number;
  pollsActive: number;
  reportsToday: number;
  resolutionRate: number;
  wardStats: WardStat[];
  dailyStats: DailyStat[];
  categoryStats: CategoryStat[];
  leaderboard: LeaderboardEntry[];
  aiInsights: AIInsight[];
}

export interface AIInsight {
  id: string;
  type: "hotspot" | "prediction" | "trend" | "alert";
  title: string;
  description: string;
  severity: "info" | "warning" | "critical";
  confidence: number;
  ward?: string;
  category?: string;
  emoji: string;
}

export const CITY_DASHBOARDS: Record<City, CityDashboard> = {
  Mumbai: {
    city: "Mumbai",
    totalReports: 2847,
    resolvedReports: 1923,
    openReports: 512,
    inProgressReports: 412,
    avgResolutionDays: 6.4,
    citizensEngaged: 18420,
    pollsActive: 7,
    reportsToday: 43,
    resolutionRate: 67.5,
    wardStats: [
      { ward: "Andheri West",  issueCount: 342, resolved: 241, pending: 101 },
      { ward: "Bandra West",   issueCount: 289, resolved: 198, pending: 91  },
      { ward: "Juhu-Koliwada", issueCount: 187, resolved: 121, pending: 66  },
      { ward: "Colaba",        issueCount: 156, resolved: 112, pending: 44  },
      { ward: "Dadar",         issueCount: 203, resolved: 138, pending: 65  },
      { ward: "Kurla",         issueCount: 278, resolved: 172, pending: 106 },
      { ward: "Borivali",      issueCount: 215, resolved: 149, pending: 66  },
      { ward: "Malad",         issueCount: 194, resolved: 128, pending: 66  },
    ],
    dailyStats: [
      { date: "Jun 19", reported: 28, resolved: 19 },
      { date: "Jun 20", reported: 35, resolved: 24 },
      { date: "Jun 21", reported: 41, resolved: 31 },
      { date: "Jun 22", reported: 52, resolved: 38 },
      { date: "Jun 23", reported: 38, resolved: 42 },
      { date: "Jun 24", reported: 47, resolved: 35 },
      { date: "Jun 25", reported: 43, resolved: 29 },
    ],
    categoryStats: [
      { category: "potholes",      label: "Potholes",        emoji: "🛣️", count: 812, resolved: 591, avgDays: 8.2,  color: "#f59e0b" },
      { category: "garbage",       label: "Garbage",          emoji: "🗑️", count: 634, resolved: 498, avgDays: 3.1,  color: "#10b981" },
      { category: "streetlights",  label: "Streetlights",     emoji: "💡", count: 421, resolved: 312, avgDays: 5.4,  color: "#eab308" },
      { category: "water_leakage", label: "Water Leakage",    emoji: "💧", count: 389, resolved: 278, avgDays: 4.8,  color: "#3b82f6" },
      { category: "traffic",       label: "Traffic",          emoji: "🚗", count: 287, resolved: 156, avgDays: 12.3, color: "#6366f1" },
      { category: "pollution",     label: "Pollution",        emoji: "🌫️", count: 198, resolved: 68,  avgDays: 18.7, color: "#14b8a6" },
      { category: "encroachments", label: "Encroachments",    emoji: "🚧", count: 64,  resolved: 12,  avgDays: 21.4, color: "#ef4444" },
      { category: "others",        label: "Others",           emoji: "📋", count: 42,  resolved: 8,   avgDays: 9.1,  color: "#94a3b8" },
    ],
    leaderboard: [
      { rank: 1, userId: "cit_1",    displayName: "Rohit Mehta",      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80", ward: "Andheri West",  civicPoints: 1240, reportsCount: 47, resolvedCount: 38, badge: "👑" },
      { rank: 2, userId: "curr_user",displayName: "Aarav Patel",      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80", ward: "Andheri West",  civicPoints: 980,  reportsCount: 38, resolvedCount: 29, badge: "🥈" },
      { rank: 3, userId: "ldr_3",    displayName: "Meera Joshi",      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80", ward: "Bandra West",   civicPoints: 821,  reportsCount: 32, resolvedCount: 25, badge: "🥉" },
      { rank: 4, userId: "ldr_4",    displayName: "Suresh Nair",      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80", ward: "Colaba",        civicPoints: 654,  reportsCount: 24, resolvedCount: 18 },
      { rank: 5, userId: "ldr_5",    displayName: "Kavita Sharma",    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80", ward: "Dadar",         civicPoints: 521,  reportsCount: 19, resolvedCount: 14 },
    ],
    aiInsights: [
      { id: "ai_1", type: "hotspot",    title: "Pothole surge in Andheri West", description: "Report density has increased 340% in the Andheri West sector near Link Road. Municipal patching crew is overdue.", severity: "critical", confidence: 94, ward: "Andheri West",  category: "potholes",      emoji: "🔴" },
      { id: "ai_2", type: "prediction", title: "Monsoon flooding risk", description: "Based on 3 years of historical data, Ward 12 (Andheri) will see a 60% spike in waterlogging reports in the next 14 days.", severity: "warning",  confidence: 87, ward: "Ward 12",       category: "water_leakage", emoji: "⚠️" },
      { id: "ai_3", type: "trend",      title: "Street-lighting improving", description: "Average resolution time for streetlight issues dropped from 8.2 to 5.4 days — indicating improved MCGM response.", severity: "info",     confidence: 91, category: "streetlights", emoji: "📈" },
      { id: "ai_4", type: "alert",      title: "Garbage collection gap — Kurla", description: "Kurla ward has the highest unresolved garbage count (106). Recommend escalating to zonal cleanliness officer.", severity: "warning",  confidence: 89, ward: "Kurla",         category: "garbage",       emoji: "🗑️" },
    ],
  },

  Bengaluru: {
    city: "Bengaluru",
    totalReports: 3102,
    resolvedReports: 2198,
    openReports: 487,
    inProgressReports: 417,
    avgResolutionDays: 5.1,
    citizensEngaged: 22810,
    pollsActive: 5,
    reportsToday: 61,
    resolutionRate: 70.9,
    wardStats: [
      { ward: "HSR Layout",   issueCount: 421, resolved: 312, pending: 109 },
      { ward: "Indiranagar",  issueCount: 378, resolved: 287, pending: 91  },
      { ward: "Koramangala",  issueCount: 344, resolved: 251, pending: 93  },
      { ward: "Whitefield",   issueCount: 289, resolved: 198, pending: 91  },
      { ward: "Electronic City", issueCount: 201, resolved: 134, pending: 67 },
    ],
    dailyStats: [
      { date: "Jun 19", reported: 42, resolved: 31 },
      { date: "Jun 20", reported: 55, resolved: 44 },
      { date: "Jun 21", reported: 48, resolved: 52 },
      { date: "Jun 22", reported: 63, resolved: 47 },
      { date: "Jun 23", reported: 51, resolved: 58 },
      { date: "Jun 24", reported: 72, resolved: 61 },
      { date: "Jun 25", reported: 61, resolved: 49 },
    ],
    categoryStats: [
      { category: "potholes",      label: "Potholes",     emoji: "🛣️", count: 921, resolved: 712, avgDays: 6.1,  color: "#f59e0b" },
      { category: "garbage",       label: "Garbage",       emoji: "🗑️", count: 612, resolved: 489, avgDays: 2.8,  color: "#10b981" },
      { category: "streetlights",  label: "Streetlights",  emoji: "💡", count: 503, resolved: 398, avgDays: 4.2,  color: "#eab308" },
      { category: "traffic",       label: "Traffic",       emoji: "🚗", count: 412, resolved: 234, avgDays: 10.8, color: "#6366f1" },
      { category: "water_leakage", label: "Water Leakage", emoji: "💧", count: 298, resolved: 212, avgDays: 3.9,  color: "#3b82f6" },
      { category: "pollution",     label: "Pollution",     emoji: "🌫️", count: 234, resolved: 98,  avgDays: 14.2, color: "#14b8a6" },
      { category: "encroachments", label: "Encroachments", emoji: "🚧", count: 78,  resolved: 32,  avgDays: 18.6, color: "#ef4444" },
      { category: "others",        label: "Others",        emoji: "📋", count: 44,  resolved: 23,  avgDays: 8.3,  color: "#94a3b8" },
    ],
    leaderboard: [
      { rank: 1, userId: "cit_2",  displayName: "Ananya Sharma",  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80", ward: "HSR Layout",  civicPoints: 1640, reportsCount: 62, resolvedCount: 51, badge: "👑" },
      { rank: 2, userId: "ldr_b2", displayName: "Kiran Rao",      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150&q=80", ward: "Indiranagar", civicPoints: 1120, reportsCount: 44, resolvedCount: 36, badge: "🥈" },
      { rank: 3, userId: "ldr_b3", displayName: "Preethi Nair",   avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80", ward: "Koramangala", civicPoints: 934,  reportsCount: 37, resolvedCount: 29, badge: "🥉" },
      { rank: 4, userId: "ldr_b4", displayName: "Rajan Menon",    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80", ward: "Whitefield",  civicPoints: 712,  reportsCount: 28, resolvedCount: 20 },
      { rank: 5, userId: "ldr_b5", displayName: "Divya Murthy",   avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80", ward: "HSR Layout",  civicPoints: 589,  reportsCount: 21, resolvedCount: 16 },
    ],
    aiInsights: [
      { id: "ai_b1", type: "hotspot",    title: "Traffic congestion spike — Koramangala", description: "Peak-hour congestion reports have increased 180% since the new mall opened. Signal timing recalibration recommended.", severity: "critical", confidence: 92, ward: "Koramangala", category: "traffic",     emoji: "🔴" },
      { id: "ai_b2", type: "trend",      title: "HSR Layout achieving record resolution", description: "Councillor Hegde's ward has resolved 312 issues this month — 40% faster than the city average.", severity: "info",     confidence: 96, ward: "HSR Layout",  emoji: "📈" },
      { id: "ai_b3", type: "prediction", title: "Pre-monsoon pothole alert", description: "97 road segments are predicted to develop critical potholes before the monsoon based on pavement condition data.", severity: "warning",  confidence: 83, category: "potholes", emoji: "⚠️" },
    ],
  },

  Delhi: {
    city: "Delhi",
    totalReports: 4218,
    resolvedReports: 2891,
    openReports: 743,
    inProgressReports: 584,
    avgResolutionDays: 9.2,
    citizensEngaged: 31040,
    pollsActive: 9,
    reportsToday: 87,
    resolutionRate: 68.5,
    wardStats: [
      { ward: "Saket",             issueCount: 512, resolved: 378, pending: 134 },
      { ward: "Connaught Place",   issueCount: 398, resolved: 287, pending: 111 },
      { ward: "Karol Bagh",        issueCount: 467, resolved: 312, pending: 155 },
      { ward: "Vasant Kunj",       issueCount: 334, resolved: 241, pending: 93  },
      { ward: "Rohini",            issueCount: 289, resolved: 178, pending: 111 },
      { ward: "Dwarka",            issueCount: 412, resolved: 298, pending: 114 },
    ],
    dailyStats: [
      { date: "Jun 19", reported: 68, resolved: 47 },
      { date: "Jun 20", reported: 79, resolved: 61 },
      { date: "Jun 21", reported: 91, resolved: 72 },
      { date: "Jun 22", reported: 84, resolved: 65 },
      { date: "Jun 23", reported: 103, resolved: 88 },
      { date: "Jun 24", reported: 97, resolved: 79 },
      { date: "Jun 25", reported: 87, resolved: 68 },
    ],
    categoryStats: [
      { category: "potholes",      label: "Potholes",     emoji: "🛣️", count: 1124, resolved: 812, avgDays: 11.2, color: "#f59e0b" },
      { category: "pollution",     label: "Pollution",     emoji: "🌫️", count: 891,  resolved: 412, avgDays: 22.1, color: "#14b8a6" },
      { category: "garbage",       label: "Garbage",       emoji: "🗑️", count: 734,  resolved: 598, avgDays: 3.4,  color: "#10b981" },
      { category: "traffic",       label: "Traffic",       emoji: "🚗", count: 621,  resolved: 387, avgDays: 15.8, color: "#6366f1" },
      { category: "water_leakage", label: "Water Leakage", emoji: "💧", count: 412,  resolved: 312, avgDays: 5.1,  color: "#3b82f6" },
      { category: "streetlights",  label: "Streetlights",  emoji: "💡", count: 287,  resolved: 198, avgDays: 6.3,  color: "#eab308" },
      { category: "encroachments", label: "Encroachments", emoji: "🚧", count: 98,   resolved: 41,  avgDays: 28.4, color: "#ef4444" },
      { category: "others",        label: "Others",        emoji: "📋", count: 51,   resolved: 31,  avgDays: 7.2,  color: "#94a3b8" },
    ],
    leaderboard: [
      { rank: 1, userId: "cit_3",  displayName: "Vikram Dev",      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80", ward: "Saket",           civicPoints: 2140, reportsCount: 89, resolvedCount: 71, badge: "👑" },
      { rank: 2, userId: "ldr_d2", displayName: "Poonam Singh",    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80", ward: "Karol Bagh",      civicPoints: 1780, reportsCount: 72, resolvedCount: 58, badge: "🥈" },
      { rank: 3, userId: "ldr_d3", displayName: "Arjun Kapoor",    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80", ward: "Connaught Place",  civicPoints: 1421, reportsCount: 61, resolvedCount: 48, badge: "🥉" },
      { rank: 4, userId: "ldr_d4", displayName: "Sunita Verma",    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80", ward: "Vasant Kunj",     civicPoints: 1098, reportsCount: 45, resolvedCount: 34 },
      { rank: 5, userId: "ldr_d5", displayName: "Rajesh Gupta",    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80", ward: "Rohini",          civicPoints: 876,  reportsCount: 38, resolvedCount: 27 },
    ],
    aiInsights: [
      { id: "ai_d1", type: "alert",      title: "AQI-linked issue cluster — Rohini", description: "42 pollution-related reports this week correlate with AQI 320 readings. Temporary industrial emissions ban is recommended.", severity: "critical", confidence: 95, ward: "Rohini",     category: "pollution", emoji: "🔴" },
      { id: "ai_d2", type: "prediction", title: "Karol Bagh encroachment escalation", description: "Historical patterns suggest a 70% probability of footpath encroachment spike during festival season (next 3 weeks).", severity: "warning",  confidence: 78, ward: "Karol Bagh", category: "encroachments", emoji: "⚠️" },
      { id: "ai_d3", type: "trend",      title: "Saket resolution efficiency up 28%", description: "Commissioner Vardhan has driven 28% faster resolution in Saket through digital escalation of tier-1 complaints.", severity: "info",     confidence: 93, emoji: "📈" },
    ],
  },

  Kolkata: {
    city: "Kolkata",
    totalReports: 1876,
    resolvedReports: 1121,
    openReports: 412,
    inProgressReports: 343,
    avgResolutionDays: 10.8,
    citizensEngaged: 12450,
    pollsActive: 4,
    reportsToday: 32,
    resolutionRate: 59.8,
    wardStats: [
      { ward: "Park Street",  issueCount: 312, resolved: 198, pending: 114 },
      { ward: "Alipore",      issueCount: 278, resolved: 172, pending: 106 },
      { ward: "Salt Lake",    issueCount: 234, resolved: 148, pending: 86  },
      { ward: "Howrah Bridge",issueCount: 198, resolved: 112, pending: 86  },
    ],
    dailyStats: [
      { date: "Jun 19", reported: 21, resolved: 14 },
      { date: "Jun 20", reported: 28, resolved: 18 },
      { date: "Jun 21", reported: 34, resolved: 22 },
      { date: "Jun 22", reported: 29, resolved: 19 },
      { date: "Jun 23", reported: 38, resolved: 28 },
      { date: "Jun 24", reported: 41, resolved: 31 },
      { date: "Jun 25", reported: 32, resolved: 24 },
    ],
    categoryStats: [
      { category: "potholes",      label: "Potholes",     emoji: "🛣️", count: 612, resolved: 412, avgDays: 13.4, color: "#f59e0b" },
      { category: "garbage",       label: "Garbage",       emoji: "🗑️", count: 489, resolved: 312, avgDays: 4.1,  color: "#10b981" },
      { category: "water_leakage", label: "Water Leakage", emoji: "💧", count: 312, resolved: 187, avgDays: 7.8,  color: "#3b82f6" },
      { category: "streetlights",  label: "Streetlights",  emoji: "💡", count: 198, resolved: 121, avgDays: 6.9,  color: "#eab308" },
      { category: "traffic",       label: "Traffic",       emoji: "🚗", count: 156, resolved: 67,  avgDays: 19.2, color: "#6366f1" },
      { category: "pollution",     label: "Pollution",     emoji: "🌫️", count: 78,  resolved: 14,  avgDays: 31.4, color: "#14b8a6" },
      { category: "encroachments", label: "Encroachments", emoji: "🚧", count: 21,  resolved: 5,   avgDays: 24.7, color: "#ef4444" },
      { category: "others",        label: "Others",        emoji: "📋", count: 10,  resolved: 3,   avgDays: 11.2, color: "#94a3b8" },
    ],
    leaderboard: [
      { rank: 1, userId: "ldr_k1", displayName: "Debashish Roy",    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150&q=80", ward: "Park Street", civicPoints: 1320, reportsCount: 51, resolvedCount: 39, badge: "👑" },
      { rank: 2, userId: "ldr_k2", displayName: "Mou Chatterjee",   avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80", ward: "Alipore",     civicPoints: 987,  reportsCount: 38, resolvedCount: 28, badge: "🥈" },
      { rank: 3, userId: "ldr_k3", displayName: "Sayan Bose",       avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80", ward: "Salt Lake",   civicPoints: 812,  reportsCount: 32, resolvedCount: 22, badge: "🥉" },
      { rank: 4, userId: "ldr_k4", displayName: "Rina Das",         avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80", ward: "Park Street", civicPoints: 634,  reportsCount: 24, resolvedCount: 17 },
      { rank: 5, userId: "ldr_k5", displayName: "Tapan Ghosh",      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80", ward: "Alipore",     civicPoints: 512,  reportsCount: 19, resolvedCount: 13 },
    ],
    aiInsights: [
      { id: "ai_k1", type: "hotspot", title: "Drainage risk — Park Street pre-monsoon", description: "Historical pattern shows 85% probability of severe flooding on Park Street during heavy rainfall. Drain clearing is critical.", severity: "critical", confidence: 91, ward: "Park Street", category: "water_leakage", emoji: "🔴" },
      { id: "ai_k2", type: "trend",   title: "Resolution rate below city average", description: "Kolkata's 59.8% resolution rate is 8% below the national average. Escalation to KMC Municipal Commissioner is recommended.", severity: "warning",  confidence: 88, emoji: "⚠️" },
    ],
  },

  Chennai: {
    city: "Chennai",
    totalReports: 2134,
    resolvedReports: 1489,
    openReports: 387,
    inProgressReports: 258,
    avgResolutionDays: 7.3,
    citizensEngaged: 15820,
    pollsActive: 6,
    reportsToday: 48,
    resolutionRate: 69.8,
    wardStats: [
      { ward: "Adyar",     issueCount: 412, resolved: 312, pending: 100 },
      { ward: "Velachery",  issueCount: 367, resolved: 278, pending: 89  },
      { ward: "Mylapore",   issueCount: 289, resolved: 212, pending: 77  },
      { ward: "Anna Nagar", issueCount: 256, resolved: 187, pending: 69  },
      { ward: "Tambaram",   issueCount: 198, resolved: 132, pending: 66  },
    ],
    dailyStats: [
      { date: "Jun 19", reported: 37, resolved: 28 },
      { date: "Jun 20", reported: 44, resolved: 34 },
      { date: "Jun 21", reported: 51, resolved: 42 },
      { date: "Jun 22", reported: 48, resolved: 39 },
      { date: "Jun 23", reported: 58, resolved: 47 },
      { date: "Jun 24", reported: 62, resolved: 51 },
      { date: "Jun 25", reported: 48, resolved: 38 },
    ],
    categoryStats: [
      { category: "garbage",       label: "Garbage",       emoji: "🗑️", count: 712, resolved: 589, avgDays: 2.9,  color: "#10b981" },
      { category: "potholes",      label: "Potholes",      emoji: "🛣️", count: 589, resolved: 412, avgDays: 9.1,  color: "#f59e0b" },
      { category: "water_leakage", label: "Water Leakage", emoji: "💧", count: 398, resolved: 287, avgDays: 5.8,  color: "#3b82f6" },
      { category: "streetlights",  label: "Streetlights",  emoji: "💡", count: 234, resolved: 178, avgDays: 4.3,  color: "#eab308" },
      { category: "traffic",       label: "Traffic",       emoji: "🚗", count: 112, resolved: 23,  avgDays: 17.6, color: "#6366f1" },
      { category: "pollution",     label: "Pollution",     emoji: "🌫️", count: 56,  resolved: 0,   avgDays: 0,    color: "#14b8a6" },
      { category: "encroachments", label: "Encroachments", emoji: "🚧", count: 23,  resolved: 0,   avgDays: 0,    color: "#ef4444" },
      { category: "others",        label: "Others",        emoji: "📋", count: 10,  resolved: 0,   avgDays: 0,    color: "#94a3b8" },
    ],
    leaderboard: [
      { rank: 1, userId: "cit_4",  displayName: "Priya Gopal",     avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80", ward: "Adyar",     civicPoints: 1890, reportsCount: 74, resolvedCount: 61, badge: "👑" },
      { rank: 2, userId: "ldr_c2", displayName: "Murugan R",       avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150&q=80", ward: "Velachery", civicPoints: 1340, reportsCount: 54, resolvedCount: 42, badge: "🥈" },
      { rank: 3, userId: "ldr_c3", displayName: "Lakshmi Iyer",    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80", ward: "Mylapore",  civicPoints: 1120, reportsCount: 44, resolvedCount: 36, badge: "🥉" },
      { rank: 4, userId: "ldr_c4", displayName: "Senthil Kumar",   avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80", ward: "Adyar",     civicPoints: 876,  reportsCount: 34, resolvedCount: 26 },
      { rank: 5, userId: "ldr_c5", displayName: "Kavitha Sundaram", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80", ward: "Tambaram",  civicPoints: 698,  reportsCount: 27, resolvedCount: 19 },
    ],
    aiInsights: [
      { id: "ai_c1", type: "hotspot", title: "Lake encroachment risk — Adyar estuary", description: "12 illegal structure reports near the Adyar lake buffer zone. Immediate corporation intervention needed to prevent ecological damage.", severity: "critical", confidence: 97, ward: "Adyar", category: "encroachments", emoji: "🔴" },
      { id: "ai_c2", type: "prediction", title: "Pre-monsoon garbage flash-point", description: "Velachery ward historically accumulates 80% more garbage in the 2 weeks before monsoon. Proactive double collection runs recommended.", severity: "warning",  confidence: 89, ward: "Velachery", category: "garbage", emoji: "⚠️" },
      { id: "ai_c3", type: "trend",   title: "Chennai leading in garbage resolution", description: "Chennai resolves 82% of garbage complaints within 3 days — best rate among all monitored cities.", severity: "info", confidence: 99, emoji: "📈" },
    ],
  },
};
