import React from 'react'
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

function Header() {
  return (
    <div className='flex justify-between p-5 shadow-md'>
        <div className='h-[70px] flex items-center px-5'>
            <Link href={'/dashboard'}>
                <Image src={'/logo.svg'} alt='Logo' width={200} height={55} className='object-contain'/>
            </Link>
        </div>
        <Link href={'/dashboard'}>
            <Button>Get Started</Button>
        </Link>
    </div>
  )
}

export default Header