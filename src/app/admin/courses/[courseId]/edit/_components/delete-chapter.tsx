'use client'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

import { Trash2 } from 'lucide-react'
import React, { useState} from 'react'

import { useDeleteChapter } from '@/data/admin/hooks/use-admin'

export default function DeleteChapter({chapterId, courseId}:{chapterId:string, courseId:string}) {
    const [open, setOpen] = useState(false)
    const deleteChapter = useDeleteChapter()

  function onSubmit () {

    deleteChapter.mutate({chapterId, courseId})
       



            
     
        
        
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
           disabled={deleteChapter.isPending}
           onClick={onSubmit}
           >
   {
    deleteChapter.isPending ? 'Deleting...' : 'Delete'
   }
           </Button>

        </AlertDialogFooter>
        </AlertDialogContent>
      
    </AlertDialog>
  )
}


