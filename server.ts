import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { INITIAL_FEED_ITEMS, MOCK_REPORTS_COMMENTS, MOCK_POLL_COMMENTS } from "./src/mockData";
import { FeedItem, Comment } from "./src/types";

dotenv.config();

const app = express();

// In-memory feed store
let feedItems: FeedItem[] = [];
let commentsMap: { [key: string]: Comment[] } = {};
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));

// In-memory user database
interface DBUser {
  id: string;
  username: string;
  passwordHash: string;
  displayName: string;
  avatar: string;
  role: "citizen" | "official";
  isVerified: boolean;
  badgeType?: "verified_resident" | "verified_official";
  civicPoints: number;
  city: "Mumbai" | "Bengaluru" | "Delhi" | "Kolkata" | "Chennai";
  ward: string;
  following: string[];
  followersCount: number;
  followingCount: number;
  bio: string;
}

const registeredUsers: { [username: string]: DBUser } = {
  aarav: {
    id: "usr_aarav",
    username: "aarav",
    passwordHash: "password",
    displayName: "Aarav Patel",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    role: "citizen",
    isVerified: true,
    badgeType: "verified_resident",
    civicPoints: 180,
    city: "Mumbai",
    ward: "Ward 12 (Andheri West)",
    following: [],
    followersCount: 142,
    followingCount: 56,
    bio: "Civic-minded resident. Passionate about local infrastructure and public parks.",
  },
  sandeep: {
    id: "usr_sandeep",
    username: "sandeep",
    passwordHash: "password",
    displayName: "Cllr. Sandeep Hegde",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
    role: "official",
    isVerified: true,
    badgeType: "verified_official",
    civicPoints: 1200,
    city: "Bengaluru",
    ward: "Ward 54 (HSR Layout)",
    following: [],
    followersCount: 520,
    followingCount: 89,
    bio: "Elected Ward Councillor. Ready to listen and issue administrative resolutions.",
  }
};

// Auth API: Register a new user
app.post("/api/auth/register", (req, res) => {
  const { username, password, displayName, role, city, ward } = req.body;
  if (!username || !password || !displayName) {
    return res.status(400).json({ error: "Username, password, and display name are required." });
  }

  const normUser = username.toLowerCase().trim();
  if (registeredUsers[normUser]) {
    return res.status(400).json({ error: "Username is already taken." });
  }

  const isOfficial = role === "official";
  const newUser: DBUser = {
    id: `usr_${Date.now()}`,
    username: normUser,
    passwordHash: password,
    displayName: displayName.trim(),
    avatar: isOfficial
      ? "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150&q=80"
      : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
    role: role || "citizen",
    isVerified: isOfficial,
    badgeType: isOfficial ? "verified_official" : "verified_resident",
    civicPoints: isOfficial ? 500 : 50,
    city: city || "Mumbai",
    ward: ward || "Ward 12 (Andheri West)",
    following: [],
    followersCount: 0,
    followingCount: 0,
    bio: `Resident of ${ward || "Ward 12 (Andheri West)"}, ${city || "Mumbai"}.`,
  };

  registeredUsers[normUser] = newUser;
  
  // Return the user without the passwordHash
  const { passwordHash, ...userResponse } = newUser;
  res.status(201).json(userResponse);
});

// Auth API: Login
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  const normUser = username.toLowerCase().trim();
  const user = registeredUsers[normUser];
  if (!user || user.passwordHash !== password) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  const { passwordHash, ...userResponse } = user;
  res.json(userResponse);
});

// Lazy initialize Gemini client
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("GoogleGenAI initialized successfully on the server.");
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI client:", error);
  }
} else {
  console.log("No valid GEMINI_API_KEY found. Operating in fallback mock-response mode.");
}

