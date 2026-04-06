"use client"
import { db } from '@/configs/db';
import { CourseList } from '@/configs/schema';
import { useUser } from '@clerk/nextjs';
import { and, eq } from 'drizzle-orm';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import CourseBasicInfo from '../_components/CourseBasicInfo';
import { FaRegCopy } from "react-icons/fa6";
import { Button } from '@/components/ui/button';

function FinshScreen() {
  
    const {user}=useUser();
    const params = useParams();
    const [course,setCourse]=React.useState([]);
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
  
    return (
    <div className='px-10 md:px-20 lg:px-44 my-7'>
        <h2 className='text-center font-bold text-2xl my-3 text-primary'>Congrats! Your Course is Ready 🎉</h2>

        <CourseBasicInfo course={course} refreshData={()=>console.log()}/>

        <h2 className='mt-3 text-center'>Course URL</h2>
        <h2 className='text-center text-gray-400 border p-2 rounded-md flex gap-5 items-center'>
            {process.env.NEXT_PUBLIC_HOST_NAME}/View/{course?.courseId}
            <FaRegCopy className='h-6 w-6 cursor-pointer' onClick={async()=>await navigator.clipboard.writeText(process.env.NEXT_PUBLIC_HOST_NAME+"/View/"+course?.courseId)}/>
        </h2>

        <Button className='w-full mt-5' onClick={()=>router.replace('/course/'+course?.courseId+'/start')}>
            Start Course
        </Button>

    </div>
  )
}

export default FinshScreen