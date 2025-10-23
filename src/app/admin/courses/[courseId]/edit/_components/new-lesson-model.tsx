'use client'
import React, { useState } from 'react'
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


import { toast } from 'sonner'
import { useCreateLesson } from '@/data/admin/hooks/use-admin'
export default function NewLessonModal({courseId,chapterId}:{courseId:string,chapterId:string}) {
    const [isOpen, setOpen] = useState(false)
 const createLesson  = useCreateLesson()

       const form = useForm<LessonSchemaType>({
            resolver: zodResolver(lessonSchema),
            defaultValues: {
                name: '',
                courseId,
                chapterId
     
    
            },
          });

          async function onSubmit(values: LessonSchemaType) {
        createLesson.mutate(values, {
            onSuccess: (data) => {
                
                setOpen(false)
                form.reset()
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
                    disabled={createLesson.isPending}
                    type='submit'>
                        {
                            createLesson.isPending ? 'Creating...' : 'Create Lesson'
                        }
                        

                        
                    </Button>
                </DialogFooter>
         
                 

                
                
                
                


            </form>


        </Form>

    </DialogContent>


    </Dialog>
            
  )
}
