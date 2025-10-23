import { requireAdmin } from '@/data/admin/require-admin'
import React from 'react'
import DeleteCourseRoute from './components/delete-course'

export default async function page() {
  await requireAdmin()
  return (
    <DeleteCourseRoute />
  )
}
