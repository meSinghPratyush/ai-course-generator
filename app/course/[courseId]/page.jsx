"use client"
import { db } from '@/configs/db'
import { CourseList } from '@/configs/schema'
import { eq } from 'drizzle-orm'
import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import CourseBasicInfo from '@/app/create-course/[courseId]/_components/CourseBasicInfo'
import Header from '@/app/dashboard/_components/header_2'
import CourseDetail from '@/app/create-course/[courseId]/_components/CourseDetail'
import ChapterList from '@/app/create-course/[courseId]/_components/ChapterList'


function Course() {
  
  const params = useParams();
  const [course,setCourse]=React.useState(null);
  const [loading,setLoading]=React.useState(true);

  useEffect(()=>{
    params&&GetCourse();
  },[params])

  const GetCourse=async()=>{
    const result=await db.select().from(CourseList).where(eq(CourseList?.courseId,params?.courseId))
    setCourse(result[0])
    setLoading(false);
    console.log(result)
  }

  return (
    <div>
        <Header/>
        <div className='px-10 p-10 md:px-20 lg:px-44'>
            {loading?
              <div className='animate-pulse'>
                <div className='bg-slate-200 rounded-lg h-[300px] w-full'></div>
                <div className='bg-slate-200 rounded-lg h-[100px] w-full mt-5'></div>
                <div className='bg-slate-200 rounded-lg h-[300px] w-full mt-5'></div>
              </div>
            :
              <>
                <CourseBasicInfo course={course} edit={false} />
                <CourseDetail course={course}/>
                <ChapterList course={course} edit={false}/>
              </>
            }
        </div>
        
    </div>
  )
}

export default Course