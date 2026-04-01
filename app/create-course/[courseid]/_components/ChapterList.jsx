import React from 'react'
import { useState } from 'react';
import { HiOutlineClock } from "react-icons/hi2";
import { HiOutlineCheckBadge } from "react-icons/hi2";
function ChapterList({course}) {
    const [expanded, setExpanded] = useState(null);
  return (
    <div className='mt-3'>
        <h2 className='font-medium text-xl'>Chapters</h2>
        <div className='mt-2'>
            {course?.courseOutput?.Chapters.map((chapter,index)=>(
                <div className='border p-5 rounded-lg mb-2 flex items-center justify-between' key={index}>
                    <div className='flex gap-5 items-center'>
                        <h2 className='bg-primary flex-none h-10 w-10 text-white rounded-full text-center p-2'>{index+1}</h2>
                        <div>
                            <h2 className='font-medium text-lg'>{chapter.chapter_name}</h2>
                            <p className='text-sm text-gray-500'>
                                {expanded === index ? chapter.about : `${chapter.about?.slice(0, 100)}...`}
                            </p>
                            <button onClick={() => setExpanded(expanded === index ? null : index)} className="text-primary text-sm">
                                {expanded === index ? "Show less" : "Read more"}
                            </button>
                            <p className='flex gap-2 text-primary items-center'><HiOutlineClock/>{chapter.duration}</p>
                        </div>
                    </div>
                    <HiOutlineCheckBadge className='text-4xl text-gray-500 flex-none' />
                </div>   
            ))}
        </div>
    </div>
  )
}

export default ChapterList