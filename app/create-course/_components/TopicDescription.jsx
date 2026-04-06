import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import React from 'react' 
import { useContext } from 'react';
import { UserInputContext } from '../../_context/UserInputContext';

function TopicDescription() {
  const {userCourseInput,setUserCourseInput}=useContext(UserInputContext);
  const handleInputChange=(fieldName,value)=>{
    setUserCourseInput(prev=>({
      ...prev,
      [fieldName]:value
    }))
  }
  return (
    <div>
        <div className='mt-5'>
            <label>Write a topic for which you want to generate a course (e.g., Python Course,Yoga,etc):</label>
            <Input placeholder={'Topic'} className="h-14 text-xl"
            defaultValue={userCourseInput?.topic}
            onChange={(e)=>handleInputChange('topic',e.target.value)} />
        </div>
        <div className='mt-5'>
            <label>Tell us more about your course, what you want to include to the course.</label>
            <Textarea placeholder="About your course" className="h-14 text-xl"
            defaultValue={userCourseInput?.description}
            onChange={(e)=>handleInputChange('description',e.target.value)} 
            />
        </div>
    </div>
  )
}

export default TopicDescription