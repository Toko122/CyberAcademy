import React from 'react'
import CreateGalleryComponent from './components/CreateGalleryComponent'
import ProtectedRoute from '@/lib/ProtectedRoute'

const AdminGallery = () => {
  return (
    <ProtectedRoute>
      <CreateGalleryComponent />
    </ProtectedRoute>
  )
}

export default AdminGallery
