import EmptyState from '@/components/general/empty-state'
import { getAllCourses } from '@/data/course/get-all-courses'
import { getEnrolledCourses } from '@/data/user/get-enrolled-courses'
import React from 'react'
import PublicCourseCard from '../(public)/_component/public-course-card'


export default async  function DashboardPage() {
  const [courses, enrolledCourses] = await Promise.all([
    getAllCourses(),
    getEnrolledCourses()
  ]) //parallel fetching
  return (
<>
<div className='flex flex-col gap-2'>
  <h1 className='text-3xl font-bold '>
    Enrolled Courses
  </h1>
  <p className='text-muted-foreground'>
    Here you can see all the courses you are enrolled in.

  </p>
</div>
{
  enrolledCourses.length === 0 ? (
    <EmptyState title='No Enrolled Courses' buttonText='Browse Courses' description='You have not enrolled in any courses yet.' href='/courses' />
  ) :(
   <p>
    The courses you are enrolled in will be displayed here.
   </p>
  )
}

<section className='mt-10'>
  <div className='flex flex-col gap-2 mb-5'>
  <h1 className='text-3xl font-bold '>
    Available Courses
  </h1>
  <p className='text-muted-foreground'>
    Here you can see all the courses that are available for enrollment.

  </p>
</div>
{

  courses.filter(course => !enrolledCourses.some(enrolled => enrolled.course.id === course.id)).length === 0 ? (
    <EmptyState title='No Available Courses' buttonText='Browse Courses' description='You have enrolled in all available courses.' href='/courses' />
  ) :(
   <div className='grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-4 '>
{
  courses.filter(course => !enrolledCourses.some(enrolled => enrolled.course.id === course.id)).map(course => (
    <PublicCourseCard key={course.id} data={course} />
  ))

}
   </div>
  )
}


</section>
</>
  )
}
