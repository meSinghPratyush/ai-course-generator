"use client"
import React, { useEffect } from 'react'
import { CourseList, ChapterContent } from '@/configs/schema';
import { and, eq } from 'drizzle-orm';
import { db } from '@/configs/db';
import { useUser } from '@clerk/nextjs';
import { useParams, useRouter } from "next/navigation";
import CourseBasicInfo from './_components/CourseBasicInfo';
import CourseDetail from './_components/CourseDetail';
import ChapterList from './_components/ChapterList';
import { Button } from '@/components/ui/button';
import LoadingDialog from '../_components/LoadingDialog';
import { GenerateChapterContent_AI } from '@/configs/AiModel';
import service from '@/configs/service';


function CourseLayout() {
  const {user}=useUser();
   const params = useParams();
   const [course,setCourse]=React.useState([]);
   const [loading,setLoading]=React.useState(false);
   const router=useRouter();
  useEffect(()=>{
    if(params?.courseId && user){
      GetCourse();
    }
  },[params?.courseId,user]);
  
  const GetCourse=async()=>{
    const result=await db.select().from(CourseList).
    where(and(eq(CourseList.courseId,params?.courseId),
    eq(CourseList?.createdBy,user?.primaryEmailAddress?.emailAddress)))
    setCourse(result[0]);
    console.log(result);
  }

  const GenerateChapterContent=()=>{
    setLoading(true);
    const chapters = course?.courseOutput?.chapters || [];
    const totalChapters = chapters.length;

    chapters.forEach(async(chapter, index) => {
      const isLastChapter = index === totalChapters - 1;

      const PROMPT = `Explain the concept in Detail on Topic: ${course?.name}, Chapter: ${chapter?.chapter_name} in JSON Format with the following fields:
          - title: chapter title
          - sections: an array of sections, each section object should have:
            - concept: the concept/topic name for this section
            - explanation: detailed explanation of this concept in markdown format
            - code: HTML code example for this concept if applicable, else empty string
          - quiz: an array of 5 multiple choice questions to test knowledge of this chapter, each question object should have:
            - question: the question text
            - options: array of 4 options
            - correctAnswer: the correct option (must match one of the options exactly)
          ${isLastChapter ? `- finalQuiz: an array of 10 multiple choice questions covering the entire course topic ${course?.courseOutput?.course_name}, each question object should have:
            - question: the question text
            - options: array of 4 options
            - correctAnswer: the correct option (must match one of the options exactly)` : ''}
          Return only valid JSON, no markdown, no explanation.`

      try{
          // Check if chapter already exists in DB — skip if so
          const existing = await db.select().from(ChapterContent)
            .where(and(
              eq(ChapterContent.courseId, course?.courseId),
              eq(ChapterContent.chapterIndex, index)
            ));

          if(existing.length > 0){
            console.log(`Chapter ${index} already exists, skipping...`);
            if(isLastChapter){
              setLoading(false);
              router.replace('/create-course/'+course?.courseId+'/finish');
            }
            return;
          }

          // Generate AI content
          const result = await GenerateChapterContent_AI(PROMPT);
          console.log(result);

          // Generate Video URL
          const videoResp = await service.getVideos(course?.name+':'+chapter?.chapter_name);
          const videoId = videoResp[0]?.id?.videoId || '';
          console.log('videoId:', videoId);

          // Save chapter content + video URL to DB
          await db.insert(ChapterContent).values({
            courseId: course?.courseId,
            chapterIndex: index,
            content: result,
            videoId: videoId
          });

          if(isLastChapter){
            await db.update(CourseList).set({ publish: true }).where(eq(CourseList.courseId, course?.courseId));
            setLoading(false);
            router.replace('/create-course/'+course?.courseId+'/finish');
          }

        }catch(e){
          setLoading(false);
          console.log(e);
        }
        
    })
  }
  return (
    <div className='mt-10 px-7 md:px-20 lg:px-44'>
      <h2 className='font-bold text-center text-2xl'>Course Layout</h2>

      <LoadingDialog loading={loading}/>

      {/* Basic Info */}
        <CourseBasicInfo course={course} refreshData={()=>GetCourse()}/>

      {/* Course Detail */ }
        <CourseDetail course={course}/>

      {/* List of Lesson */}
        <ChapterList course={course} refreshData={()=>GetCourse()}/>

        <Button onClick={GenerateChapterContent} className="my-10">Generate Course Content</Button>

    </div>
  )
}

export default CourseLayout