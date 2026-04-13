import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

// ── Groq fallback: plain text response ──
const groqGenerateText = async (prompt) => {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
  });
  return response.choices[0].message.content;
};

// ── Groq fallback: JSON response ──
const groqGenerateJSON = async (prompt) => {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });
  const raw = response.choices[0].message.content;
  return JSON.parse(raw.replace(/```json|```/g, "").trim());
};

// ── AI Call Function ──
export const GenerateCourseLayout_AI = async (prompt) => {
  const finalPrompt = `
Generate a course in STRICT JSON format.

IMPORTANT:
- Use EXACT keys (case-sensitive)
- Do NOT change key names
- Do NOT add extra fields
- Do NOT use spaces in keys
- Return ONLY JSON

FORMAT:

{
  "course_name": "string",
  "description": "string",
  "duration": "string",
  "level": "string",
  "category": "string",
  "chapters": [
    {
      "chapter_name": "string",
      "about": "string",
      "duration": "string"
    }
  ]
}

USER INPUT:
${prompt}
`;

  // Try Gemini first
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: finalPrompt }] }],
    });
    return response.text;
  } catch (geminiError) {
    console.warn("Gemini failed, switching to Groq...", geminiError.message);
  }

  // Fallback to Groq
  try {
    return await groqGenerateText(finalPrompt);
  } catch (groqError) {
    throw new Error("Both Gemini and Groq failed: " + groqError.message);
  }
};

// ── Normalizer ──
export const normalizeCourseOutput = (data) => {
  return {
    course_name: data.course_name || data["Course Name"] || "",
    description: data.description || data["Description"] || "",
    duration: data.duration || data["Duration"] || "",
    level: data.level || data["Level"] || "",
    category: data.category || data["Category"] || "",
    chapters: (data.chapters || data.Chapters || []).map((ch) => ({
      chapter_name: ch.chapter_name || ch["Chapter Name"] || ch.title || "",
      about: ch.about || ch["About"] || ch.description || "",
      duration: ch.duration || ch["Duration"] || "1 hour",
    })),
  };
};

// ── Chapter Content Generator ──
export const GenerateChapterContent_AI = async (prompt) => {

  // Try Gemini first
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const raw = response.text;
    let cleaned = raw.replace(/```json|```/g, "").trim();

    try {
      return JSON.parse(cleaned);
    } catch (e) {
      console.warn("JSON parse failed, retrying Gemini with stricter prompt...");
      const retryResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{
          role: "user",
          parts: [{ text: prompt + "\n\nCRITICAL: Return ONLY valid JSON. Escape all special characters inside string values properly." }],
        }],
      });
      const retryRaw = retryResponse.text.replace(/```json|```/g, "").trim();
      return JSON.parse(retryRaw);
    }
  } catch (geminiError) {
    console.warn("Gemini failed for chapter content, switching to Groq...", geminiError.message);
  }

  // Fallback to Groq
  try {
    return await groqGenerateJSON(
      prompt + "\n\nCRITICAL: Return ONLY valid JSON. No markdown, no explanation."
    );
  } catch (groqError) {
    throw new Error("Both Gemini and Groq failed: " + groqError.message);
  }
};