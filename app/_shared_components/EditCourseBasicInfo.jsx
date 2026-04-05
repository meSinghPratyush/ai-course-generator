
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FiEdit } from "react-icons/fi";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react'
import { CourseList } from "@/configs/schema";
import { db } from "@/configs/db";
import { eq } from "drizzle-orm";
import { refresh } from "next/cache";
function EditCourseBasicInfo({course, refreshData}) {

    const [name,setName]=useState();
    const [description,setDescription]=useState();

    useEffect(()=>{
        setName(course?.courseOutput?.course_name);
        setDescription(course?.courseOutput?.description);  
    },[course])
    const onUpdateHandler=async()=>{
        course.courseOutput.course_name=name;
        course.courseOutput.description=description;
        const result=await db.update(CourseList).set({
            courseOutput:course.courseOutput
        }).where(eq(CourseList.id,course.id))
        .returning({id:CourseList.id});

        refreshData(true);
    }
  return (
    <Dialog>
      <DialogTrigger><FiEdit /></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit course title and description</DialogTitle>
        </DialogHeader>

        {/* Moved content OUT of DialogDescription, into a plain div */}
        <div className="flex flex-col gap-4 mt-2">
          <div className='mr-3'>
            <label className="text-sm font-medium">Course Title</label>
            <Input className="mt-1" defaultValue={course?.courseOutput?.course_name} 
            onChange={(event)=>setName(event.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea className="mt-1 h-40" defaultValue={course?.courseOutput?.description}
                onChange={(event)=>setDescription(event.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button onClick={onUpdateHandler}>Update</Button>
            </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditCourseBasicInfo