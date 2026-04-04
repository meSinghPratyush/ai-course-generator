import { UserButton } from '@clerk/nextjs'
import React from 'react'
import AddCourse from './_components/AddCourse'
import UserCourseList from './_components/UserCourseList'


function dashboard() {
  return (
    <div>
      <AddCourse />
      {/* List of Course */}
      <UserCourseList />
    </div>
  )
}

export default dashboard