// 1. API: Generate Verified Councillor / Official Response to a civic report
app.post("/api/gemini/councillor-response", async (req, res) => {
  const { title, description, category, city, ward, officialName, officialRole } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Missing report title or description." });
  }

  // Fallback response generator in case AI is not available
  const getFallbackResponse = () => {
    const dates = ["7 days", "10 days", "14 days", "21 days"];
    const targetDays = dates[Math.floor(Math.random() * dates.length)];
    return {
      text: `Thank you for bringing this issue regarding **${category || 'civic services'}** in **${ward}, ${city}** to our notice. As the ${officialRole || 'Municipal Ward Representative'}, I have forwarded this report to the local maintenance department. We have scheduled an on-site inspection within the next 48 hours. Our team aims to complete the resolution work within ${targetDays}. Public updates will be posted as work progresses.`,
      isMock: true
    };
  };

  if (!ai) {
    return res.json(getFallbackResponse());
  }

  try {
    const prompt = `You are representing a government official in India (e.g. Ward Councillor, Municipal Commissioner).
Your details:
- Name: ${officialName || "Councillor Rajesh Kumar"}
- Role: ${officialRole || "Ward 14 Representative / Councillor"}
- City: ${city}
- Ward: ${ward}

An active resident has filed a civic problem report:
- Issue Title: "${title}"
- Category: "${category}"
- Description: "${description}"

Generate a formal, highly constructive, professional, and reassuring official response.
Your response should:
1. Address the resident politely and acknowledge the report.
2. Outline specific actions to be taken (e.g., dispatching inspection squad, listing budget/approvals, or sending ground maintenance crew).
3. Provide a realistic timeline (e.g. 3 days, 1 week, etc.) based on the complexity of ${category}.
4. Remind residents of official channel collaborations and thank them for using BirdView.
Keep the response within 120-180 words. Do not use generic markdown headers (like #, ##) but you can use bolding (**text**) for styling and clean paragraphs.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const responseText = response.text || "";
    if (!responseText) {
      return res.json(getFallbackResponse());
    }

    res.json({ text: responseText.trim(), isMock: false });
  } catch (error: any) {
    console.error("Gemini API error during official response generation:", error);
    res.json(getFallbackResponse());
  }
});

// 2. API: Comment Moderation and AI Civility Check
app.post("/api/gemini/moderate-comment", async (req, res) => {
  const { commentText } = req.body;

  if (!commentText) {
    return res.status(400).json({ error: "Comment text is required." });
  }

  const fallbackModeration = {
    isFlagged: false,
    reason: "Passed client-side heuristic validation.",
    moderatedText: commentText,
    isMock: true
  };

  if (!ai) {
    // Basic local keyword regex for safety checks
    const badWords = ["abuse", "scam", "idiot", "corrupt thief", "bloody", "bastard", "hate", "kill", "die", "fudge", "trash government"];
    const containsBad = badWords.some(word => commentText.toLowerCase().includes(word));
    if (containsBad) {
      return res.json({
        isFlagged: true,
        reason: "Comment flagged for toxic, non-constructive, or offensive language.",
        moderatedText: "[Comment flagged for content violation - Please keep discussions civil]",
        isMock: true
      });
    }
    return res.json(fallbackModeration);
  }

  try {
    const prompt = `You are an AI-assisted civic dialogue moderator for the platform BirdView.
Our guidelines demand that user comments are:
1. Civil and respectful (no slurs, extreme toxicity, insults, or violent threats).
2. Constructive (discussions about roads, lights, and ward policy can be critical, but must avoid pure abuse).

Analyze this comment text:
"${commentText}"

Please evaluate and output a JSON response matching exactly this schema:
{
  "isFlagged": boolean,
  "reason": string (brief reason explaining why it is flagged, or "Passed civil debate guidelines" if safe),
  "moderatedText": string (the original text if safe, or a redacted version if it contains severe insults)
}

Make sure to reply ONLY with the JSON block. Do not include markdown code fence formatting.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const resultText = response.text?.trim() || "";
    if (!resultText) {
      return res.json(fallbackModeration);
    }

    try {
      const evaluation = extractJson(resultText);
      res.json({ ...evaluation, isMock: false });
    } catch {
      res.json(fallbackModeration);
    }
  } catch (error) {
    console.error("Gemini API error during comment moderation:", error);
    res.json(fallbackModeration);
  }
});

// Helper: Safely extract JSON from text which might contain markdown formatting
function extractJson(text: string): any {
  try {
    const clean = text.trim();
    const jsonMatch = clean.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(clean);
  } catch (e) {
    throw new Error("Failed to parse JSON content.");
  }
}

