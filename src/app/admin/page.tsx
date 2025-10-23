
import { ChartAreaInteractive } from '@/components/sidebar/chart-area-interactive'

import { SectionCards } from '@/components/sidebar/section-cards'

import { Card } from '@/components/ui/card'


import React, { Suspense } from 'react'

import { prefetchDashboardData, prefetchEnrollmentStats, prefetchRecentCourses } from '@/data/admin/server/prefetch'


import { HydrateClient } from '@/trpc/server'
import { ErrorBoundary } from 'react-error-boundary'
import { RenderRecentCourses } from './courses/_components/render-recent-courses'
import { requireAdmin } from '@/data/admin/require-admin'

export default async function Admin() {
  await requireAdmin()
    prefetchDashboardData()
    prefetchEnrollmentStats()
    prefetchRecentCourses()

  // const enrollmentData = await adminGetEnrollmentStats()
  return (
    <>
    <HydrateClient> 
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <Suspense fallback={<div>Loading stats...</div>}>
        <SectionCards />
      
      </Suspense>
      <Suspense fallback={<div>Loading chart...</div>}>
        <ChartAreaInteractive />
      </Suspense>
      <Suspense fallback={<AdminCourseCardSkeleton />}>
      <RenderRecentCourses />
      </Suspense>
      </ErrorBoundary>
   
     </HydrateClient>

              


    </>
  )
}



function AdminCourseCardSkeleton() {
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
      {
        [1, 2].map((course) => (
          <Card key={course} className='animate-pulse h-32' />
        ))
      }

    </div>
  )
}