import Image from 'next/image'
import React from 'react'
import { HiBookOpen } from "react-icons/hi2";
import { HiDotsVertical } from "react-icons/hi";
import DropdownOption from './DropdownOption';
import { db } from '@/configs/db';
import { CourseList, ChapterContent } from '@/configs/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';

function CourseCard({ course, refreshData, displayUser = false }) {
  const [visible, setVisible] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleOnDelete = async () => {
    setIsDeleting(true);
    setTimeout(() => setVisible(false), 300); // let fade-out animate first
    await db.delete(ChapterContent).where(eq(ChapterContent.courseId, course?.courseId));
    const resp = await db.delete(CourseList).where(eq(CourseList.id, course?.id))
      .returning({ id: CourseList.id });
    if (resp) {
      refreshData();
    }
  };

  if (!visible) return null;

  const levelColor = {
    'Beginner': 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    'Intermediate': 'bg-amber-50 text-amber-600 border border-amber-200',
    'Advanced': 'bg-rose-50 text-rose-600 border border-rose-200',
  };

const rawLevel = course?.courseOutput?.level;
const level = rawLevel?.toLowerCase().startsWith('advance') ? 'Advanced' : rawLevel;
const levelClass = levelColor[level] || 'bg-purple-50 text-purple-600 border border-purple-200';

  return (
    <div
      className={`group relative bg-white rounded-2xl overflow-hidden border border-gray-100 cursor-pointer transition-all duration-300 ease-out
        hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1
        ${isDeleting ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}
      `}
      style={{ transition: 'opacity 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease' }}
    >
      {/* Image Container */}
      <Link href={'/course/' + course?.courseId}>
        <div className='relative overflow-hidden h-[180px] w-full bg-gray-100'>
          <Image
            src={course?.courseBanner}
            fill
            alt={course?.name}
            className='object-cover transition-transform duration-500 ease-out group-hover:scale-105'
          />
          {/* Subtle overlay on hover */}
          <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
        </div>
      </Link>

      {/* Content */}
      <div className='p-4'>
        {/* Title + Menu */}
        <div className='flex justify-between items-start gap-2 mb-1'>
          <Link href={'/course/' + course?.courseId} className='flex-1'>
            <h2
              className='font-semibold text-[15px] text-gray-800 line-clamp-2 leading-snug group-hover:text-purple-700 transition-colors duration-200'
              title={course?.courseOutput?.course_name}
            >
              {course?.courseOutput?.course_name}
            </h2>
          </Link>
          {!displayUser && (
            <DropdownOption handleOnDelete={handleOnDelete}>
              <button className='p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-150 flex-none mt-0.5'>
                <HiDotsVertical size={16} />
              </button>
            </DropdownOption>
          )}
        </div>

        {/* Category */}
        <p className='text-xs font-medium text-gray-400 uppercase tracking-wide mb-3'>
          {course?.category}
        </p>

        {/* Divider */}
        <div className='h-px bg-gray-100 mb-3' />

        {/* Chapters + Level */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-1.5 text-purple-600 bg-purple-50 border border-purple-100 rounded-lg px-2.5 py-1'>
            <HiBookOpen size={13} />
            <span className='text-xs font-semibold'>
              {course?.courseOutput?.chapters?.length} Chapters
            </span>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${levelClass}`}>
            {level}
          </span>
        </div>

        {/* User info (Explore page) */}
        {displayUser && (
          <div className='flex items-center gap-2 mt-3 pt-3 border-t border-gray-100'>
            <img
              src={course?.userProfileImage}
              width={24}
              height={24}
              alt={course?.userName}
              className='rounded-full ring-2 ring-purple-100 object-cover'
            />
            <p className='text-xs text-gray-500 font-medium truncate'>{course?.userName}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseCard;