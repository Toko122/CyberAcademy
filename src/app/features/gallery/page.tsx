import React from 'react'
import PCCard from './components/PCCard'

const GalleryPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <PCCard
        name="Kakhi Kakhidze"
        role="Web Project Mentor"
        avatar='/kaxi.jpg'
        linkedin="https://linkedin.com/in/kakhi-kakhidze"
      />
    </div>
  )
}

export default GalleryPage