import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import React from 'react'
import { HiTrash } from "react-icons/hi";


function DropdownOption({children, handleOnDelete}) {

    const [openAlert,setOpenAlert]=React.useState(false);
    const OnDeleteClick=()=>{

    }
  return (
    <div>
        <DropdownMenu>
    <DropdownMenuTrigger asChild>
        <Button variant="outline">{children}</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
        <DropdownMenuGroup>
        <DropdownMenuLabel onClick={()=>setOpenAlert(true)}>
            <div className="flex items-center gap-1"><HiTrash />Delete</div>
        </DropdownMenuLabel>
        </DropdownMenuGroup>
    </DropdownMenuContent>
    </DropdownMenu>
    <AlertDialog open={openAlert}>
 
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your account
        from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel onClick={()=>setOpenAlert(false)}>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={()=>{handleOnDelete();setOpenAlert(false)}}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
    </div>
  )
}

export default DropdownOption