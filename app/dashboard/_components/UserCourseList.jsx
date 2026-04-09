"use client"
import { db } from '@/configs/db'
import { CourseList, CoursePurchase } from '@/configs/schema'
import { useUser } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'
import React, { useEffect } from 'react'
import CourseCard from './CourseCard'
import { UserCourseListContext } from '@/app/_context/UserCourseListContext'
import { HiOutlineBookOpen } from 'react-icons/hi2'
import Link from 'next/link'

function UserCourseList() {
  
  const [courseList, setCourseList] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const {userCourseList, setUserCourseList} = React.useContext(UserCourseListContext);
  const {user} = useUser();

  useEffect(()=>{
    user && getUserCourses();
  },[user])

  const getUserCourses = async () => {
    setLoading(true);
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
    setLoading(false);
  }

  return (
    <div className='mt-10'>
      <h2 className='font-medium text-xl'>My Courses</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 mt-3'>
        {loading ? (
          [1,2,3,4,5].map((item, index) => (
            <div key={index} className='w-full mt-5 bg-slate-200 animate-pulse rounded-lg h-[270px]'></div>
          ))
        ) : courseList?.length > 0 ? (
          courseList?.map((course, index) => (
            <CourseCard course={course} key={index} refreshData={()=>getUserCourses()} />
          ))
        ) : (
          <div className='col-span-full flex flex-col items-center justify-center py-20 text-center'>
            <div className='bg-purple-50 p-6 rounded-full mb-4'>
              <HiOutlineBookOpen className='text-5xl text-purple-400' />
            </div>
            <h3 className='font-semibold text-lg text-gray-700'>No courses yet</h3>
            <p className='text-gray-400 text-sm mt-1'>Create a course to view it here.</p>
            <Link href='/create-course'>
              <button className='mt-5 px-6 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition-all duration-200'>
                + Create Your First Course
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserCourseList