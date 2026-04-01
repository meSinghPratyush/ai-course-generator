"use client"
import { Button } from '@/components/ui/button';
import React, { act, useEffect, useState } from 'react'
import { HiCube,HiNewspaper,HiOutlineCog } from "react-icons/hi";
import SelectCategory from './_components/SelectCategory';
import TopicDescription from './_components/TopicDescription';
import SelectOption from './_components/SelectOption';
import { useContext } from 'react';
import { UserInputContext } from '../_context/UserInputContext';
import { GenerateCourseLayout_AI, normalizeCourseOutput } from '@/configs/AiModel'; // ✅ UPDATED
import LoadingDialog from './_components/LoadingDialog';
import { db } from '@/configs/db';
import { CourseList } from '@/configs/schema';
import { Save } from 'lucide-react';
import uuid4 from 'uuid4';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';


function CreateCourse() {
    const StepperOptions=[{
        id:1,
        name:'Category',
        icon:<HiCube />
    },
    {
        id:2,
        name:'Topic & Desc',
        icon:<HiNewspaper />
    },
    {
        id:3,
        name:'Options',
        icon:<HiOutlineCog />
    }
]

const {userCourseInput,setUserCourseInput}=useContext(UserInputContext);
const [loading,setLoading]=useState(false);
const [activeIndex,setActiveIndex]=React.useState(0);
const {user}=useUser();
const router=useRouter();

useEffect(()=>{
    console.log(userCourseInput);
},[userCourseInput])


const checkStatus = () => {
    if(userCourseInput?.length==0){
        return true;
    }
    if(activeIndex==0&&(userCourseInput?.category?.length==0 || userCourseInput?.category==undefined)){
        return true;
    }
    if(activeIndex==1&&(userCourseInput?.topic?.length==0 || userCourseInput?.topic==undefined)){
        return true;
    }
    else if(
    activeIndex==2 && (
        userCourseInput?.level==undefined ||
        userCourseInput?.duration==undefined ||
        userCourseInput?.displayVideo==undefined ||
        userCourseInput?.noOfChapters==undefined ||
        userCourseInput?.noOfChapters <= 0
    )
){
    return true;
}
    return false;
}

const GenerateCourseLayout=async()=>{
    try{
    setLoading(true);
    const BASIC_PROMPT='Generate A Course Tutorial on Following Detail With field as Course Name,Description, Along with Chapter Name,about,Duration:'
    const USER_INPUT_PROMPT='Category:'+userCourseInput?.category+',Topic:'+userCourseInput?.topic+',Level:'+userCourseInput?.level+','+userCourseInput?.duration+',NoOf Chapters:'+userCourseInput?.noOfChapters+', in JSON format'
    const FINAL_PROMOT=BASIC_PROMPT+USER_INPUT_PROMPT;
    console.log(FINAL_PROMOT);

    const result = await GenerateCourseLayout_AI(FINAL_PROMOT);
    console.log(result);

    // Clean JSON
    const cleaned = result.replace(/```json|```/g, "");
    const parsed = JSON.parse(cleaned);

    // 🔥 NEW: Normalize AI output (VERY IMPORTANT)
    const normalized = normalizeCourseOutput(parsed);

    console.log("Normalized:", normalized);

    SaveCourseLayoutInDb(normalized); // ✅ use normalized instead of parsed
    
}catch (error) {
        console.error("ERROR:", error);
        alert("Something went wrong while generating course");
    } finally {
        setLoading(false);
    }
};

const SaveCourseLayoutInDb=async(courseLayout)=>{
    var id = uuid4();
    setLoading(true);
    const result=await db.insert(CourseList).values({
        courseId:id,
        name:userCourseInput?.topic,
        level:userCourseInput?.level,
        category:userCourseInput?.category,
        courseOutput:courseLayout,
        createdBy:user?.primaryEmailAddress?.emailAddress || 'Unknown',
        userName:user?.fullName || 'Unknown',
        userProfileImage:user?.imageUrl || ''
    })

    console.log('Finish');
    
    setLoading(false);
    router.replace('/create-course/'+id);
}
    return (
    <div>
        {/* Stepper */}

        <div>
            <div className='flex flex-col justify-center items-center mt-10'>
                <h2 className='text-4xl text-primary font-medium'>Create Course</h2>
                <div className='flex mt-10'>
                    {StepperOptions.map((item,index)=>(
                        <div className='flex items-center' key={item.id || index}>
                            <div className='flex flex-col items-center w-[50px] md:w-[100px]'>
                                <div className={`bg-gray-200 p-3 rounded-full text-black
                                ${activeIndex>=index&&'bg-primary'}`}>
                                    {item.icon}
                                </div>
                                <h2 className='hidden md:block md:text-sm'>{item.name}</h2>
                            </div>
                            {index!=StepperOptions?.length-1&&
                            <div className={`h-1 w-[50px] md:w-[100px] rounded-full lg:w-[170px] bg-gray-300
                                ${activeIndex-1>=index && 'bg-purple-500'}
                            `}>

                            </div>}
                        </div>

                    ))}
                </div>
            </div>
        </div>
        <div className='px-10 md:px-20 lg:px-44 mt-10'>                
            {/* Component */}

                    {activeIndex==0?<SelectCategory />:
                    activeIndex==1?<TopicDescription/>:
                    <SelectOption />}
            {/* Next and previous button */}
            <div className='flex justify-between mt-10'>
                <Button disabled={activeIndex==0} 
                variant='outline' text-color='black'
                onClick={()=>setActiveIndex(activeIndex-1)}>Previous</Button>
                {activeIndex<2&& <Button disabled={checkStatus()} onClick={()=>setActiveIndex(activeIndex+1)}>Next</Button>}
                {activeIndex==2&& <Button disabled={checkStatus()} onClick={()=>GenerateCourseLayout()}>Generate Course</Button>}
            </div>
        </div>
           <LoadingDialog loading={loading} />            
    </div>
  )
}

export default CreateCourse