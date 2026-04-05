"use client"
import { db } from '@/configs/db'
import { CourseList, UserQuizResult } from '@/configs/schema'
import { and, eq } from 'drizzle-orm'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import ChapterListCard from './_components/ChapterListCard'
import ChapterContent from './_components/ChapterContent'
import { ChapterContent as ChapterContentSchema } from '@/configs/schema'
import { HiLockClosed } from 'react-icons/hi2'
import { useUser } from '@clerk/nextjs'

function CourseStart() {
    
    const params = useParams();
    const {user} = useUser();

    const [course,setCourse]=React.useState();
    const [selectedChapter,setSelectedChapter]=React.useState();
    const [chapterContent,setChapterContent]=React.useState();
    const [unlockedChapters,setUnlockedChapters]=React.useState([0]);

    useEffect(()=>{
        GetCourse();
    },[])

    useEffect(()=>{
        if(course && user){
            GetQuizResults();
        }
    },[course, user])

    const GetCourse=async()=>{
        const result=await db.select().from(CourseList).where(eq(CourseList?.courseId,params?.courseId));
        setCourse(result[0]);
    }

    const GetQuizResults=async()=>{
        const result=await db.select().from(UserQuizResult)
            .where(and(
                eq(UserQuizResult.courseId, params?.courseId),
                eq(UserQuizResult.userEmail, user?.primaryEmailAddress?.emailAddress)
            ));
        const passed = result.filter(r=>r.passed).map(r=>r.chapterIndex+1);
        setUnlockedChapters([0, ...passed]);
    }

    const GetSelectedChapterContent=async(chapterId)=>{
        const result=await db.select().from(ChapterContentSchema).where(and(eq(ChapterContentSchema.chapterIndex,chapterId),eq(ChapterContentSchema.courseId,course?.courseId)));
        setChapterContent(result[0]);
    }

    const onQuizPass=(chapterIndex)=>{
        setUnlockedChapters(prev=>[...new Set([...prev, chapterIndex+1])]);
    }

    return (
    <div>
        {/**Chapter List sidebar... */}
        <div className='md:w-64 hidden md:block h-screen border-r fixed top-0 left-0 shadow-sm overflow-y-auto'>
            <h2 className='font-medium text-lg bg-primary p-4 text-white'>
                {course?.courseOutput?.course_name || course?.name}
            </h2>
            <div>
                {course?.courseOutput?.chapters?.map((chapter,index)=>(
                    <div key={index} 
                        className={`cursor-pointer ${selectedChapter?.chapter_name==chapter?.chapter_name&&'bg-purple-100'}
                        ${!unlockedChapters.includes(index) && 'opacity-50 cursor-not-allowed'}`}
                        onClick={()=>{
                            if(unlockedChapters.includes(index)){
                                setSelectedChapter(chapter);
                                GetSelectedChapterContent(index);
                            }
                        }}>
                        <div className='flex items-center justify-between pr-3'>
                            <ChapterListCard chapter={chapter} index={index} />
                            {!unlockedChapters.includes(index) && 
                                <HiLockClosed className='text-gray-400 flex-none'/>
                            }
                        </div>
                    </div>
                ))}
            </div>
        </div>
        {/** Content Div for viewing course....*/}
        <div className='md:ml-64'>
            {!selectedChapter ?
                <div className='flex flex-col items-center justify-center h-screen text-center p-10'>
                    <img 
                        src={course?.courseBanner || '/online-lesson.png'} 
                        alt={course?.courseOutput?.course_name}
                        className='w-full max-w-lg h-[250px] object-cover rounded-xl mb-6'
                    />
                    
                    <h2 className='font-bold text-3xl text-primary'>{course?.courseOutput?.course_name}</h2>
                    <p className='text-gray-500 mt-3 text-lg'>{course?.courseOutput?.description}</p>
                    <p className='mt-6 text-gray-400 border p-3 rounded-lg'>👈 Select a chapter from the left panel to start learning</p>
                </div>
            :
                <ChapterContent 
                    chapter={selectedChapter}
                    content={chapterContent}
                    onQuizPass={onQuizPass}
                    userEmail={user?.primaryEmailAddress?.emailAddress}
                    courseId={params?.courseId}
                />
            }
        </div>
    </div>
  )
}

export default CourseStart