"use client"
import { db } from '@/configs/db'
import { CourseList, CoursePurchase, User } from '@/configs/schema';
import React, { useEffect } from 'react'
import CourseCard from '../_components/CourseCard';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { eq, and } from 'drizzle-orm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function Explore() {

  const { user } = useUser();
  const [courseList, setCourseList] = React.useState([]);
  const [purchasedCourses, setPurchasedCourses] = React.useState([]);
  const [pageIndex, setPageIndex] = React.useState(0);
  const [selectedCourse, setSelectedCourse] = React.useState(null);
  const [showBuyDialog, setShowBuyDialog] = React.useState(false);
  const [showNoCreditsDialog, setShowNoCreditsDialog] = React.useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  useEffect(()=>{
    GetAllCourse();
  },[pageIndex])

  useEffect(()=>{
    if(user) GetPurchasedCourses();
  },[user])

  const GetAllCourse = async () => {
    setLoading(true);
    const result = await db.select().from(CourseList)
      .where(eq(CourseList.publish, true))
      .limit(9).offset(pageIndex*9);
    setCourseList(result);
    setLoading(false);
  }

  const GetPurchasedCourses = async () => {
    const result = await db.select().from(CoursePurchase)
      .where(eq(CoursePurchase.buyerEmail, user?.primaryEmailAddress?.emailAddress));
    setPurchasedCourses(result.map(r => r.courseId));
  }

  const onBuyClick = (course) => {
    setSelectedCourse(course);
    setShowBuyDialog(true);
  }

  const onConfirmPurchase = async () => {
    const buyerEmail = user?.primaryEmailAddress?.emailAddress;
    const creatorEmail = selectedCourse?.createdBy;

    // Check buyer credits
    const buyerResult = await db.select().from(User).where(eq(User.email, buyerEmail));
    const buyerCredits = buyerResult[0]?.credits || 0;

    if(buyerCredits <= 0){
      setShowBuyDialog(false);
      setShowNoCreditsDialog(true);
      return;
    }

    // Deduct 1 credit from buyer
    await db.update(User)
      .set({ credits: buyerCredits - 1 })
      .where(eq(User.email, buyerEmail));

    // Add 1 credit to creator
    const creatorResult = await db.select().from(User).where(eq(User.email, creatorEmail));
    const creatorCredits = creatorResult[0]?.credits || 0;
    await db.update(User)
      .set({ credits: creatorCredits + 1 })
      .where(eq(User.email, creatorEmail));

    // Record the purchase
    await db.insert(CoursePurchase).values({
      courseId: selectedCourse?.courseId,
      buyerEmail: buyerEmail,
      creatorEmail: creatorEmail,
    });

    // Update local state so button changes immediately
    setPurchasedCourses(prev => [...prev, selectedCourse?.courseId]);
    setShowBuyDialog(false);
    setShowSuccessDialog(true);
  }

  const isOwnCourse = (course) => {
    return course?.createdBy === user?.primaryEmailAddress?.emailAddress;
  }

  const hasPurchased = (course) => {
    return purchasedCourses.includes(course?.courseId);
  }

  return (
    <div>
      <h2 className='font-bold text-3xl'>Explore More Courses</h2>
      <p>Explore more courses build with AI by other users.</p>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5'>
        {loading ?
          [1,2,3,4,5,6].map((item, index)=>(
            <div key={index} className='w-full mt-5 bg-slate-200 animate-pulse rounded-lg h-[270px]'></div>
          ))
        :
          courseList?.map((course, index)=>(
            <div key={index} className='relative'>
              <CourseCard course={course} displayUser={true}/>
              {isOwnCourse(course) ? (
                <div className='mt-2'>
                  <Button className='w-full' variant='outline'
                    onClick={()=>window.location.href='/course/'+course?.courseId}>
                    View My Course
                  </Button>
                </div>
              ) : hasPurchased(course) ? (
                <div className='mt-2'>
                  <Button className='w-full'
                    onClick={()=>window.location.href='/course/'+course?.courseId}>
                    Access Course
                  </Button>
                </div>
              ) : (
                <div className='mt-2'>
                  <Button className='w-full' variant='outline'
                    onClick={()=>onBuyClick(course)}>
                    Buy Course - 1 Credit
                  </Button>
                </div>
              )}
            </div>
          ))
        }
      </div>
      <div className='flex justify-between mt-5'>
        {pageIndex!=0&&<Button onClick={()=>setPageIndex(pageIndex-1)}>Previous Page</Button>}
        <Button onClick={()=>setPageIndex(pageIndex+1)}>Next Page</Button>
      </div>

      {/* Buy confirmation dialog */}
      <AlertDialog open={showBuyDialog} onOpenChange={setShowBuyDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Purchase this course?</AlertDialogTitle>
            <AlertDialogDescription>
              This will deduct 1 credit from your account to unlock
              <span className='font-medium text-black'> {selectedCourse?.courseOutput?.course_name}</span>.
              The credit will be added to the course creator's account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmPurchase}>
              Yes, Buy for 1 Credit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* No credits dialog */}
      <AlertDialog open={showNoCreditsDialog} onOpenChange={setShowNoCreditsDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Not enough credits</AlertDialogTitle>
            <AlertDialogDescription>
              You don't have enough credits to purchase this course. Buy more credits to continue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={()=>window.location.href='/dashboard/upgrade'}>
              Buy Credits
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Purchase Successful!</AlertDialogTitle>
            <AlertDialogDescription>
              You now have full access to
              <span className='font-medium text-black'> {selectedCourse?.courseOutput?.course_name}</span>.
              It has been added to your courses on the dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={()=>setShowSuccessDialog(false)}>
              Continue Exploring
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default Explore