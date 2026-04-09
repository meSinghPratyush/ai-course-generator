"use client"
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function Header() {
  const path = usePathname();
  const isDashboard = path?.startsWith('/dashboard');

  return (
    <div className='h-[70px] flex justify-between items-center px-5 shadow-sm'>
        {!isDashboard &&
            <Link href={'/dashboard'}>
                <Image src={'/favicon.svg'} alt='Logo' width={110} height={25} className='hover:opacity-80 transition-opacity duration-200 object-contain'/>
            </Link>
        }
        <div className={isDashboard ? 'ml-auto' : ''}>
            <UserButton />
        </div>
    </div>
  )
}

export default Header