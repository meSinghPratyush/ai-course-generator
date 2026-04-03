import { Button } from '@/components/ui/button';
import Image from 'next/image'
import React, { useState } from 'react'
import { MdHealthAndSafety } from "react-icons/md";
import EditCourseBasicInfo from './EditCourseBasicInfo';

function CourseBasicInfo({course,refreshData}) {
  const [selectedFile, setSelectedFile] = useState();
  const onFileSelected = (event) => {
    const file = event.target.files[0];
    setSelectedFile(URL.createObjectURL(file));
    const fileName=Date.now()+'.jpg';
    const storageRef=ref(storage,fileName);
  }
  
  return (
    <div className='p-10 border rounded-xl shadow-sm mt-5'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div>

                {/* Use AI standardized course name */}
                <h2 className='font-bold text-3xl'>
                  {course?.courseOutput?.course_name || course?.name} <EditCourseBasicInfo course={course} refreshData={()=>refreshData(true)} /> 
                </h2>

                {/* Already correct */}
                <h2 className='text-sm text-gray-400 mt-3'>
                  {course?.courseOutput?.description}
                </h2>

                <h2 className='font-medium text-md mt-2 flex gap-2 items-center text-primary'>
                  <MdHealthAndSafety />{course?.category}
                </h2>

                <Button className="w-full">Start</Button>
            </div>

            <div>
                <label htmlFor='upload-image'>
                  <Image 
                    src={selectedFile?selectedFile:'/online-lesson.png'} 
                    width={300} 
                    height={300} 
                    alt='lesson'
                    className="w-full rounded-xl h-[250px] cursor-pointer  object-contain" 
                  />
                  <input type="file" id="upload-image" className='opacity-0' onChange={onFileSelected}/>
                </label>
            </div>
        </div>
    </div>
  )
}

export default CourseBasicInfo