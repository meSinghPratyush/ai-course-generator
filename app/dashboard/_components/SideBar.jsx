"use client"
import React, { useContext, useState, useEffect } from 'react'
import Image from 'next/image'
import { HiCubeTransparent, HiMiniArrowLeftEndOnRectangle } from "react-icons/hi2";
import { GrUpgrade } from "react-icons/gr";
import { IoHomeOutline } from "react-icons/io5";
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserCourseListContext } from '@/app/_context/UserCourseListContext';
import { useClerk, useUser } from '@clerk/nextjs';
import { db } from '@/configs/db';
import { User } from '@/configs/schema';
import { eq } from 'drizzle-orm';
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

const Menu = [
  { id: 1, name: 'Home',    icon: <IoHomeOutline />,                    path: '/dashboard' },
  { id: 2, name: 'Explore', icon: <HiCubeTransparent />,                path: '/dashboard/explore' },
  { id: 3, name: 'Upgrade', icon: <GrUpgrade />,                        path: '/dashboard/upgrade' },
  { id: 4, name: 'Logout',  icon: <HiMiniArrowLeftEndOnRectangle />,    path: null },
]

function SideBar() {
  const { userCourseList } = useContext(UserCourseListContext);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [userCredits, setUserCredits] = useState(0);
  const { signOut } = useClerk();
  const { user } = useUser();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => { if (user) GetUserCredits(); }, [user]);

  useEffect(() => {
    const handleFocus = () => { if (user) GetUserCredits(); };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => { if (user) GetUserCredits(); }, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const GetUserCredits = async () => {
    const result = await db.select().from(User).where(eq(User.email, user?.primaryEmailAddress?.emailAddress));
    setUserCredits(result[0]?.credits || 0);
  };

  return (
    <div className='fixed h-full md:w-64 flex flex-col bg-white border-r border-gray-100 shadow-sm'>

      {/* Logo */}
      <div className='px-6 pt-6 pb-4'>
        <Link href='/dashboard'>
          <Image src='/logo.svg' alt='Logo' width={200} height={55} className='hover:opacity-80 transition-opacity duration-200 object-contain' />
        </Link>
      </div>

      {/* Divider */}
      <div className='mx-4 h-px bg-gray-100' />

      {/* Nav */}
      <nav className='flex-1 px-3 pt-4'>
        <ul className='space-y-1'>
          {Menu.map((item) => {
            const isActive = item.path && path === item.path;
            const isLogout = item.name === 'Logout';

            const baseClass = `
              flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer
              text-sm font-medium transition-all duration-200 select-none
              ${isActive
                ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                : isLogout
                  ? 'text-gray-400 hover:bg-rose-50 hover:text-rose-500'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }
            `;

            const content = (
              <div className={baseClass}>
                <span className={`text-lg transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-white' : ''}`}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
                {isActive && (
                  <span className='ml-auto w-1.5 h-1.5 rounded-full bg-white/70' />
                )}
              </div>
            );

            return (
              <li key={item.id} className='group'>
                {isLogout
                  ? <div onClick={() => setShowLogoutDialog(true)}>{content}</div>
                  : <Link href={item.path}>{content}</Link>
                }
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Credits Card */}
      <div className='px-4 pb-6'>
        <div className='rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 p-4'>
          <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2'>Credits Available</p>
          <p className='text-3xl font-bold text-purple-600'>{userCredits}</p>

          {userCredits <= 3 && (
            <p className='text-xs text-rose-500 font-medium mt-2'>
              ⚠ Running low! Buy more credits.
            </p>
          )}

          <Link href='/dashboard/upgrade'>
            <button className='mt-3 w-full text-xs font-semibold text-purple-600 bg-white border border-purple-200 hover:bg-purple-600 hover:text-white hover:border-purple-600 rounded-lg py-1.5 transition-all duration-200'>
              Buy More Credits
            </button>
          </Link>
        </div>
      </div>

      {/* Logout Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
            <AlertDialogDescription>You will be redirected to the home page.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => signOut(() => router.replace('/'))}>
              Yes, Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default SideBar;