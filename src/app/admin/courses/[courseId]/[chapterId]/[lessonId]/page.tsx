

import LessonForm from './_components/lesson-form'

import { HydrateClient } from '@/trpc/server'
import { ErrorBoundary } from 'react-error-boundary'
import React, { Suspense } from 'react'
import { prefetchCourseLesson    } from "@/data/admin/server/prefetch";
import { requireAdmin } from '@/data/admin/require-admin';
type Params = Promise<{lessonId: string, chapterId: string, courseId: string}>
export default async function LessonId({params}: {params: Params}) {
  await requireAdmin()
    const {lessonId,chapterId,courseId} = await params

 prefetchCourseLesson(lessonId) //preload the lesson data on server side
    

 return (
         <HydrateClient>
          <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <Suspense fallback={<div>Loading...</div>}>
            <LessonForm 
            lessonId={lessonId}
            chapterId={chapterId} courseId={courseId} />
          </Suspense>
          </ErrorBoundary>
      
      
         </HydrateClient>
 )
}
