'use client'
import EmptyState from "@/components/general/empty-state"
import AdminCourseCard from "./admin-course-card"
import { useAdminGetRecentCourses } from "@/data/admin/hooks/use-admin"

 export function RenderRecentCourses() {
 const { data } = useAdminGetRecentCourses()
  if(data.length === 0){
    return (
      <EmptyState buttonText='Create Course' description='You have not created any courses yet.' title='No Courses' href='/admin/courses/create' />
    )
  }

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
      {
        data.map((course) => (
          <AdminCourseCard data={course} key={course.id} />
        ))
      }
    
    </div>
  )
  
}