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
import { chapterSchema, ChapterSchemaType } from '@/lib/zodSchema'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { tryCatch } from '@/hooks/try-catch'
import { createChapter } from '../action'
import { toast } from 'sonner'
export default function NewChapterModal({courseId}:{courseId:string}) {
    const [isOpen, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

       const form = useForm<ChapterSchemaType>({
            resolver: zodResolver(chapterSchema),
            defaultValues: {
                name: '',
                courseId: courseId,
     
    
            },
          });

          async function onSubmit(values: ChapterSchemaType) {
          startTransition(async () =>{
   const {data:result,error } = await tryCatch(createChapter(values))
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
    <Dialog open={isOpen} onOpenChange={handleOpenChange}> 
    <DialogTrigger asChild>
        <Button variant={'outline'} size={'sm'} className='gap-2'>
            <PlusIcon className='size-4'/>
            New Chapter
        </Button>
    </DialogTrigger>
    <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
            <DialogTitle>Create a New Chapter</DialogTitle>
            <DialogDescription>
                Add a new chapter to your course.
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
                       
                        <Input placeholder='Chapter Name' {...field} />
                        </FormControl>
                        <FormMessage />



                    </FormItem>
                )} />


                <DialogFooter>
                    <Button 
                    disabled={isPending}
                    type='submit'>
                        {
                            isPending ? 'Creating...' : 'Create Chapter'
                        }
                        

                        
                    </Button>
                </DialogFooter>
         
                 

                
                
                
                


            </form>


        </Form>

    </DialogContent>


    </Dialog>
            
  )
}
