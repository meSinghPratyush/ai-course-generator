"use client";

import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from 'next/image';

function LoadingDialog({ loading }) {
  return (
    <AlertDialog open={loading}>
      <AlertDialogContent>
        <AlertDialogHeader>

          {/* ✅ REQUIRED for accessibility */}
          <AlertDialogTitle>
            
          </AlertDialogTitle>

          {/* ❌ REMOVE AlertDialogDescription wrapper */}
          <div className="flex flex-col items-center justify-center text-center w-full py-10">
            <Image src="/loader.gif" alt="loader" width={100} height={100} className='mx-auto' />
            <p className='mt-4 text-lg font-medium text-center w-full'>
              Please wait... we are preparing your course 🚀
            </p>
          </div>

        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default LoadingDialog;