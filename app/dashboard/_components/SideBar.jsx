"use client"
import React, { useContext, useState } from 'react'
import Image from 'next/image'
import { HiOutlineHome,HiCubeTransparent,HiCloudArrowUp,HiMiniArrowLeftEndOnRectangle } from "react-icons/hi2";
import { GrUpgrade } from "react-icons/gr";
import { IoHomeOutline } from "react-icons/io5";
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { UserCourseListContext } from '@/app/_context/UserCourseListContext';
import { useClerk } from '@clerk/nextjs';
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

function SideBar() {
  const {userCourseList,setUserCourseList}=useContext(UserCourseListContext);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { signOut } = useClerk();
  const router = useRouter();

  const Menu=[
    {
      id:1,
      name:'Home',
      icon:<IoHomeOutline />,
      path:'/dashboard'
    },
    {
      id:2,
      name:'Explore',
      icon:<HiCubeTransparent />,
      path:'/dashboard/explore'
    },
    {
      id:3,
      name:'Upgrade',
      icon:<GrUpgrade />,
      path:'/dashboard/upgrade'
    },
    {
      id:4,
      name:'Logout',
      icon:<HiMiniArrowLeftEndOnRectangle />,
      path:'/dashboard/logout'
    }
  ]
  const path=usePathname()

  return (
    <div className='fixed h-full md:w-64 p-5 shadow-md'>
        <Link href={'/dashboard'}>
            <Image src={'/logo.svg'} alt='Logo' width={140} height={40} />
        </Link>
        <hr className='my-5'/>

        <ul>
          {Menu.map((item,index)=>(
            <li key={item.id}>
              {item.name === 'Logout' ?
                <div onClick={()=>setShowLogoutDialog(true)}
                  className={`flex items-center gap-2 text-gray-600
                  p-3 cursor-pointer hover:bg-gray-100 hover:text-black rounded-lg mb-2`}>
                  <div className='text-2xl'>{item.icon}</div>
                  <h2>{item.name}</h2>
                </div>
              :
                <Link href={item.path}>
                  <div className={`flex items-center gap-2 text-gray-600
                  p-3 cursor-pointer hover:bg-gray-100 hover:text-black rounded-lg mb-2
                  ${item.path===path&& 'bg-gray-200 text-black font-semibold'}`}>
                    <div className='text-2xl'>{item.icon}</div>
                    <h2>{item.name}</h2>
                  </div>
                </Link>
              }
            </li>  
          ))}
        </ul>

        <div className='absolute bottom-10 w-[80%]'>
          <Progress value={(userCourseList?.length/5)*100} />
          <h2 className='text-sm my-2'>{userCourseList?.length} Out of 5 Course created</h2>
          <h2 className='text-xs text-gray-500'>Upgrade for unlimited course creation.</h2>
        </div>

        <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
              <AlertDialogDescription>
                You will be redirected to the home page.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={()=>signOut(()=>router.replace('/'))}>
                Yes, Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </div>
  )
}

export default SideBar