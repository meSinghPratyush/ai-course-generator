"use client"
import React, { useEffect } from 'react'
import { CourseList } from '@/configs/schema';
import { and, eq } from 'drizzle-orm';
import { db } from '@/configs/db';
import { useUser } from '@clerk/nextjs';
import { useParams } from "next/navigation";
import CourseBasicInfo from './_components/CourseBasicInfo';
import CourseDetail from './_components/CourseDetail';
import ChapterList from './_components/ChapterList';

function CourseLayout() {
  const {user}=useUser();
   const params = useParams();
   const [course,setCourse]=React.useState([]);
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
  return (
    <div className='mt-10 px-7 md:px-20 lg:px-44'>
      <h2 className='font-bold text-center text-2xl'>Course Layout</h2>

      {/* Basic Info */}

        <CourseBasicInfo course={course}/>

      {/* Course Detail */ }
        <CourseDetail course={course}/>

      {/* List of Lesson */}
        <ChapterList course={course}/>

    </div>
  )
}

export default CourseLayout