import Link from 'next/link'
import React from 'react'

interface GalleryImage {
  id: number
  image: string
  title: string
  category: string
}

const allPhotos: GalleryImage[] = [
  { id: 1, image: '/gallery 6.jpg', title: 'სასწავლო პროცესი', category: 'Design' },
  { id: 2, image: '/gallery 1.jpg', title: 'ვორქშოპი', category: 'Coding' },
  { id: 3, image: '/gallery 2.jpg', title: 'პრეზენტაცია', category: 'Web' },
  { id: 4, image: '/kaxi.jpg', title: 'სამუშაო გარემო', category: 'Office' },
  { id: 5, image: '/gallery 5.jpg', title: 'კომპიუტერები', category: 'Life' },
]

export default function GalleryComponent() {
  return (
    <main className="min-h-screen bg-[#16213B] pt-38 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <div className="space-y-2">
            <Link 
              href="/" 
              className="text-cyan-500 text-sm hover:underline flex items-center gap-2"
            >
              ← მთავარზე დაბრუნება
            </Link>
            <h1 className="text-4xl md:text-5xl text-white font-bold">
              ფოტო <span className="text-cyan-500">გალერეა</span>
            </h1>
            <div className="h-1 w-20 bg-cyan-500 rounded-full" />
          </div>
          
          <p className="text-gray-400 max-w-md text-center md:text-right">
            ჩვენი აკადემიის ყოველდღიურობა, სასწავლო პროცესი და მნიშვნელოვანი ღონისძიებები ერთ სივრცეში.
          </p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {allPhotos.map((photo) => (
            <div 
              key={photo.id} 
              className="relative group overflow-hidden rounded-2xl border border-white/10 break-inside-avoid"
            >
              <img
                src={photo.image}
                alt={photo.title}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                <span className="text-cyan-400 text-xs font-mono mb-1">{photo.category}</span>
                <h3 className="text-white text-xl font-bold">{photo.title}</h3>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}