// Helper: Generate a smart dynamic fallback suggestion if API key is not configured or fails
function getSmartFallbackSuggestion(title: string, rawDescription: string, city: string, ward: string) {
  const desc = (rawDescription || "").trim();
  const lowerTitle = title.toLowerCase();
  const lowerDesc = desc.toLowerCase();
  const fullText = `${lowerTitle} ${lowerDesc}`;

  let category = "others";
  if (fullText.includes("pothole") || fullText.includes("road") || fullText.includes("tar") || fullText.includes("cracks") || fullText.includes("pavement")) {
    category = "potholes";
  } else if (fullText.includes("light") || fullText.includes("lamp") || fullText.includes("dark") || fullText.includes("electricity") || fullText.includes("bulb")) {
    category = "streetlights";
  } else if (fullText.includes("water") || fullText.includes("leak") || fullText.includes("pipe") || fullText.includes("drain") || fullText.includes("sewer")) {
    category = "water_leakage";
  } else if (fullText.includes("garbage") || fullText.includes("trash") || fullText.includes("waste") || fullText.includes("litter") || fullText.includes("dump")) {
    category = "garbage";
  } else if (fullText.includes("encroach") || fullText.includes("illegal") || fullText.includes("vendor") || fullText.includes("shop") || fullText.includes("occupy")) {
    category = "encroachments";
  } else if (fullText.includes("traffic") || fullText.includes("jam") || fullText.includes("signal") || fullText.includes("car") || fullText.includes("congestion")) {
    category = "traffic";
  } else if (fullText.includes("smoke") || fullText.includes("pollut") || fullText.includes("dust") || fullText.includes("smell") || fullText.includes("air") || fullText.includes("chemical")) {
    category = "pollution";
  }

  let impactScore = "Medium Priority";
  if (["potholes", "water_leakage", "traffic", "pollution"].includes(category) || lowerTitle.includes("danger") || lowerTitle.includes("accident") || lowerTitle.includes("urgent")) {
    impactScore = "High Priority";
  } else if (lowerTitle.includes("clean") || lowerTitle.includes("beautify") || lowerTitle.includes("paint")) {
    impactScore = "Low Priority";
  }

  const detailSentence = desc ? `Specifically, ${desc.charAt(0).toLowerCase() + desc.slice(1)}.` : "This issue has been noticed by residents in the area and needs immediate administrative inspection.";
  const formattedWard = ward && ward !== "All Wards" ? ward : "the local area";
  const formattedCity = city || "the municipality";

  const enhancedDescription = `🚨 [AI ENHANCED] Urgent civic attention requested for: "${title}" in ${formattedWard}, ${formattedCity}. 
  
${detailSentence} 

This grievance significantly disrupts daily community activities, poses immediate safety/health risks for local commuters, and degrades the civic standard of our community. We urge the local ward administrators, field engineers, and municipal authorities to quickly register this report, dispatch an on-site verification squad, and schedule prompt corrective works.`;

  return {
    enhancedDescription,
    suggestedCategory: category,
    impactScore,
    isMock: true
  };
}

