import React from 'react'
import AdminDashboardComponent from './components/AdminDashboard'
import ProtectedRoute from '@/lib/ProtectedRoute'

const AdminDashboard = () => {
  return (
    <ProtectedRoute>
        <AdminDashboardComponent />
    </ProtectedRoute>
  )
}

export default AdminDashboard