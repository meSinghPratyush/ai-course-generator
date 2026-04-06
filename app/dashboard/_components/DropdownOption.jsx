import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
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
} from "@/components/ui/alert-dialog"
import React from 'react'
import { HiTrash } from "react-icons/hi";

function DropdownOption({children, handleOnDelete}) {
    const [openAlert, setOpenAlert] = React.useState(false);

  return (
    <div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="cursor-pointer">{children}</div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        className="flex items-center gap-1 text-red-500 cursor-pointer focus:text-red-500"
                        onClick={()=>setOpenAlert(true)}
                    >
                        <HiTrash />Delete
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog open={openAlert}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this course from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={()=>setOpenAlert(false)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-red-500 hover:bg-red-600"
                        onClick={()=>{handleOnDelete();setOpenAlert(false)}}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  )
}

export default DropdownOption