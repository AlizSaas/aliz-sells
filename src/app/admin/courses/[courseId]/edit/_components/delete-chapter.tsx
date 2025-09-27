'use client'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { tryCatch } from '@/hooks/try-catch'
import { Trash2 } from 'lucide-react'
import React, { useState, useTransition } from 'react'
import { deleteChapter } from '../action'
import { toast } from 'sonner'

export default function DeleteChapter({chapterId, courseId}:{chapterId:string, courseId:string}) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    async function onSubmit () {
        startTransition(async () => {
            const {data:result,error} = await tryCatch(deleteChapter(chapterId,courseId))

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
               Are you sure you want to delete this Chapter?
     </AlertDialogTitle>
     <AlertDialogDescription>
         This chapter will be permanently removed from the course.
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


