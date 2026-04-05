"use client"
import { UserCourseListContext } from '@/app/_context/UserCourseListContext';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs'
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react'
import { db } from '@/configs/db';
import { User } from '@/configs/schema';
import { eq } from 'drizzle-orm';

function AddCourse() {
    const {user} = useUser();
    const {userCourseList, setUserCourseList} = useContext(UserCourseListContext);
    const [userCredits, setUserCredits] = useState(null);

    useEffect(() => {
        if(user) GetUserCredits();
    }, [user])

    const GetUserCredits = async () => {
        const result = await db.select().from(User).where(eq(User.email, user?.primaryEmailAddress?.emailAddress));
        setUserCredits(result[0]?.credits);
    }

    return (
        <div className='flex items-center justify-between'>
            <div>
                <h2 className='text-3xl'>Hello, 
                <span className='font-bold'>{user?.fullName}!</span></h2>
                <p className='text-sm text-gray-500'>Create new course with AI share and earn from it.</p>
            </div>
            <Link href={userCredits <= 0 ? '/dashboard/upgrade' : '/create-course'}>
                <Button disabled={userCredits === null}>
                    {userCredits <= 0 ? '⚡ Buy Credits' : '+ Create Course'}
                </Button>
            </Link>
        </div>
    )
}

export default AddCourse