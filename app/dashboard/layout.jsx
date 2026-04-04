"use client"
import React from 'react'
import SideBar from './_components/SideBar'
import Header from './_components/header_2'
import { User } from 'lucide-react'
import { UserCourseListContext } from '../_context/UserCourseListContext';

function DashboardLayout({children}) {

  const [userCourseList,setUserCourseList]=React.useState([]);
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