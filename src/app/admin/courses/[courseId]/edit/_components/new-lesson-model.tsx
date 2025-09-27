'use client'
import React, { useState, useTransition } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import {  lessonSchema, LessonSchemaType } from '@/lib/zodSchema'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { tryCatch } from '@/hooks/try-catch'
import {  createLesson } from '../action'
import { toast } from 'sonner'
export default function NewLessonModal({courseId,chapterId}:{courseId:string,chapterId:string}) {
    const [isOpen, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

       const form = useForm<LessonSchemaType>({
            resolver: zodResolver(lessonSchema),
            defaultValues: {
                name: '',
                courseId,
                chapterId
     
    
            },
          });

          async function onSubmit(values: LessonSchemaType) {
          startTransition(async () =>{
   const {data:result,error } = await tryCatch(createLesson(values))
   if(error) {
    toast.error('Something went wrong')
    return
   }

   if(result.status === 'success') {
    toast.success(result.message)
    form.reset()
    setOpen(false)
    
   } else if(result.status === 'error' ) {
    toast.error(result.message)
   }

   
          })
          }
    function handleOpenChange(open: boolean) {
        if(!open) {
            form.reset()
        }
        setOpen(open)
    }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange} > 
    <DialogTrigger asChild>
        <Button variant={'outline'} size={'sm'} className='gap-2 w-full' type='button'>
            <PlusIcon className='size-4'/>
            New Lesson
        </Button>
    </DialogTrigger>
    <DialogContent className='sm:max-w-[425px] '>
        <DialogHeader className=''>
            <DialogTitle>Create a New Lesson</DialogTitle>
            <DialogDescription>
                Add a new lesson to your chapter.
            </DialogDescription>
        </DialogHeader>
        <Form {...form} >
            <form className='space-y-8' onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                control={form.control}
                name='name'
                render={({field}) =>(
                    <FormItem>
                         <FormLabel>Name</FormLabel>
                        <FormControl> 
                       
                        <Input placeholder='Lesson Name' {...field} />
                        </FormControl>
                        <FormMessage />



                    </FormItem>
                )} />




                <DialogFooter>
                    <Button 
                    disabled={isPending}
                    type='submit'>
                        {
                            isPending ? 'Creating...' : 'Create Lesson'
                        }
                        

                        
                    </Button>
                </DialogFooter>
         
                 

                
                
                
                


            </form>


        </Form>

    </DialogContent>


    </Dialog>
            
  )
}
