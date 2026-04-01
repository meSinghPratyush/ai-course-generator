import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

// 🔥 AI Call Function
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

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [{ text: finalPrompt }],
      },
    ],
  });

  return response.text;
};

// 🔥 Normalizer (NEW)
export const normalizeCourseOutput = (data) => {
  return {
    course_name: data.course_name || data["Course Name"] || "",
    description: data.description || data["Description"] || "",
    duration: data.duration || data["Duration"] || "",
    level: data.level || data["Level"] || "",
    category: data.category || data["Category"] || "",

    chapters: (data.chapters || data.Chapters || []).map((ch) => ({
      chapter_name:
        ch.chapter_name || ch["Chapter Name"] || ch.title || "",
      about:
        ch.about || ch["About"] || ch.description || "",
      duration:
        ch.duration || ch["Duration"] || "1 hour",
    })),
  };
};