import { buttonVariants } from '@/components/ui/button'

import Link from 'next/link'
import React from 'react'
import  {  AdminCourseCardSkeletonLayout, RenderCourses } from './_components/admin-course-card'

import { Suspense } from 'react'
import { HydrateClient } from '@/trpc/server'
import { ErrorBoundary } from 'react-error-boundary'
import { prefetchAllCourses } from '@/data/admin/server/prefetch'
import { requireAdmin } from '@/data/admin/require-admin'


export default  async function CoursesPage() {
    await requireAdmin()
  prefetchAllCourses()

  return (
    <>
    
    <div className='flex items-center justify-between'>
      <h1 className='text-2xl font-bold'>Your Courses</h1>
      <Link href="/admin/courses/create"  className={buttonVariants()}>
      Create Course
      </Link>

    </div>
  <HydrateClient>

    <ErrorBoundary fallback={<div>Something went wrong</div>}>
    <Suspense fallback={<AdminCourseCardSkeletonLayout />}>
    <RenderCourses />
    </Suspense>
    </ErrorBoundary>

  </HydrateClient>


    </>
  )
}



