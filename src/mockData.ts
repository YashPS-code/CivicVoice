import { Report, Poll, TrendingTopic, User, Comment, FeedItem } from "./types";

export const MOCK_CITIZENS: User[] = [
  {
    id: "cit_1",
    username: "rohit_mehta",
    displayName: "Rohit Mehta",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
    role: "citizen",
    isVerified: true,
    badgeType: "verified_resident",
    civicPoints: 120,
    city: "Mumbai",
    ward: "Ward 12 (Andheri West)"
  },
  {
    id: "cit_2",
    username: "ananya_s",
    displayName: "Ananya Sharma",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    role: "citizen",
    isVerified: true,
    badgeType: "verified_resident",
    civicPoints: 240,
    city: "Bengaluru",
    ward: "Ward 54 (HSR Layout)"
  },
  {
    id: "cit_3",
    username: "vikram_d",
    displayName: "Vikram Dev",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80",
    role: "citizen",
    isVerified: false,
    civicPoints: 45,
    city: "Delhi",
    ward: "Ward 8 (Saket)"
  },
  {
    id: "cit_4",
    username: "priya_g",
    displayName: "Priya Gopal",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
    role: "citizen",
    isVerified: true,
    badgeType: "verified_resident",
    civicPoints: 310,
    city: "Chennai",
    ward: "Ward 112 (Adyar)"
  }
];

export const MOCK_COUNCILLORS: User[] = [
  {
    id: "off_1",
    username: "councillor_andheri",
    displayName: "Cllr. Amit Deshmukh",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150&q=80",
    role: "official",
    isVerified: true,
    badgeType: "verified_official",
    civicPoints: 950,
    city: "Mumbai",
    ward: "Ward 12 (Andheri West)"
  },
  {
    id: "off_2",
    username: "councillor_hsr",
    displayName: "Cllr. Sandeep Hegde",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
    role: "official",
    isVerified: true,
    badgeType: "verified_official",
    civicPoints: 1200,
    city: "Bengaluru",
    ward: "Ward 54 (HSR Layout)"
  },
  {
    id: "off_3",
    username: "commissioner_delhi",
    displayName: "Comm. Alok Vardhan",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80",
    role: "official",
    isVerified: true,
    badgeType: "verified_official",
    civicPoints: 2100,
    city: "Delhi",
    ward: "Ward 8 (Saket)"
  }
];

export const MOCK_USER: User = {
  id: "curr_user",
  username: "active_citizen_india",
  displayName: "Aarav Patel",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
  role: "citizen",
  isVerified: true,
  badgeType: "verified_resident",
  civicPoints: 180,
  city: "Mumbai",
  ward: "Ward 12 (Andheri West)"
};

export const TRENDING_TOPICS: TrendingTopic[] = [
  { id: "tr_1", tag: "#PotholeFreeMumbai", postCount: 1420, category: "potholes" },
  { id: "tr_2", tag: "#HSRStreetlightsFixed", postCount: 890, category: "streetlights" },
  { id: "tr_3", tag: "#DelhiCleanAirPlan", postCount: 2310, category: "pollution" },
  { id: "tr_4", tag: "#SaveAdyarEstuary", postCount: 560, category: "others" },
  { id: "tr_5", tag: "#AdyarParkCleanup", postCount: 340, category: "garbage" }
];

