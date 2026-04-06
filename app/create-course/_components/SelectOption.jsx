import React, { useContext } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input'
import { UserInputContext } from '@/app/_context/UserInputContext';

function SelectOption() {
  const {userCourseInput,setUserCourseInput}=useContext(UserInputContext);
  const handleInputChange=(fieldName,value)=>{
    setUserCourseInput(prev=>({
      ...prev,
      [fieldName]:value
    }))
  }
  return (
    <div>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
            <div>
                <label className='text-sm'>Difficulty Level</label>
                <Select onValueChange={(value)=>handleInputChange('level',value)}
                    defaultValue={userCourseInput?.level}>
                    <SelectTrigger className="w-full cursor-pointer">
                        <SelectValue placeholder="select" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advance">Advance</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            
            <div>
                <label className='text-sm'>Course Duration</label>
                <Select onValueChange={(value)=>handleInputChange('duration',value)}
                    defaultValue={userCourseInput?.duration}>
                    <SelectTrigger className="w-full cursor-pointer">
                        <SelectValue placeholder="select" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                        <SelectItem value="1 Hours">1 Hours</SelectItem>
                        <SelectItem value="2 Hours">2 Hours</SelectItem>
                        <SelectItem value="More than 3 Hours">More than 3 Hours</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        
            <div>
                <label className='text-sm'>Need Video lectures?</label>
                <Select onValueChange={(value)=>handleInputChange('displayVideo',value)}
                    defaultValue={userCourseInput?.displayVideo}>
                    <SelectTrigger className="w-full cursor-pointer">
                        <SelectValue placeholder="select" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <label className='text-sm'>No of chapters</label>
                <Input type="number" className="w-full cursor-pointer" 
                defaultValue={userCourseInput?.noOfChapters}
                onChange={(event)=>handleInputChange('noOfChapters',event.target.value)}/>
            </div>
        </div>
    </div>
  )
}

export default SelectOption