import React from 'react'
import CreateGroupComponent from './components/CreateGroupComponent'
import ProtectedRoute from '@/lib/ProtectedRoute'

const AdminGroup = () => {
  return (
    <ProtectedRoute>
      <CreateGroupComponent />
    </ProtectedRoute>
  )
}

export default AdminGroup
