"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/configs/db";
import { CourseList } from "@/configs/schema";
import { eq } from "drizzle-orm";
import AiModel from "@/configs/AiModel";

import CourseBasicInfo from "./_components/CourseBasicInfo";
import CourseDetail from "./_components/CourseDetail";
import ChapterList from "./_components/ChapterList";

export default function CourseLayout() {
  const params = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch course
  const GetCourse = async () => {
    if (!params?.courseId) return;

    const result = await db
      .select()
      .from(CourseList)
      .where(eq(CourseList.courseId, params.courseId));

    setCourse(result[0]);
  };

  useEffect(() => {
    GetCourse();
  }, [params?.courseId]);

  // 🔥 Generate Chapter Content
  const GenerateChapterContent = async () => {
    if (!course) return;

    setLoading(true);

    try {
      const prompt = `
Explain the concepts in detail for the following course:

Course Title: "${course.name}"

Chapters:
${course.courseOutput?.chapters
  ?.map((c, index) => `${index + 1}. ${c.title}`)
  .join("\n")}

Return the response strictly in this JSON format:

{
  "chapters": [
    {
      "title": "Chapter Title",
      "description": "Detailed explanation of the concept in 4-6 paragraphs",
      "codeExample": "HTML code example if applicable, otherwise null"
    }
  ]
}

Rules:
- The explanation must be beginner-friendly.
- Provide detailed structured explanations.
- Include HTML code examples only if applicable.
- Return ONLY valid JSON.
- Do NOT add markdown.
- Do NOT add backticks.
- Do NOT add extra text outside JSON.
`;
console.log("Prompt sent to AI:", prompt);

      const result = await AiModel.sendMessage(prompt);
      const responseText = result.response?.text();

      // Clean possible markdown formatting
      const cleanText = responseText.replace(/```json|```/g, "");

      const parsedContent = JSON.parse(cleanText);

      // Update DB
      await db
        .update(CourseList)
        .set({
          courseOutput: {
            ...course.courseOutput,
            chapters: parsedContent.chapters,
          },
        })
        .where(eq(CourseList.courseId, params.courseId));

      await GetCourse();
    } catch (error) {
      console.log("Error generating content:", error);
    }

    setLoading(false);
  };

  if (!course) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="mt-10 px-7 md:px-20 lg:px-44">

      <h2 className="font-bold text-center text-2xl mb-6">
        Course Layout
      </h2>

      {/* Basic Info */}
      <CourseBasicInfo
        course={course}
        refreshData={GetCourse}
      />

      {/* Course Detail */}
      <CourseDetail course={course} />

      {/* Chapters */}
      <ChapterList
        course={course}
        refreshData={GetCourse}
      />

      {/* Generate Chapter Content Button */}
      <div className="mt-6 text-right">
        <button
          onClick={GenerateChapterContent}
          className="bg-green-600 px-6 py-2 rounded text-white"
        >
          {loading ? "Generating..." : "Generate Chapter Content"}
        </button>
      </div>

    </div>
  );
}
