import React, { use, useEffect, useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FiEdit } from "react-icons/fi";
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { db } from '@/configs/db';
import { eq } from 'drizzle-orm';
import { CourseList } from '@/configs/schema';

function EditChapters({course, index, refreshData}) {

    const Chapters=course?.courseOutput.chapters;
    const [name,setName]=useState();
    const [about,setAbout]=useState();
    useEffect(()=>{
        setName(Chapters[index].chapter_name);
        setAbout(Chapters[index].about);
    },[course])
    const onUpdateHandler=async()=>{
        Chapters[index].chapter_name=name;
        Chapters[index].about=about;
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
        <DialogTitle>Edit chapters.</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-2">
          <div className='mr-3'>
            <label className="text-sm font-medium">Course Title</label>
            <Input className="mt-1" defaultValue={Chapters[index].chapter_name} 
            onChange={(event)=>setName(event.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea className="mt-1 h-40" defaultValue={Chapters[index].about}
                onChange={(event)=>setAbout(event.target.value)}
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

export default EditChapters