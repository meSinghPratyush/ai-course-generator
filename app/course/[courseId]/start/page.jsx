"use client"
import { db } from '@/configs/db'
import { CourseList } from '@/configs/schema'
import { and, eq } from 'drizzle-orm'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import ChapterListCard from './_components/ChapterListCard'
import ChapterContent from './_components/ChapterContent'
import { ChapterContent as ChapterContentSchema } from '@/configs/schema'

function CourseStart() {
    
    const params = useParams();

    const [course,setCourse]=React.useState();
    const [selectedChapter,setSelectedChapter]=React.useState();
    const [chapterContent,setChapterContent]=React.useState();
    useEffect(()=>{
        GetCourse();
    },[])

    /**
     * Use to get course infro by course ID.
     */
  const GetCourse=async()=>{
    const result=await db.select().from(CourseList).where(eq(CourseList?.courseId,params?.courseId));
    
    setCourse(result[0]);
    GetSelectedChapterContent(0);
  }
  const GetSelectedChapterContent=async(chapterId)=>{
    const result=await db.select().from(ChapterContentSchema).where(and(eq(ChapterContentSchema.chapterIndex,chapterId),eq(ChapterContentSchema.courseId,course?.courseId)));
    
    setChapterContent(result[0]);
   
  }
    return (
    <div>
        {/**Chapter List sidebar... */}
        <div className='md:w-64 hidden md:block h-screen border-r fixed top-0 left-0 shadow-sm'>
            <h2 className='font-medium text-lg bg-primary p-4 text-white'>
                {course?.courseOutput?.course_name || course?.name}

            </h2>
            <div>
                {course?.courseOutput?.chapters?.map((chapter,index)=>(
                    <div key={index} className={`cursor-pointer ${selectedChapter?.chapter_name==chapter?.chapter_name&&'bg-purple-100'}`} onClick={()=>{setSelectedChapter(chapter)
                        GetSelectedChapterContent(index)
                    }}>
                        <ChapterListCard chapter={chapter} index={index} />
                    </div>
                ))}
            </div>
        </div>
        {/** Content Div for viewing course....*/}
        <div className='md:ml-64'>
                <ChapterContent chapter={selectedChapter}
                content={chapterContent}
                />
        </div>
    </div>
  )
}

export default CourseStart