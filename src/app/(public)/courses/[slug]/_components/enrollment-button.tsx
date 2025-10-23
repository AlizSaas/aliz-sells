'use client'

import { Button } from "@/components/ui/button"
import { tryCatch } from "@/hooks/try-catch";

import { useTransition } from "react";
import { enrollInCourseAction } from "../action";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function EnrollmentButton({courseId}:{courseId:string}) {
      const [isPending, startTransition] = useTransition();
     

   function onSubmit() {
     startTransition(async () => {
       const {data:result,error} = await tryCatch(enrollInCourseAction(courseId))
       if(error) {
         toast.error('Something went wrong. Please try again.')
         return;
       }
 
       if(result.status === 'success' ) {
         toast.success(result.message)
     
        
         
 
       }
       else if (result.status === 'error') {
         toast.error(result.message)
       }
     })
 
   }
    return (
        <Button
        disabled={isPending}
        onClick={onSubmit}
        className="w-full">
         {
            isPending ? 
            <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
            
            
            </> : 'Enroll Now'
         }
        </Button>
    )
}