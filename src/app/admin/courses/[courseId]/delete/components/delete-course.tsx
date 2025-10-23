'use client'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { Loader2, Trash2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { useParams, useRouter } from 'next/navigation'
import { useDeleteCourse } from '@/data/admin/hooks/use-admin'

export default function DeleteCourseRoute() {
const removeCourse = useDeleteCourse()
const {courseId} = useParams<{courseId: string}>()
const router = useRouter()

    function onSubmit() {
   removeCourse.mutate({courseId: courseId

    
   },
   {
     onSuccess: () => {
      
       router.push('/admin/courses')
     },
   
   }
  )

     
  
    }
  
  return (
    <div className='max-w-xl mx-auto w-full'>
      <Card className='mt-20'>
        <CardHeader>
          <CardTitle>
            Are you sure you want to delete this course?
          </CardTitle>
          <CardDescription>
            This action cannot be undone.
          </CardDescription>
          <CardContent className='mt-4 flex flex-col'>
            <Link href={`/admin/courses/`} className={buttonVariants({ className: 'w-full '})}>
            Cancel
            </Link>
            <Button
            onClick={onSubmit}
            disabled={removeCourse.isPending}
            variant='destructive' className='w-full mt-2'>
           
 {
  removeCourse.isPending ? <>
  <Loader2 className='size-4 animate-spin'/> 
  Deleting...
  
   </> : <>
   <Trash2 className='size-4 mr-1'/> Delete Course
   
   </>
 }
            </Button>

          </CardContent>
        </CardHeader>
      </Card>
    </div>
  )
}