export const INITIAL_REPORTS: Report[] = [
  {
    id: "rep_1",
    title: "Hazardous Crater-Sized Potholes on Link Road",
    description: "There are multiple deep potholes right after the main intersection on Link Road, Andheri West. During monsoons, these submerge under water and become invisible traps for two-wheelers. Two minor accidents happened yesterday alone.",
    category: "potholes",
    author: MOCK_CITIZENS[0],
    city: "Mumbai",
    ward: "Ward 12 (Andheri West)",
    upvotes: 142,
    upvotedBy: ["cit_2", "cit_3", "curr_user"],
    commentsCount: 12,
    status: "in_progress",
    createdAt: "2026-06-24T14:30:00Z",
    image: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&h=400&q=80",
    locationName: "Near Juhu Circle, Link Road",
    latitude: 19.1197,
    longitude: 72.8264,
    officialResponse: {
      id: "res_1",
      responder: MOCK_COUNCILLORS[0],
      text: "Thank you for raising this. I have initiated an emergency action order under municipal road maintenance. Patching work will start tonight at 11:30 PM to avoid disrupting traffic. The contractor has been instructed to complete this by Friday morning.",
      createdAt: "2026-06-24T18:15:00Z"
    }
  },
  {
    id: "rep_2",
    title: "Broken Streetlights on 17th Cross Road",
    description: "An entire block of 17th Cross, HSR Layout has non-functioning streetlights for the past five nights. It is completely dark, causing safety concerns for women and senior citizens walking in the evening.",
    category: "streetlights",
    author: MOCK_CITIZENS[1],
    city: "Bengaluru",
    ward: "Ward 54 (HSR Layout)",
    upvotes: 89,
    upvotedBy: ["cit_1", "curr_user"],
    commentsCount: 4,
    status: "under_review",
    createdAt: "2026-06-23T09:15:00Z",
    image: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&h=400&q=80",
    locationName: "17th Cross Road, Sector 3",
    latitude: 12.9128,
    longitude: 77.6387
  },
  {
    id: "rep_3",
    title: "Major Water Main Pipe Leakage Near Metro Pillar 12",
    description: "Thousands of liters of clean drinking water are leaking from the underground pipe burst near Saket Metro Pillar 12. The entire side lane is flooded, creating traffic jams.",
    category: "water_leakage",
    author: MOCK_CITIZENS[2],
    city: "Delhi",
    ward: "Ward 8 (Saket)",
    upvotes: 215,
    upvotedBy: ["cit_1", "cit_2", "cit_4", "curr_user"],
    commentsCount: 18,
    status: "resolved",
    createdAt: "2026-06-22T08:00:00Z",
    image: "https://images.unsplash.com/photo-1542060748-10c28b629f6f?auto=format&fit=crop&w=600&h=400&q=80",
    locationName: "Under Saket Metro Station",
    latitude: 28.5222,
    longitude: 77.2065,
    officialResponse: {
      id: "res_2",
      responder: MOCK_COUNCILLORS[2],
      text: "Delhi Jal Board team was deployed on-site within 3 hours of report priority surge. The damaged flange joint has been fully replaced. Leakage is completely plugged and water pressure is restored to Saket block. Thank you for your speedy reporting!",
      createdAt: "2026-06-22T14:30:00Z"
    }
  },
  {
    id: "rep_4",
    title: "Illegal Garbage Dumping & Burning on Lake Road",
    description: "Some local commercial vendors are dumping plastics and trash on the Adyar Lake shore and burning it late at night. The toxic smoke gets inside residential homes and is causing breathing issues for children.",
    category: "garbage",
    author: MOCK_CITIZENS[3],
    city: "Chennai",
    ward: "Ward 112 (Adyar)",
    upvotes: 112,
    upvotedBy: ["cit_1", "cit_2"],
    commentsCount: 9,
    status: "open",
    createdAt: "2026-06-25T01:45:00Z",
    image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&h=400&q=80",
    locationName: "Adyar Lake Walkway Edge",
    latitude: 13.0012,
    longitude: 80.2565
  },
  {
    id: "rep_5",
    title: "Footpath Encroachments by Commercial Display Boards",
    description: "Several shops on Andheri main market have placed heavy iron advertising stands and display racks directly on the pedestrian sidewalk, forcing school children to walk on the busy vehicular road.",
    category: "encroachments",
    author: MOCK_CITIZENS[0],
    city: "Mumbai",
    ward: "Ward 12 (Andheri West)",
    upvotes: 63,
    upvotedBy: ["cit_4", "curr_user"],
    commentsCount: 3,
    status: "open",
    createdAt: "2026-06-25T05:30:00Z",
    locationName: "Andheri Main Market Road",
    latitude: 19.1136,
    longitude: 72.8697
  }
];

