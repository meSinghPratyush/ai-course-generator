import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'

function Header() {
  return (
    <div className='flex justify-between items-center p-5 shadow-sm'>
        <Link href={'/dashboard'}>
            <Image src={'/favicon.svg'} alt='Logo' width={40} height={40} />
        </Link>
        <UserButton />
    </div>
  )
}

export default Header