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

import { useCreateChapter } from '@/data/admin/hooks/use-admin'
export default function NewChapterModal({courseId}:{courseId:string}) {
    const [isOpen, setOpen] = useState(false)
  const createChapter = useCreateChapter()

       const form = useForm<ChapterSchemaType>({
            resolver: zodResolver(chapterSchema),
            defaultValues: {
                name: '',
                courseId: courseId,
     
    
            },
          });

          async function onSubmit(values: ChapterSchemaType) {
            createChapter.mutate(values, {
                onSuccess: () => {
                    
                    setOpen(false)
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
                    disabled={createChapter.isPending}
                    type='submit'>
                        {
                            createChapter.isPending ? 'Creating...' : 'Create Chapter'
                        }
                        

                        
                    </Button>
                </DialogFooter>
         
                 

                
                
                
                


            </form>


        </Form>

    </DialogContent>


    </Dialog>
            
  )
}
