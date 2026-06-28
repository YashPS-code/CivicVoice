export interface Forum {
  id: string;
  name: string;
  description: string;
  members: number;
  postsToday: number;
  category: string;
  emoji: string;
  city: string;
  isHot?: boolean;
}

export const MOCK_FORUMS: Forum[] = [
  {
    id: "f1",
    name: "Mumbai Residents Hub",
    description: "General civic discussions for Mumbai metro area",
    members: 12430,
    postsToday: 142,
    category: "General",
    emoji: "🏙️",
    city: "Mumbai",
    isHot: true,
  },
  {
    id: "f2",
    name: "HSR Layout Community",
    description: "Bengaluru's HSR Layout — local news & issues",
    members: 8921,
    postsToday: 89,
    category: "Local",
    emoji: "🌿",
    city: "Bengaluru",
    isHot: true,
  },
  {
    id: "f3",
    name: "Ward 12 Andheri West",
    description: "Hyperlocal ward forum — roads, parks & events",
    members: 4502,
    postsToday: 57,
    category: "Ward",
    emoji: "📍",
    city: "Mumbai",
  },
  {
    id: "f4",
    name: "Delhi Clean Air Initiative",
    description: "Advocacy & updates on Delhi air quality improvements",
    members: 19302,
    postsToday: 231,
    category: "Environment",
    emoji: "🌬️",
    city: "Delhi",
    isHot: true,
  },
  {
    id: "f5",
    name: "Chennai Flood Watch",
    description: "Real-time updates on waterlogging & drainage",
    members: 7230,
    postsToday: 114,
    category: "Emergency",
    emoji: "⚠️",
    city: "Chennai",
  },
  {
    id: "f6",
    name: "Bengaluru Traffic Alerts",
    description: "Live traffic updates, road closures, and diversions",
    members: 24100,
    postsToday: 389,
    category: "Traffic",
    emoji: "🚦",
    city: "Bengaluru",
    isHot: true,
  },
  {
    id: "f7",
    name: "Mumbai Parks & Green Spaces",
    description: "Protect and improve Mumbai's lungs — parks & trees",
    members: 3840,
    postsToday: 28,
    category: "Environment",
    emoji: "🌳",
    city: "Mumbai",
  },
  {
    id: "f8",
    name: "Kolkata Heritage Preservation",
    description: "Saving Kolkata's architectural and cultural heritage",
    members: 6120,
    postsToday: 45,
    category: "Culture",
    emoji: "🏛️",
    city: "Kolkata",
  },
];
