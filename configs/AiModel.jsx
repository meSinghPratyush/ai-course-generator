import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

export const GenerateCourseLayout_AI = async (prompt) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash", 
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  });

  return response.text;
};