"use client"
import { db } from '@/configs/db'
import { CourseList, CoursePurchase } from '@/configs/schema'
import { useUser } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'
import React, { useEffect } from 'react'
import CourseCard from './CourseCard'
import { UserCourseListContext } from '@/app/_context/UserCourseListContext'

function UserCourseList() {
  
  const [courseList,setCourseList]=React.useState([]);
  const {userCourseList,setUserCourseList}=React.useContext(UserCourseListContext);
  const {user}=useUser();

  useEffect(()=>{
    user && getUserCourses();
  },[user])

  const getUserCourses=async()=>{
    // Get courses created by user
    const created = await db.select().from(CourseList)
      .where(eq(CourseList.createdBy, user?.primaryEmailAddress?.emailAddress));

    // Get courses purchased by user
    const purchases = await db.select().from(CoursePurchase)
      .where(eq(CoursePurchase.buyerEmail, user?.primaryEmailAddress?.emailAddress));

    // Fetch full course details for each purchased course
    const purchasedCourses = await Promise.all(
      purchases.map(p => 
        db.select().from(CourseList).where(eq(CourseList.courseId, p.courseId))
      )
    );

    // Flatten and merge, avoid duplicates
    const purchasedList = purchasedCourses.flat();
    const allCourseIds = new Set(created.map(c => c.courseId));
    const uniquePurchased = purchasedList.filter(c => !allCourseIds.has(c.courseId));

    const combined = [...created, ...uniquePurchased];
    setCourseList(combined);
    setUserCourseList(created); // context only tracks created courses for credit limit
  }

  return (
    <div className='mt-10'>
      <h2 className='font-medium text-xl'>My Courses</h2>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 mt-3'>
        {courseList?.length>0 ? courseList?.map((course,index)=>(
          <CourseCard course={course} key={index} refreshData={()=>getUserCourses()} />
        ))
        :
          [1,2,3,4,5].map((item,index)=>(
            <div key={index} className='w-full mt-5 bg-slate-200 animate-pulse rounded-lg h-[270px]'></div>
          ))
        }
      </div>
    </div>
  )
}

export default UserCourseList