export const INITIAL_POLLS: Poll[] = [
  {
    id: "poll_1",
    question: "Should Ward 12 introduce a 100% car-free pedestrian street on weekends?",
    description: "Proposal to make Andheri Link Road (selected shopping strip) pedestrian-only on Saturdays and Sundays between 4 PM to 10 PM. This aims to reduce commercial pollution, promote local foot traffic, and provide child-safe open space.",
    options: [
      { id: "o1", text: "Yes, fully support it", votes: 412 },
      { id: "o2", text: "Support, but only on Sundays", votes: 231 },
      { id: "o3", text: "No, it will cause heavy detours", votes: 145 },
      { id: "o4", text: "Indifferent / Need more details", votes: 44 }
    ],
    votedBy: { "curr_user": "o1", "cit_1": "o1" },
    totalVotes: 832,
    category: "traffic",
    createdAt: "2026-06-20T10:00:00Z",
    endsAt: "2026-07-15T18:00:00Z",
    author: MOCK_COUNCILLORS[0],
    commentsCount: 31,
    ageBreakdown: {
      "18-25 yrs": 45,
      "26-40 yrs": 35,
      "41-60 yrs": 15,
      "60+ yrs": 5
    },
    areaBreakdown: {
      "Andheri West": 60,
      "Andheri East": 25,
      "Juhu Beach Area": 15
    }
  },
  {
    id: "poll_2",
    question: "Where should the new Ward 54 community park budget be prioritized?",
    description: "The municipal body has allocated ₹25 Lakhs for green development in HSR Layout. Vote on your preferred primary amenity layout to finalize the architectural blueprint.",
    options: [
      { id: "op_1", text: "Children play area & swings", votes: 198 },
      { id: "op_2", text: "Jogging track & outdoor gym", votes: 312 },
      { id: "op_3", text: "Sensory garden & elder seating", votes: 142 },
      { id: "op_4", text: "Rainwater harvesting pond", votes: 88 }
    ],
    votedBy: { "cit_2": "op_2" },
    totalVotes: 740,
    category: "others",
    createdAt: "2026-06-22T09:00:00Z",
    endsAt: "2026-07-10T18:00:00Z",
    author: MOCK_COUNCILLORS[1],
    commentsCount: 15,
    ageBreakdown: {
      "18-25 yrs": 15,
      "26-40 yrs": 55,
      "41-60 yrs": 20,
      "60+ yrs": 10
    },
    areaBreakdown: {
      "HSR Sector 1": 20,
      "HSR Sector 2": 18,
      "HSR Sector 3": 42,
      "HSR Sector 4": 20
    }
  },
  {
    id: "poll_3",
    question: "Do you support ban on heavy commercial trucks entering Saket during day?",
    description: "To combat severe noise, dust pollution, and pedestrian safety hazards, should heavy trucks be banned between 8 AM and 9 PM?",
    options: [
      { id: "op3_1", text: "Yes, total daytime ban", votes: 612 },
      { id: "op3_2", text: "Ban only during school hours", votes: 120 },
      { id: "op3_3", text: "No, will delay supply chain", votes: 95 }
    ],
    votedBy: {},
    totalVotes: 827,
    category: "pollution",
    createdAt: "2026-06-23T11:00:00Z",
    endsAt: "2026-06-30T18:00:00Z",
    author: MOCK_COUNCILLORS[2],
    commentsCount: 22,
    ageBreakdown: {
      "18-25 yrs": 25,
      "26-40 yrs": 45,
      "41-60 yrs": 25,
      "60+ yrs": 5
    },
    areaBreakdown: {
      "Saket Block A-F": 55,
      "Neb Sarai": 25,
      "Malviya Nagar Border": 20
    }
  }
];

