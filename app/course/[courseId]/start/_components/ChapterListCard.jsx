import React from 'react'
import { HiOutlineClock } from "react-icons/hi";
function ChapterListCard({chapter,index}) {
  return (
    <div className='grid grid-cols-5 p-4 items-center border-b cursor-pointer hover:bg-purple-100'>
        <div>
            <h2 className='p-1 bg-primary w-8 h-8 text-center text-white rounded-full'>{index+1}</h2>
        </div>
        <div className='col-span-4'>
            <h2 className='font-medium'>{chapter?.chapter_name}</h2>
            <h2 className='flex items-center gap-2 text-sm text-primary'><HiOutlineClock />{chapter?.duration}</h2>
        </div>
    </div>
  )
}

export default ChapterListCard