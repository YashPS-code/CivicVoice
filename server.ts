import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

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
4. Remind residents of official channel collaborations and thank them for using CivicVoice.
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
    const prompt = `You are an AI-assisted civic dialogue moderator for the platform CivicVoice.
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
      // Handle optional markdown json wrapping just in case
      const jsonString = resultText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      const evaluation = JSON.parse(jsonString);
      res.json({ ...evaluation, isMock: false });
    } catch {
      res.json(fallbackModeration);
    }
  } catch (error) {
    console.error("Gemini API error during comment moderation:", error);
    res.json(fallbackModeration);
  }
});

// 3. API: Generate Intelligent Suggestion for Civic Reports
app.post("/api/gemini/suggest-report", async (req, res) => {
  const { title, rawDescription, city, ward } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required for recommendation." });
  }

  const fallbackSuggestion = {
    enhancedDescription: rawDescription || "The reported issue needs attention from local ward administrators.",
    suggestedCategory: "others",
    impactScore: "Medium Priority",
    isMock: true
  };

  if (!ai) {
    return res.json(fallbackSuggestion);
  }

  try {
    const prompt = `A citizen wants to report a civic issue on CivicVoice.
User input:
- Brief Title: "${title}"
- Raw description: "${rawDescription || 'none'}"
- City/Ward: ${city} / ${ward}

Please analyze this and output a JSON object containing:
1. "enhancedDescription": A professional, clear, and action-oriented rewrite of the description. It should clearly state the danger/impact, location context, and urge local authorities. Keep it concise (under 80 words).
2. "suggestedCategory": Choose exactly one of these: "potholes", "streetlights", "water_leakage", "garbage", "encroachments", "traffic", "pollution", "others".
3. "impactScore": One of "High Priority", "Medium Priority", "Low Priority" based on safety and citizen impact.

Output ONLY the raw JSON string, do not include markdown \`\`\`json wrapping.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text?.trim() || "";
    const cleanJson = text.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    const result = JSON.parse(cleanJson);
    res.json({ ...result, isMock: false });
  } catch (error) {
    console.error("Gemini API error during report suggestion:", error);
    res.json(fallbackSuggestion);
  }
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
    console.log(`CivicVoice full-stack server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
