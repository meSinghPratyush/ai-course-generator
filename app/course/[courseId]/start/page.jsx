"use client"
import { db } from '@/configs/db'
import { CourseList, UserQuizResult, CoursePurchase } from '@/configs/schema'
import { and, eq } from 'drizzle-orm'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import ChapterListCard from './_components/ChapterListCard'
import ChapterContent from './_components/ChapterContent'
import { ChapterContent as ChapterContentSchema } from '@/configs/schema'
import { HiLockClosed, HiArrowLeft, HiBars3, HiXMark } from 'react-icons/hi2'
import { useUser } from '@clerk/nextjs'

function CourseStart() {
    
    const params = useParams();
    const {user} = useUser();
    const router = useRouter();

    const [course,setCourse]=React.useState();
    const [selectedChapter,setSelectedChapter]=React.useState();
    const [selectedChapterIndex,setSelectedChapterIndex]=React.useState(null);
    const [chapterContent,setChapterContent]=React.useState();
    const [unlockedChapters,setUnlockedChapters]=React.useState([0]);
    const [hasAccess,setHasAccess]=React.useState(false);
    const [mobileMenuOpen, setMobileMenuOpen]=React.useState(false);

    useEffect(()=>{
        GetCourse();
    },[])

    useEffect(()=>{
        if(course && user){
            GetQuizResults();
            CheckAccess();
        }
    },[course, user])

    const GetCourse=async()=>{
        const result=await db.select().from(CourseList).where(eq(CourseList?.courseId,params?.courseId));
        setCourse(result[0]);
    }

    const CheckAccess=async()=>{
        const userEmail = user?.primaryEmailAddress?.emailAddress;

        // Owner always has access
        if(course?.createdBy === userEmail){
            setHasAccess(true);
            return;
        }

        // Check if user has purchased the course
        const result = await db.select().from(CoursePurchase)
            .where(and(
                eq(CoursePurchase.courseId, params?.courseId),
                eq(CoursePurchase.buyerEmail, userEmail)
            ));

        if(result.length === 0){
            // No access --- redirect to course detail page
            router.replace('/course/'+params?.courseId);
            return;
        }

        setHasAccess(true);
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

    // Navigate to next chapter
    const onNextChapter=()=>{
        const nextIndex = selectedChapterIndex + 1;
        const chapters = course?.courseOutput?.chapters || [];
        if(nextIndex < chapters.length){
            const nextChapter = chapters[nextIndex];
            setSelectedChapter(nextChapter);
            setSelectedChapterIndex(nextIndex);
            GetSelectedChapterContent(nextIndex);
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
    }

    // A chapter is completed if the next chapter is unlocked
    const isChapterCompleted = (index) => {
        return unlockedChapters.includes(index + 1);
    }

    // Block render until access is confirmed
    if(!hasAccess && course){
        return null;
    }

    const chapters = course?.courseOutput?.chapters || [];
    const hasNextChapter = selectedChapterIndex !== null && selectedChapterIndex < chapters.length - 1;

    const ChapterList = () => (
        <div>
            <div className='flex items-center gap-2 bg-primary p-4'>
                <HiArrowLeft className='text-white cursor-pointer flex-none' onClick={()=>router.replace('/dashboard')} />
                <h2 className='font-medium text-lg text-white cursor-pointer line-clamp-1'
                    onClick={()=>router.replace('/course/'+params?.courseId)}>
                    {course?.courseOutput?.course_name || course?.name}
                </h2>
                {/* Close button - mobile only */}
                <HiXMark className='text-white cursor-pointer flex-none ml-auto md:hidden text-xl'
                    onClick={()=>setMobileMenuOpen(false)} />
            </div>
            <div>
                {course?.courseOutput?.chapters?.map((chapter,index)=>(
                    <div key={index} 
                        className={`cursor-pointer ${selectedChapter?.chapter_name==chapter?.chapter_name&&'bg-purple-100'}
                        ${!unlockedChapters.includes(index) && 'opacity-50 cursor-not-allowed'}`}
                        onClick={()=>{
                            if(unlockedChapters.includes(index)){
                                setSelectedChapter(chapter);
                                setSelectedChapterIndex(index);
                                GetSelectedChapterContent(index);
                                setMobileMenuOpen(false);
                            }
                        }}>
                        <div className='flex items-center justify-between pr-3'>
                            <ChapterListCard 
                                chapter={chapter} 
                                index={index}
                                isCompleted={isChapterCompleted(index)}
                            />
                            {!unlockedChapters.includes(index) && 
                                <HiLockClosed className='text-gray-400 flex-none'/>
                            }
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

    return (
    <div>
        {/* Desktop sidebar */}
        <div className='md:w-64 hidden md:block h-screen border-r fixed top-0 left-0 shadow-sm overflow-y-auto'>
            <ChapterList />
        </div>

        {/* Mobile top bar */}
        <div className='md:hidden fixed top-0 left-0 right-0 bg-primary p-4 flex items-center gap-2 z-40'>
            <HiArrowLeft className='text-white cursor-pointer flex-none' onClick={()=>router.replace('/dashboard')} />
            <h2 className='font-medium text-white line-clamp-1 flex-1'
                onClick={()=>router.replace('/course/'+params?.courseId)}>
                {course?.courseOutput?.course_name || course?.name}
            </h2>
            <HiBars3 className='text-white cursor-pointer flex-none text-2xl'
                onClick={()=>setMobileMenuOpen(true)} />
        </div>

        {/* Mobile chapter drawer */}
        {mobileMenuOpen && (
            <div className='md:hidden fixed inset-0 z-50 bg-white overflow-y-auto'>
                <ChapterList />
            </div>
        )}

        {/* Content */}
        <div className='md:ml-64 pt-16 md:pt-0'>
            {!selectedChapter ?
                <div className='flex flex-col items-center justify-center min-h-screen text-center p-5 md:p-10'>
                    <img 
                        src={course?.courseBanner || '/online-lesson.png'} 
                        alt={course?.courseOutput?.course_name}
                        className='w-full max-w-lg h-[200px] md:h-[250px] object-cover rounded-xl mb-6'
                    />
                    <h2 className='font-bold text-2xl md:text-3xl text-primary'>{course?.courseOutput?.course_name}</h2>
                    <p className='text-gray-500 mt-3 text-base md:text-lg'>{course?.courseOutput?.description}</p>
                    <p className='mt-6 text-gray-400 border p-3 rounded-lg text-sm'>Select a chapter from the {' '}
                        <span className='md:inline hidden'>left panel</span>
                        <span className='md:hidden inline'>menu above</span>
                        {' '}to start learning</p>
                </div>
            :
                <ChapterContent 
                    chapter={selectedChapter}
                    content={chapterContent}
                    onQuizPass={onQuizPass}
                    userEmail={user?.primaryEmailAddress?.emailAddress}
                    courseId={params?.courseId}
                    onNextChapter={onNextChapter}
                    hasNextChapter={hasNextChapter}
                />
            }
        </div>
    </div>
  )
}

export default CourseStart