
import { HydrateClient } from '@/trpc/server'
import { ErrorBoundary } from 'react-error-boundary'
import React, { Suspense } from 'react'
import { prefetchSingleCourse    } from "@/data/admin/server/prefetch";
import { EditCoursePage } from './_components/edit-page';
import { requireAdmin } from '@/data/admin/require-admin';


type Params = Promise<{courseId: string}>

export default async function page({ params }: { params: Params }) {
    await requireAdmin()
    const { courseId } =  await params;

prefetchSingleCourse(courseId) //pre-fetch course data


   return <>
   <HydrateClient> 
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
    <Suspense fallback={<div>Loading...</div>}>
   <EditCoursePage courseId={courseId} />
    </Suspense>
    </ErrorBoundary>
   </HydrateClient>
   

   
   </>
}

