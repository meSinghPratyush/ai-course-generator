"use client"
import { db } from '@/configs/db'
import { CourseList } from '@/configs/schema';
import React, { useEffect } from 'react'
import CourseCard from '../_components/CourseCard';
import { Button } from '@/components/ui/button';

function Explore() {

  const [courseList,setCourseList]=React.useState([]);
  const [pageIndex,setPageIndex]=React.useState(0);
  useEffect(()=>{
    GetAllCourse();
  },[pageIndex])

  const GetAllCourse=async()=>{
    const result=await db.select().from(CourseList).limit(9).offset(pageIndex*9);
    setCourseList(result);
    console.log(result);
  }
  return (
    <div>
      <h2 className='font-bold text-3xl'>Explore More Projects</h2>
      <p>Explore more projects build with AI by other users.</p>
      <div className='grid grid-cols-2 lg:grid-cols-3 gap-5 mt-5'>
        {courseList?.map((course,index)=>(
          <CourseCard course={course} key={index} displayUser={true}/>
        ))}
      </div>
      <div className='flex justify-between mt-5'>
        {pageIndex!=0&&<Button onClick={()=>setPageIndex(pageIndex-1)}>Previous Page</Button>}
        <Button onClick={()=>setPageIndex(pageIndex+1)}>Next Page</Button>
      </div>  

    </div>
  )
}

export default Explore