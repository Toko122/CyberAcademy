import React from 'react'
import CreateCourseComponent from './components/CreateCourseComponent'
import ProtectedRoute from '@/lib/ProtectedRoute'

const AdminCourses = () => {
  return (
    <ProtectedRoute>
        <CreateCourseComponent />
    </ProtectedRoute>
  )
}

export default AdminCourses