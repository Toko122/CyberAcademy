import React from 'react'
import CreatePartnerComponent from './components/CreatePartnerComponent'
import ProtectedRoute from '@/lib/ProtectedRoute'

const AdminPartners = () => {
  return (
    <ProtectedRoute>
      <CreatePartnerComponent />
    </ProtectedRoute>
  )
}

export default AdminPartners
