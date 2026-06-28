export type Role = "citizen" | "official";
export type City = "Mumbai" | "Bengaluru" | "Delhi" | "Kolkata" | "Chennai";
export type Category = "potholes" | "streetlights" | "water_leakage" | "garbage" | "encroachments" | "traffic" | "pollution" | "others";
export type Status = "open" | "under_review" | "in_progress" | "resolved";
export type Severity = "low" | "medium" | "high" | "critical";

export interface StatusHistory {
  status: Status;
  changedAt: string;
  changedBy: string;
  note?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockedAt?: string;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  role: Role;
  isVerified: boolean;
  badgeType?: "verified_resident" | "verified_official";
  civicPoints: number;
  city: City;
  ward: string;
  following?: string[];
  followersCount?: number;
  followingCount?: number;
  bio?: string;
  achievements?: Achievement[];
  streak?: number;
  reportsResolved?: number;
  pollsCreated?: number;
}

export interface OfficialResponse {
  id: string;
  responder: User;
  text: string;
  createdAt: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  category: Category;
  author: User;
  city: City;
  ward: string;
  upvotes: number;
  upvotedBy: string[];
  commentsCount: number;
  status: Status;
  createdAt: string;
  image?: string;
  locationName?: string;
  latitude?: number;
  longitude?: number;
  officialResponse?: OfficialResponse;
}

export interface Comment {
  id: string;
  author: User;
  text: string;
  createdAt: string;
  upvotes: number;
  upvotedBy: string[];
  isFlagged?: boolean;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  description: string;
  options: PollOption[];
  votedBy: { [userId: string]: string };
  totalVotes: number;
  category: string;
  createdAt: string;
  endsAt: string;
  author: User;
  commentsCount: number;
  ageBreakdown?: { [ageGroup: string]: number };
  areaBreakdown?: { [area: string]: number };
}

export interface TrendingTopic {
  id: string;
  tag: string;
  postCount: number;
  category: string;
}

export type FeedItemType = "post" | "report" | "poll";

export interface FeedItem {
  id: string;
  type: FeedItemType;
  author: User;
  createdAt: string;
  upvotes: number;
  upvotedBy: string[];
  commentsCount: number;
  city: City;
  ward: string;

  // Post & Report
  content?: string;
  image?: string;
  mediaUrls?: string[];

  // Report-specific
  title?: string;
  category?: Category;
  status?: Status;
  severity?: Severity;
  locationName?: string;
  latitude?: number;
  longitude?: number;
  officialResponse?: OfficialResponse;
  statusHistory?: StatusHistory[];
  predictedResolutionDays?: number;
  aiConfidenceScore?: number;

  // Community verification
  communityVerifications?: string[];

  // Poll-specific
  pollQuestion?: string;
  pollOptions?: PollOption[];
  pollVotedBy?: { [userId: string]: string };
  pollTotalVotes?: number;
  pollEndsAt?: string;
  ageBreakdown?: { [ageGroup: string]: number };
  areaBreakdown?: { [area: string]: number };
}
