import React from 'react'
import CourseCreationPage from './components/course-creation-page'
import { requireAdmin } from '@/data/admin/require-admin'

export default async  function page() {
  await requireAdmin()
  return (
    <CourseCreationPage />
  )
}
