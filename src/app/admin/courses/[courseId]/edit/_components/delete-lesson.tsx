'use client'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

import { Trash2 } from 'lucide-react'
import React, { useState } from 'react'


import { useDeleteLesson } from '@/data/admin/hooks/use-admin'

export default function DeleteLesson({chapterId, lessonId, courseId}:{chapterId:string, lessonId:string, courseId:string}) {
    const [open, setOpen] = useState(false)
   const deleteLesson = useDeleteLesson()

     function onSubmit () {
        deleteLesson.mutate({lessonId,chapterId,courseId})
        setOpen(false)

     
        
        
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
           disabled={deleteLesson.isPending}
           onClick={onSubmit}
           >
   {
    deleteLesson.isPending ? 'Deleting...' : 'Delete'
   }
           </Button>

        </AlertDialogFooter>
        </AlertDialogContent>
      
    </AlertDialog>
  )
}