// 3. API: Generate Intelligent Suggestion for Civic Reports
app.post("/api/gemini/suggest-report", async (req, res) => {
  const { title, rawDescription, city, ward } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required for recommendation." });
  }

  const fallbackSuggestion = getSmartFallbackSuggestion(title, rawDescription, city, ward);

  if (!ai) {
    return res.json(fallbackSuggestion);
  }

  try {
    const prompt = `A citizen wants to report a civic issue on BirdView.
User input:
- Brief Title: "${title}"
- Raw description: "${rawDescription || 'none'}"
- City/Ward: ${city} / ${ward}

Please analyze this and output a JSON object containing:
1. "enhancedDescription": A professional, clear, and action-oriented rewrite of the description. It should clearly state the danger/impact, location context, and urge local authorities. Keep it concise (under 80 words).
2. "suggestedCategory": Choose exactly one of these: "potholes", "streetlights", "water_leakage", "garbage", "encroachments", "traffic", "pollution", "others".
3. "impactScore": One of "High Priority", "Medium Priority", "Low Priority" based on safety and citizen impact.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            enhancedDescription: {
              type: Type.STRING,
              description: "Action-oriented and polished rewrite of the user's description. Max 80 words."
            },
            suggestedCategory: {
              type: Type.STRING,
              description: "Must be exactly one of: potholes, streetlights, water_leakage, garbage, encroachments, traffic, pollution, others."
            },
            impactScore: {
              type: Type.STRING,
              description: "Must be exactly one of: High Priority, Medium Priority, Low Priority"
            }
          },
          required: ["enhancedDescription", "suggestedCategory", "impactScore"]
        }
      }
    });

    const text = response.text?.trim() || "";
    if (!text) {
      return res.json(fallbackSuggestion);
    }
    const result = extractJson(text);
    res.json({ ...result, isMock: false });
  } catch (error) {
    console.error("Gemini API error during report suggestion:", error);
    res.json(fallbackSuggestion);
  }
});

// 4. API: Get all feed items
app.get("/api/feed", (req, res) => {
  res.json(feedItems);
});

// 5. API: Publish a new feed item
app.post("/api/feed", (req, res) => {
  const payload = req.body;
  if (!payload || !payload.type || !payload.author) {
    return res.status(400).json({ error: "Invalid post payload." });
  }

  const id = `${payload.type}_${Date.now()}`;
  let item: any = {
    id,
    type: payload.type,
    author: payload.author,
    createdAt: new Date().toISOString(),
    upvotes: 0,
    upvotedBy: [],
    commentsCount: 0,
    city: payload.city,
    ward: payload.ward,
    content: payload.content,
    image: payload.image,
  };

  if (payload.type === "report") {
    item = {
      ...item,
      title: payload.title,
      category: payload.category || "others",
      severity: payload.severity || "medium",
      status: "open",
      locationName: payload.locationName || "",
      latitude: payload.latitude,
      longitude: payload.longitude,
      communityVerifications: [],
    };
  } else if (payload.type === "poll") {
    item = {
      ...item,
      category: payload.category || "others",
      pollQuestion: payload.pollQuestion,
      pollOptions: (payload.pollOptions || []).map((o: string, i: number) => ({
        id: `opt_${i}_${Date.now()}`,
        text: o,
        votes: 0,
      })),
      pollVotedBy: {},
      pollTotalVotes: 0,
      pollEndsAt: new Date(Date.now() + 7 * 86400000).toISOString(),
      ageBreakdown: { "18-25 yrs": 25, "26-40 yrs": 45, "41-60 yrs": 20, "60+ yrs": 10 },
      areaBreakdown: { [payload.ward === "All Wards" ? "Main Block" : payload.ward]: 100 },
    };
  }

  feedItems = [item as FeedItem, ...feedItems];
  res.status(201).json(item);
});

// 6. API: Toggle Upvote/Like
app.post("/api/feed/:id/upvote", (req, res) => {
  const { id } = req.params;
  const { userId, isVerified } = req.body;
  
  const itemIndex = feedItems.findIndex((item) => item.id === id);
  if (itemIndex === -1) {
    return res.status(404).json({ error: "Item not found." });
  }

  const item = feedItems[itemIndex];
  const hasLiked = item.upvotedBy.includes(userId);
  const w = item.type === "report" && isVerified ? 2 : 1;
  const newUpvotedBy = hasLiked
    ? item.upvotedBy.filter((uid) => uid !== userId)
    : [...item.upvotedBy, userId];

  const updated = {
    ...item,
    upvotes: Math.max(0, item.upvotes + (hasLiked ? -w : w)),
    upvotedBy: newUpvotedBy
  };

  feedItems[itemIndex] = updated;
  res.json(updated);
});

// 7. API: Vote on a poll
app.post("/api/feed/:id/vote", (req, res) => {
  const { id } = req.params;
  const { userId, optionId } = req.body;

  const itemIndex = feedItems.findIndex((item) => item.id === id);
  if (itemIndex === -1) {
    return res.status(404).json({ error: "Item not found." });
  }

  const item = feedItems[itemIndex];
  if ((item.pollVotedBy || {})[userId]) {
    return res.status(400).json({ error: "Already voted." });
  }

  const updatedOptions = (item.pollOptions || []).map((opt) =>
    opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
  );

  const updated = {
    ...item,
    pollOptions: updatedOptions,
    pollVotedBy: { ...(item.pollVotedBy || {}), [userId]: optionId },
    pollTotalVotes: (item.pollTotalVotes || 0) + 1,
  };

  feedItems[itemIndex] = updated;
  res.json(updated);
});

// 8. API: Toggle community verification
app.post("/api/feed/:id/verify", (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  const itemIndex = feedItems.findIndex((item) => item.id === id);
  if (itemIndex === -1) {
    return res.status(404).json({ error: "Item not found." });
  }

  const item = feedItems[itemIndex];
  const verifications = item.communityVerifications || [];
  const hasVerified = verifications.includes(userId);
  const updated = {
    ...item,
    communityVerifications: hasVerified
      ? verifications.filter(uid => uid !== userId)
      : [...verifications, userId],
  };

  feedItems[itemIndex] = updated;
  res.json(updated);
});

// 9. API: Update report status
app.post("/api/feed/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const itemIndex = feedItems.findIndex((item) => item.id === id);
  if (itemIndex === -1) {
    return res.status(404).json({ error: "Item not found." });
  }

  const item = feedItems[itemIndex];
  const updated = { ...item, status };

  feedItems[itemIndex] = updated;
  res.json(updated);
});

// 10. API: Submit official response
app.post("/api/feed/:id/official-response", (req, res) => {
  const { id } = req.params;
  const { responder, text } = req.body;

  const itemIndex = feedItems.findIndex((item) => item.id === id);
  if (itemIndex === -1) {
    return res.status(404).json({ error: "Item not found." });
  }

  const item = feedItems[itemIndex];
  const updated = {
    ...item,
    status: "in_progress" as any,
    officialResponse: {
      id: `res_${Date.now()}`,
      responder,
      text,
      createdAt: new Date().toISOString()
    }
  };

  feedItems[itemIndex] = updated;
  res.json(updated);
});

// 11. API: Get comments
app.get("/api/feed/:id/comments", (req, res) => {
  const { id } = req.params;
  res.json(commentsMap[id] || []);
});

// 12. API: Add a comment with optional AI moderation
app.post("/api/feed/:id/comments", async (req, res) => {
  const { id } = req.params;
  const { author, text } = req.body;

  const itemIndex = feedItems.findIndex((item) => item.id === id);
  if (itemIndex === -1) {
    return res.status(404).json({ error: "Item not found." });
  }

  let isFlagged = false;
  let reason = "Passed civil debate guidelines";
  let moderatedText = text;

  if (ai) {
    try {
      const prompt = `You are an AI-assisted civic dialogue moderator for the platform BirdView.
Our guidelines demand that user comments are:
1. Civil and respectful (no slurs, extreme toxicity, insults, or violent threats).
2. Constructive (discussions about roads, lights, and ward policy can be critical, but must avoid pure abuse).

Analyze this comment text:
"${text}"

Please evaluate and output a JSON response matching exactly this schema:
{
  "isFlagged": boolean,
  "reason": string (brief reason explaining why it is flagged, or "Passed civil debate guidelines" if safe),
  "moderatedText": string (the original text if safe, or a redacted version if it contains severe insults)
}

Make sure to reply ONLY with the JSON block. Do not include markdown code fence formatting.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const resultText = response.text?.trim() || "";
      if (resultText) {
        const evaluation = JSON.parse(resultText.replace(/```json/g, "").replace(/```/g, "").trim());
        isFlagged = evaluation.isFlagged;
        reason = evaluation.reason;
        moderatedText = evaluation.moderatedText;
      }
    } catch (err) {
      console.error("Gemini moderation failed, falling back", err);
    }
  } else {
    const badWords = ["abuse", "scam", "idiot", "corrupt thief", "bloody", "bastard", "hate", "kill", "die", "fudge", "trash government"];
    const containsBad = badWords.some(word => text.toLowerCase().includes(word));
    if (containsBad) {
      isFlagged = true;
      reason = "Comment flagged for toxic, non-constructive, or offensive language.";
      moderatedText = "[Comment flagged for content violation - Please keep discussions civil]";
    }
  }

  const newComment: Comment = {
    id: `com_${Date.now()}`,
    author,
    text: moderatedText,
    createdAt: new Date().toISOString(),
    upvotes: 0,
    upvotedBy: [],
    isFlagged,
  };

  commentsMap[id] = [newComment, ...(commentsMap[id] || [])];
  
  const item = feedItems[itemIndex];
  feedItems[itemIndex] = {
    ...item,
    commentsCount: item.commentsCount + 1,
  };

  res.status(201).json({
    comment: newComment,
    updatedItem: feedItems[itemIndex],
    reason,
    isFlagged
  });
});

// Serve static assets and Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BirdView full-stack server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
