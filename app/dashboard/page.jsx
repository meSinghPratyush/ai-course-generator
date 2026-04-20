"use client"
import { UserButton } from '@clerk/nextjs'
import React from 'react'
import AddCourse from './_components/AddCourse'
import UserCourseList from './_components/UserCourseList'

function dashboard() {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleClearSearch = () => setSearchQuery('');

  return (
    <div>
      <AddCourse />

      {/* Modern search bar */}
      <div className='flex items-center gap-3 mt-6'>
        <div className='relative flex-1'>
          <svg
            className='absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none'
            style={{ width: 16, height: 16, color: '#875bf9' }}
            viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type='text'
            placeholder='Search your courses by name, category or level...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full h-[46px] pl-10 pr-4 text-sm outline-none transition-all duration-200'
            style={{
              borderRadius: 14,
              border: '1.5px solid #e5e7eb',
              background: 'var(--color-background-primary)',
            }}
            onFocus={e => {
              e.target.style.borderColor = '#875bf9';
              e.target.style.boxShadow = '0 0 0 3px rgba(135,91,249,0.12)';
            }}
            onBlur={e => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className='h-[46px] px-5 text-sm font-medium transition-all duration-200'
            style={{
              borderRadius: 14,
              border: '1.5px solid #875bf9',
              color: '#875bf9',
              background: 'transparent',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(135,91,249,0.06)'}
            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
          >
            Clear
          </button>
        )}
      </div>

      <UserCourseList searchQuery={searchQuery} />
    </div>
  )
}

export default dashboard