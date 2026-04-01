import { Button } from '@/components/ui/button';
import Image from 'next/image'
import React from 'react'
import { MdHealthAndSafety } from "react-icons/md";
function CourseBasicInfo({course}) {
  return (
    <div className='p-10 border rounded-xl shadow-sm mt-5'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div>
                <h2 className='font-bold text-3xl'>{course?.name}</h2>
                <h2 className='text-sm text-gray-400 mt-3'>{course?.courseOutput?.description}</h2>
                <h2 className='font-medium text-md mt-2 flex gap-2 items-center text-primary'><MdHealthAndSafety />{course?.category}</h2>
                <Button className="w-full">Start</Button>
            </div>
            <div>
                <Image src={'/online-lesson.png'} width={100} height={100} className='w-full rounded-xl h-[250px]' alt='lesson'/>
            </div>
        </div>
        
    </div>
  )
}

export default CourseBasicInfo