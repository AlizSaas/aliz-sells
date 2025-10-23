"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"



import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,

  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import {  Loader2, PlusIcon, SparkleIcon } from 'lucide-react'

import slugify from 'slugify'
import { courseCategories, courseLevels, courseSchema, CourseSchemaType, courseStatuses } from "@/lib/zodSchema"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import RichTextEditor from "@/components/rich-text-editor/editor"
import FileUploader from "@/components/file-uploader/file-uploader"


import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { CourseDataType, useEditCourse } from "@/data/admin/hooks/use-admin"


export default function EditCourseForm({data}:{data:CourseDataType}) {
   const editCourse = useEditCourse()
      const router = useRouter()
      const form = useForm<CourseSchemaType>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
    title: data.title,
    slug: data.slug,
    smallDescription: data.smallDescription,
    description: data.description,
    fileKey: data.fileKey,
    category: data.category as CourseSchemaType['category'],
    level: data.level,
    duration: data.duration,
    price: data.price,
    status: data.status,

        },
      });
       function onSubmit(values: CourseSchemaType) {
        editCourse.mutate(
          {
            courseId: data.id,
            ...values
          },
          {
            onSuccess:() => {
           
              router.push('/admin/courses')
            }
          }
        )

         
     
       }
  return (
     <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
              control={form.control}
              name="title"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Course Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              />
              <div className="flex items-end gap-4">
                 <FormField
              control={form.control}
              name="slug"
              render={({field}) => (
                <FormItem className="w-full">
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="Course Slug" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              />
              <Button type="button" className="w-fit" onClick={() => {
                const title = form.getValues("title");
                const slug = slugify(title);
                form.setValue("slug", slug, { shouldValidate: true});

              }}>
                Generate Slug <SparkleIcon className="ml-1 " size={16}/>
              </Button>

              </div>
              <FormField
              control={form.control}
              name="smallDescription"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Small Description</FormLabel>
                  <FormControl>
                    <Textarea
                    className="min-h-[110px]"
                    placeholder="Small Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              />
              <FormField
              control={form.control}
              name="description"
              render={({field}) => (
                <FormItem className="w-full">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                   <RichTextEditor field={field}  />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              />
              <FormField
              control={form.control}
              name="fileKey"  
              render={({field}) => (
                <FormItem className="w-full">
                  <FormLabel>Thumbnail image</FormLabel>
                  <FormControl>
                    <FileUploader
                    fileTypeAccepted="image"
                    value={field.value}
                    onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField 
                control={form.control}
                name="category"
                render={({field}) => (
                  <FormItem className="w-full">
                    <FormLabel>Catergory</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />

                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {
                          courseCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))
                          
                        }
                      </SelectContent>
                      </Select>

                  
                    <FormMessage />
                  </FormItem>
                )}
                
                />
                <FormField 
                control={form.control}
                name="level"
                render={({field}) => (
                  <FormItem className="w-full">
                    <FormLabel>Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a level" />

                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {
                          courseLevels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))
                          
                        }
                      </SelectContent>
                      </Select>

                  
                    <FormMessage />
                  </FormItem>
                )}
                
                />
                    <FormField
              control={form.control}
              name="duration"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Duration (hours)</FormLabel>
                  <FormControl>
                 <Input  {...field} type="number"  placeholder="Duration"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              />
                    <FormField
              control={form.control}
              name="price"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Price ($)</FormLabel>
                  <FormControl>
                 <Input type="number" placeholder="Price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              />

              </div>

               <FormField 
                control={form.control}
                name="status"
                render={({field}) => (
                  <FormItem className="w-full">
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a status" />

                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {
                          courseStatuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))
                          
                        }
                      </SelectContent>
                      </Select>

                  
                    <FormMessage />
                  </FormItem>
                )}
                
                />
                <Button
                disabled={editCourse.isPending}
                type="submit">
                  {
                    editCourse.isPending ?<> Updating... <Loader2 className="animate-spin"/> </> : <>  Update Course <PlusIcon className="ml-2 size-4"/> </>
                  }
                </Button>


            </form>



            </Form>
  )
}
