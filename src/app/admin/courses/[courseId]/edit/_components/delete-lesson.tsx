'use client'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { tryCatch } from '@/hooks/try-catch'
import { Trash2 } from 'lucide-react'
import React, { useState, useTransition } from 'react'
import { deleteLesson } from '../action'
import { toast } from 'sonner'

export default function DeleteLesson({chapterId, lessonId, courseId}:{chapterId:string, lessonId:string, courseId:string}) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    async function onSubmit () {
        startTransition(async () => {
            const {data:result,error} = await tryCatch(deleteLesson(lessonId,chapterId,courseId))

 if(error) {
    toast.error('Something went wrong')
    return
   }

   if(result.status === 'success') {
    toast.success(result.message)

    setOpen(false)
    
   } else if(result.status === 'error' ) {
    toast.error(result.message)
   }




            
        })
        
        
    }
  return (
    <AlertDialog
    open={open}
    onOpenChange={setOpen}
    >
        <AlertDialogTrigger asChild>
            <Button variant={'ghost'} size={'icon'}>
           <Trash2 className='size-4' />
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader> 
     <AlertDialogTitle>
               Are you sure you want to delete this lesson?
     </AlertDialogTitle>
     <AlertDialogDescription>
         This lesson will be permanently removed from the course.
     </AlertDialogDescription>
     </AlertDialogHeader>

          <AlertDialogFooter>
           <AlertDialogCancel>
            Cancel
           </AlertDialogCancel>
           <Button
           disabled={isPending}
           onClick={onSubmit}
           >
   {
    isPending ? 'Deleting...' : 'Delete'
   }
           </Button>

        </AlertDialogFooter>
        </AlertDialogContent>
      
    </AlertDialog>
  )
}
