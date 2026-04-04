
import Image from 'next/image'
import React from 'react'
import { HiBookOpen } from "react-icons/hi2";
import { HiDotsVertical } from "react-icons/hi";
import { Button } from "@/components/ui/button"
import DropdownOption from './DropdownOption';
import { db } from '@/configs/db';
import { CourseList, ChapterContent } from '@/configs/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';


function CourseCard({course,refreshData}) {

    const handleOnDelete=async()=>{
        await db.delete(ChapterContent).where(eq(ChapterContent.courseId, course?.courseId))
        const resp=await db.delete(CourseList).where(eq(CourseList.id,course?.id))
        .returning({id:CourseList.id})
        if(resp){
            refreshData();
        }
    }
  return (

    <div className='shadow-md rounded-lg border p-2 hover:scale-105 transition-all cursor-pointer mt-4'>
        <Link href={'/course/'+course?.courseId}>
            <Image src={course?.courseBanner} width={300} height={200} alt={course?.name} className='w-full h-[200px] object-cover rounded-lg'/>
        </Link>
        <div className='p-2 h-[100px] flex flex-col justify-between'>
            <div className='flex justify-between items-center'>
                <h2 className='font-medium text-lg line-clamp-1 flex-1' title={course?.courseOutput?.course_name}>{course?.courseOutput?.course_name}</h2>
                
                <DropdownOption
                handleOnDelete={()=>handleOnDelete()}
                ><HiDotsVertical className='flex-none ml-1'/></DropdownOption>
            </div>
            <p className='text-sm text-gray-400 my-1'>{course?.category}</p>
            <div className='flex items-center justify-between'>
                <h2 className='flex gap-2 items-center p-1 bg-purple-50 text-primary text-sm'><HiBookOpen />{course?.courseOutput?.chapters?.length} Chapters</h2>
                <h2 className='text-sm bg-purple-50 text-primary p-1 rounded-sm'>{course?.courseOutput?.level} Level</h2>
            </div>
        </div>
    </div>
  )
}

export default CourseCard