"use client"
import React from 'react'
import SideBar from './_components/SideBar'
import Header from './_components/header_2'
import { UserCourseListContext } from '../_context/UserCourseListContext';
import { useUser } from '@clerk/nextjs';
import { db } from '@/configs/db';
import { User } from '@/configs/schema';
import { eq } from 'drizzle-orm';

function DashboardLayout({children}) {

  const [userCourseList,setUserCourseList]=React.useState([]);
  const {user} = useUser();

  React.useEffect(()=>{
    if(user){
      CheckAndSeedUser();
    }
  },[user])

  const CheckAndSeedUser = async () => {
    const existing = await db.select().from(User).where(eq(User.email, user?.primaryEmailAddress?.emailAddress));
    if(existing.length === 0){
      await db.insert(User).values({
        name: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
        imageUrl: user?.imageUrl,
        credits: 5
      });
    }
  }

  return (
    <UserCourseListContext.Provider value={{userCourseList,setUserCourseList}}>
    <div className='flex'>
        <div className='w-64 hidden md:block'>
            <SideBar />
        </div>
        <div className='flex-1'>
            <Header />
            <div className='p-10'>
              {children}
            </div>
        </div>
    </div>
    </UserCourseListContext.Provider>
  )
}

export default DashboardLayout