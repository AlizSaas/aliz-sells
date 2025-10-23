'use client'

import FileUploader from "@/components/file-uploader/file-uploader";
import RichTextEditor from "@/components/rich-text-editor/editor";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { lessonSchema, LessonSchemaType } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { useForm } from "react-hook-form";


import { useSuspenseLesson, useUpdateCourseLesson } from "@/data/admin/hooks/use-admin";

interface LessonFormProps {

  chapterId: string;
  courseId:string,
  lessonId:string;
}

export default function LessonForm({ chapterId,courseId,lessonId}: LessonFormProps) {

const {data:initialData} = useSuspenseLesson(lessonId)

const updateChapterLesson = useUpdateCourseLesson()



    const form = useForm<LessonSchemaType>({
      resolver: zodResolver(lessonSchema),
      defaultValues: {
        
        name: initialData.title,
        description: initialData.description ?? undefined,
        videoKey: initialData.videoKey ?? undefined,
        thumbnailKey: initialData.thumbnailKey ?? undefined,
        chapterId: chapterId,
        courseId:courseId
      },
    });

  function onSubmit(values: LessonSchemaType) {
    updateChapterLesson.mutate({
      lessonId: lessonId,
      name: values.name,
      description: values.description,
      thumbnailKey: values.thumbnailKey,
      videoKey: values.videoKey,
      chapterId: chapterId,
      courseId:courseId
    
    })

    

    
  
  
  
  }

     
 
   
  return (
    <div>
 <Link
 
 href={`/admin/courses/${courseId}/edit`} className={buttonVariants({variant:'outline', className:'mb-4'})}>
 <ArrowLeft className="size-4" />
  Back to course
 
 </Link>

 <Card>
  <CardHeader>
    <CardTitle> Lesson configuration </CardTitle>
    <CardDescription>
      configure the video and description for this lesson
    </CardDescription>
  </CardHeader>
  <CardContent>
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
        control={form.control}
        name="name"
        render={({field}) => (
          <FormItem>
            <FormLabel>
              Lesson name
            </FormLabel>
            <FormControl>
              <Input placeholder="Lesson name" {...field} />
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
        />
        <FormField
        control={form.control}
        name="description"
        render={({field}) => (
          <FormItem>
            <FormLabel>
              Lesson description
            </FormLabel>
            <FormControl>
        <RichTextEditor field={field} />
            </FormControl>
            <FormMessage/>

          </FormItem>
        )}
        />
        <FormField
        control={form.control}
        name="thumbnailKey"
        render={({field}) => (
          <FormItem>
            <FormLabel>
              Thumbnail key
            </FormLabel>
            <FormControl>
              <FileUploader fileTypeAccepted="image" value={field.value} onChange={field.onChange} />
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
        />  
        <FormField
        control={form.control}
        name="videoKey"
        render={({field}) => (
          <FormItem>
            <FormLabel>
              Video key
            </FormLabel>
            <FormControl>
              <FileUploader
              fileTypeAccepted="video"
              value={field.value} onChange={field.onChange} />
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
        />  

        <Button
        disabled={updateChapterLesson.isPending}
        type='submit' className="w-full">
     {
      updateChapterLesson.isPending ? 'Saving...' : 'Save changes'
     }
        </Button>




      </form>

    </Form>
  </CardContent>

 </Card>


    </div>
  )
}
