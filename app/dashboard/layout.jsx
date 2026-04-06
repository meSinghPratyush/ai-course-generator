"use client"
import React from 'react'
import SideBar from './_components/SideBar'
import Header from './_components/header_2'
import { UserCourseListContext } from '../_context/UserCourseListContext';
import { useUser } from '@clerk/nextjs';
import { db } from '@/configs/db';
import { User } from '@/configs/schema';
import { eq } from 'drizzle-orm';
import { IoHomeOutline } from 'react-icons/io5';
import { HiCubeTransparent } from 'react-icons/hi2';
import { GrUpgrade } from 'react-icons/gr';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function DashboardLayout({children}) {

  const [userCourseList,setUserCourseList]=React.useState([]);
  const {user} = useUser();
  const path = usePathname();

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

  const BottomMenu = [
    { id: 1, name: 'Home', icon: <IoHomeOutline />, path: '/dashboard' },
    { id: 2, name: 'Explore', icon: <HiCubeTransparent />, path: '/dashboard/explore' },
    { id: 3, name: 'Upgrade', icon: <GrUpgrade />, path: '/dashboard/upgrade' },
  ]

  return (
    <UserCourseListContext.Provider value={{userCourseList,setUserCourseList}}>
    <div className='flex'>
        {/* Sidebar - desktop only */}
        <div className='w-64 hidden md:block'>
            <SideBar />
        </div>

        {/* Main content */}
        <div className='flex-1 pb-20 md:pb-0'>
            <Header />
            <div className='p-5 md:p-10'>
              {children}
            </div>
        </div>

        {/* Bottom navigation - mobile only */}
        <div className='fixed bottom-0 left-0 right-0 bg-white border-t shadow-md flex justify-around items-center p-3 md:hidden z-50'>
          {BottomMenu.map((item) => (
            <Link href={item.path} key={item.id}>
              <div className={`flex flex-col items-center gap-1 text-gray-500 
                ${item.path === path && 'text-primary font-semibold'}`}>
                <div className='text-2xl'>{item.icon}</div>
                <span className='text-xs'>{item.name}</span>
              </div>
            </Link>
          ))}
        </div>
    </div>
    </UserCourseListContext.Provider>
  )
}

export default DashboardLayout