'use client'
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TabsContent } from "@radix-ui/react-tabs";
import EditCourseForm from './edit-course-form';
import CourseStructure from './course-structure';
import { useSuspenseCourse } from '@/data/admin/hooks/use-admin';

export  function EditCoursePage({ courseId }: { courseId: string }) {
const {data} = useSuspenseCourse(courseId) //fetch course data using suspense hook 
 return (<div>
        <h1 className="text-3xl font-bold mb-4">
            Edit Course <span className="text-primary underline">
                {data.title}
            </span>
        </h1>
        <Tabs defaultValue={'course-structure'} className="w-full">
            <TabsList className="w-full grid grid-cols-2 ">
                <TabsTrigger value={'basic-info'}>Basic Info</TabsTrigger>
                <TabsTrigger value={'course-structure'}>Course Structure</TabsTrigger>

               
            </TabsList>
            <TabsContent value={'basic-info'} className="mt-4">
                <Card>
                    <CardHeader >
                <CardTitle> 
                    Basic Info
                </CardTitle>
                <CardDescription>
                    Edit basic info about the course

                </CardDescription>
                </CardHeader>
                <CardContent>
                    <EditCourseForm data={data} />
                </CardContent>
                
                </Card>
            </TabsContent>
            <TabsContent value={'course-structure'} className="mt-4">
                <Card>
                    <CardHeader > 
                <CardTitle> 
                    Course Structure
                </CardTitle>
                <CardDescription>
                    Edit the structure of the course
                </CardDescription>
                </CardHeader>
                <CardContent>
             <CourseStructure data={data} />
                </CardContent>
                </Card>
            </TabsContent>

            



        </Tabs>
    </div>
 )
}
