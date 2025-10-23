import { getAllCourses } from '@/data/course/get-all-courses'

import React, {Suspense} from 'react'
import PublicCourseCard, { LoadingCourses } from '../_component/public-course-card'




export default function PublicCoursesRoute() {
  return (
    <div className='mt-6'>
        <div className=' flex flex-col space-y-2 mb-10'>
            <h1 className='text-3xl md:text-4xl font-bold tracking-tight'>
                Explore Courses
            </h1>
            <p className='text-muted-foreground lg:max-w-2xl'>
                Discover a variety of courses designed to enhance your skills and knowledge. Whether you&apos;re looking to learn something new or deepen your expertise, our curated selection of courses has something for everyone.
            </p>

           <Suspense fallback={<LoadingSkeletonCourses/>}>
            <RenderCourses />
           </Suspense>

        </div>
    </div>
  )
}


async function RenderCourses() {
    const courses = await getAllCourses()

    return (
        <div className='grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {
                courses.map((course) => (
                   <PublicCourseCard key={course.id} data={course} />
                ))
            }

        </div>
    )
}


const LoadingSkeletonCourses = () => {
    return (
        <div className='grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {
                Array.from({length:6}).map((_,index) => (
                    <LoadingCourses key={index} />
                ))

            }
        </div>
    )
}
