"use client"
import { db } from '@/configs/db'
import { CourseList, CoursePurchase } from '@/configs/schema'
import { eq, and } from 'drizzle-orm'
import React, { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import CourseBasicInfo from '@/app/_shared_components/CourseBasicInfo'
import Header from '@/app/dashboard/_components/header_2'
import CourseDetail from '@/app/_shared_components/CourseDetail'
import ChapterList from '@/app/_shared_components/ChapterList'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'


function Course() {
  
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [course, setCourse] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [hasAccess, setHasAccess] = React.useState(false);

  useEffect(()=>{
    params && GetCourse();
  },[params])

  useEffect(()=>{
    if(course && user) CheckAccess();
  },[course, user])

  const GetCourse = async () => {
    const result = await db.select().from(CourseList).where(eq(CourseList?.courseId, params?.courseId))
    setCourse(result[0])
    setLoading(false);
  }

  const CheckAccess = async () => {
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

    setHasAccess(result.length > 0);
  }

  return (
    <div>
        <Header/>
        <div className='px-10 p-10 md:px-20 lg:px-44'>
            {loading ?
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

                {/* Access gate --- show start button only if user has access */}
                {!hasAccess &&
                  <div className='p-10 border rounded-xl mt-5 text-center'>
                    <h2 className='font-bold text-xl'>Purchase this course to access all chapters</h2>
                    <p className='text-gray-500 mt-2'>This course costs 1 credit to unlock</p>
                    <Button className='mt-5' onClick={()=>router.replace('/dashboard/explore')}>
                      Go to Explore to Buy
                    </Button>
                  </div>
                }
              </>
            }
        </div>
    </div>
  )
}

export default Course