export const MOCK_REPORTS_COMMENTS: { [reportId: string]: Comment[] } = {
  "rep_1": [
    {
      id: "c_1",
      author: MOCK_CITIZENS[1],
      text: "Fully agree! This spot is extremely dangerous. I hit my car bumper there last week. Thanks for raising it.",
      createdAt: "2026-06-24T15:00:00Z",
      upvotes: 18,
      upvotedBy: ["curr_user"]
    },
    {
      id: "c_2",
      author: MOCK_CITIZENS[2],
      text: "Let's hope Cllr Amit handles this quickly before the heavy monsoon spells hit Mumbai. Regular repairs last only 2 days.",
      createdAt: "2026-06-24T16:10:00Z",
      upvotes: 12,
      upvotedBy: ["cit_1"]
    },
    {
      id: "c_3",
      author: MOCK_COUNCILLORS[0],
      text: "[Official Update] The contractor crew is already on notice and tar aggregates are being prepared. Rest assured, this is prioritized.",
      createdAt: "2026-06-24T18:20:00Z",
      upvotes: 35,
      upvotedBy: ["curr_user", "cit_1", "cit_2"]
    }
  ],
  "rep_2": [
    {
      id: "c_4",
      author: MOCK_CITIZENS[0],
      text: "Walking home from the HSR metro station at night is quite scary here. Streetlighting is a basic right.",
      createdAt: "2026-06-23T10:30:00Z",
      upvotes: 8,
      upvotedBy: ["cit_2"]
    }
  ],
  "rep_3": [
    {
      id: "c_5",
      author: MOCK_CITIZENS[3],
      text: "Incredible response time! DJB actually fixed this within hours. Shows the power of public upvoting.",
      createdAt: "2026-06-22T15:00:00Z",
      upvotes: 24,
      upvotedBy: ["curr_user", "cit_1"]
    }
  ]
};

export const MOCK_POLL_COMMENTS: { [pollId: string]: Comment[] } = {
  "poll_1": [
    {
      id: "pc_1",
      author: MOCK_CITIZENS[1],
      text: "This would be fantastic for children. Imagine walking without hearing honking horns for once!",
      createdAt: "2026-06-20T11:30:00Z",
      upvotes: 22,
      upvotedBy: ["curr_user"]
    },
    {
      id: "pc_2",
      author: MOCK_CITIZENS[2],
      text: "But where will Andheri West traffic go? Link Road carries 40% of the ward commute. Nearby lanes will get fully choked.",
      createdAt: "2026-06-20T12:15:00Z",
      upvotes: 14,
      upvotedBy: ["cit_1"]
    }
  ]
};

