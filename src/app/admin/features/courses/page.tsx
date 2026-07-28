import React from 'react'
import CreateCourseComponent from './components/CreateCourseComponent'
import ProtectedRoute from '@/lib/ProtectedRoute'
import { listTeachers } from '@/lib/repositories/content'

export const dynamic = "force-dynamic";

const AdminCourses = async () => {
  const teachers = await listTeachers();
  return (
    <ProtectedRoute>
        <CreateCourseComponent teachers={teachers} />
    </ProtectedRoute>
  )
}

export default AdminCourses