export const INITIAL_FEED_ITEMS: FeedItem[] = [
  {
    id: "post_1",
    type: "post",
    author: MOCK_CITIZENS[0],
    createdAt: "2026-06-25T08:30:00Z",
    upvotes: 45,
    upvotedBy: ["curr_user", "cit_2"],
    commentsCount: 3,
    city: "Mumbai",
    ward: "Ward 12 (Andheri West)",
    content: "Good morning neighbors! 🌅 Absolutely loved the active community turnout at our local park cleanup drive today. The municipal sweepers joined in too! Let's keep our ward green and garbage-free. #CleanAndheri #CommunityFirst",
    image: "https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=600&h=400&q=80"
  },
  {
    id: "rep_1",
    type: "report",
    author: MOCK_CITIZENS[0],
    createdAt: "2026-06-24T14:30:00Z",
    upvotes: 142,
    upvotedBy: ["cit_2", "cit_3", "curr_user"],
    commentsCount: 3,
    city: "Mumbai",
    ward: "Ward 12 (Andheri West)",
    title: "Hazardous Crater-Sized Potholes on Link Road",
    content: "There are multiple deep potholes right after the main intersection on Link Road, Andheri West. During monsoons, these submerge under water and become invisible traps for two-wheelers. Two minor accidents happened yesterday alone.",
    category: "potholes",
    status: "in_progress",
    locationName: "Near Juhu Circle, Link Road",
    image: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&h=400&q=80",
    officialResponse: {
      id: "res_1",
      responder: MOCK_COUNCILLORS[0],
      text: "Thank you for raising this. I have initiated an emergency action order under municipal road maintenance. Patching work will start tonight at 11:30 PM to avoid disrupting traffic. The contractor has been instructed to complete this by Friday morning.",
      createdAt: "2026-06-24T18:15:00Z"
    }
  },
  {
    id: "poll_1",
    type: "poll",
    author: MOCK_COUNCILLORS[0],
    createdAt: "2026-06-20T10:00:00Z",
    upvotes: 56,
    upvotedBy: ["cit_2", "curr_user"],
    commentsCount: 2,
    city: "Mumbai",
    ward: "Ward 12 (Andheri West)",
    pollQuestion: "Should Ward 12 introduce a 100% car-free pedestrian street on weekends?",
    content: "Proposal to make Andheri Link Road (selected shopping strip) pedestrian-only on Saturdays and Sundays between 4 PM to 10 PM. This aims to reduce commercial pollution, promote local foot traffic, and provide child-safe open space.",
    pollOptions: [
      { id: "o1", text: "Yes, fully support it", votes: 412 },
      { id: "o2", text: "Support, but only on Sundays", votes: 231 },
      { id: "o3", text: "No, it will cause heavy detours", votes: 145 },
      { id: "o4", text: "Indifferent / Need more details", votes: 44 }
    ],
    pollVotedBy: { "curr_user": "o1", "cit_1": "o1" },
    pollTotalVotes: 832,
    pollEndsAt: "2026-07-15T18:00:00Z",
    ageBreakdown: {
      "18-25 yrs": 45,
      "26-40 yrs": 35,
      "41-60 yrs": 15,
      "60+ yrs": 5
    },
    areaBreakdown: {
      "Andheri West": 60,
      "Andheri East": 25,
      "Juhu Beach Area": 15
    }
  },
  {
    id: "post_2",
    type: "post",
    author: MOCK_COUNCILLORS[1],
    createdAt: "2026-06-25T06:15:00Z",
    upvotes: 110,
    upvotedBy: ["cit_2", "curr_user"],
    commentsCount: 1,
    city: "Bengaluru",
    ward: "Ward 54 (HSR Layout)",
    content: "Attention HSR Residents! 📢 The annual Ward Development Sabha is scheduled for this Saturday at 10 AM in the Sector 3 Municipal Hall. We will be deliberating the playground allocations and reviewing road blacktopping targets. Please bring your suggestions! #PublicAssembly #HSRDevelopment",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&h=400&q=80"
  },
  {
    id: "rep_2",
    type: "report",
    author: MOCK_CITIZENS[1],
    createdAt: "2026-06-23T09:15:00Z",
    upvotes: 89,
    upvotedBy: ["cit_1", "curr_user"],
    commentsCount: 1,
    city: "Bengaluru",
    ward: "Ward 54 (HSR Layout)",
    title: "Broken Streetlights on 17th Cross Road",
    content: "An entire block of 17th Cross, HSR Layout has non-functioning streetlights for the past five nights. It is completely dark, causing safety concerns for women and senior citizens walking in the evening.",
    category: "streetlights",
    status: "under_review",
    locationName: "17th Cross Road, Sector 3",
    image: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&h=400&q=80"
  },
  {
    id: "poll_2",
    type: "poll",
    author: MOCK_COUNCILLORS[1],
    createdAt: "2026-06-22T09:00:00Z",
    upvotes: 62,
    upvotedBy: ["cit_2"],
    commentsCount: 0,
    city: "Bengaluru",
    ward: "Ward 54 (HSR Layout)",
    pollQuestion: "Where should the new Ward 54 community park budget be prioritized?",
    content: "The municipal body has allocated ₹25 Lakhs for green development in HSR Layout. Vote on your preferred primary amenity layout to finalize the architectural blueprint.",
    pollOptions: [
      { id: "op_1", text: "Children play area & swings", votes: 198 },
      { id: "op_2", text: "Jogging track & outdoor gym", votes: 312 },
      { id: "op_3", text: "Sensory garden & elder seating", votes: 142 },
      { id: "op_4", text: "Rainwater harvesting pond", votes: 88 }
    ],
    pollVotedBy: { "cit_2": "op_2" },
    pollTotalVotes: 740,
    pollEndsAt: "2026-07-10T18:00:00Z",
    ageBreakdown: {
      "18-25 yrs": 15,
      "26-40 yrs": 55,
      "41-60 yrs": 20,
      "60+ yrs": 10
    },
    areaBreakdown: {
      "HSR Sector 1": 20,
      "HSR Sector 2": 18,
      "HSR Sector 3": 42,
      "HSR Sector 4": 20
    }
  },
  {
    id: "post_3",
    type: "post",
    author: MOCK_CITIZENS[2],
    createdAt: "2026-06-25T09:00:00Z",
    upvotes: 38,
    upvotedBy: ["cit_3"],
    commentsCount: 2,
    city: "Delhi",
    ward: "Ward 8 (Saket)",
    content: "Happy to see the AQI in Delhi is under 120 today after last night's rainfall! 🌧️ However, let's keep working on long-term measures. I urge everyone to carpool and use metro services. Let's make Delhi breathable! #DelhiAirQuality #BreathClean",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&h=400&q=80"
  },
  {
    id: "rep_3",
    type: "report",
    author: MOCK_CITIZENS[2],
    createdAt: "2026-06-22T08:00:00Z",
    upvotes: 215,
    upvotedBy: ["cit_1", "cit_2", "cit_4", "curr_user"],
    commentsCount: 1,
    city: "Delhi",
    ward: "Ward 8 (Saket)",
    title: "Major Water Main Pipe Leakage Near Metro Pillar 12",
    content: "Thousands of liters of clean drinking water are leaking from the underground pipe burst near Saket Metro Pillar 12. The entire side lane is flooded, creating traffic jams.",
    category: "water_leakage",
    status: "resolved",
    locationName: "Under Saket Metro Station",
    image: "https://images.unsplash.com/photo-1542060748-10c28b629f6f?auto=format&fit=crop&w=600&h=400&q=80",
    officialResponse: {
      id: "res_2",
      responder: MOCK_COUNCILLORS[2],
      text: "Delhi Jal Board team was deployed on-site within 3 hours of report priority surge. The damaged flange joint has been fully replaced. Leakage is completely plugged and water pressure is restored to Saket block. Thank you for your speedy reporting!",
      createdAt: "2026-06-22T14:30:00Z"
    }
  },
  {
    id: "poll_3",
    type: "poll",
    author: MOCK_COUNCILLORS[2],
    createdAt: "2026-06-23T11:00:00Z",
    upvotes: 82,
    upvotedBy: [],
    commentsCount: 0,
    city: "Delhi",
    ward: "Ward 8 (Saket)",
    pollQuestion: "Do you support ban on heavy commercial trucks entering Saket during day?",
    content: "To combat severe noise, dust pollution, and pedestrian safety hazards, should heavy trucks be banned between 8 AM and 9 PM?",
    pollOptions: [
      { id: "op3_1", text: "Yes, total daytime ban", votes: 612 },
      { id: "op3_2", text: "Ban only during school hours", votes: 120 },
      { id: "op3_3", text: "No, will delay supply chain", votes: 95 }
    ],
    pollVotedBy: {},
    pollTotalVotes: 827,
    pollEndsAt: "2026-06-30T18:00:00Z",
    ageBreakdown: {
      "18-25 yrs": 25,
      "26-40 yrs": 45,
      "41-60 yrs": 25,
      "60+ yrs": 5
    },
    areaBreakdown: {
      "Saket Block A-F": 55,
      "Neb Sarai": 25,
      "Malviya Nagar Border": 20
    }
  },
  {
    id: "rep_4",
    type: "report",
    author: MOCK_CITIZENS[3],
    createdAt: "2026-06-25T01:45:00Z",
    upvotes: 112,
    upvotedBy: ["cit_1", "cit_2"],
    commentsCount: 0,
    city: "Chennai",
    ward: "Ward 112 (Adyar)",
    title: "Illegal Garbage Dumping & Burning on Lake Road",
    content: "Some local commercial vendors are dumping plastics and trash on the Adyar Lake shore and burning it late at night. The toxic smoke gets inside residential homes and is causing breathing issues for children.",
    category: "garbage",
    status: "open",
    image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&h=400&q=80",
    locationName: "Adyar Lake Walkway Edge"
  }
];

