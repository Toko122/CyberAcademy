import Link from 'next/link'
import React from 'react'

interface GalleryItem {
  id: number
  href: string
  image: string
}

const galleries: GalleryItem[] = [
  {
    id: 1,
    href: '/features/gallery',
    image: '/gallery 6.jpg',
  },
  {
    id: 2,
    href: '/features/gallery',
    image: '/gallery 1.jpg',
  },
  {
    id: 3,
    href: '/features/gallery',
    image: '/gallery 2.jpg',
  },
]

const GalleryCard = ({ id, href, image }: GalleryItem) => {
  return (
    <Link
      href={href}
      className="group relative bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col transition-all duration-300 hover:bg-white/10 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.2)]"
    >
      <div className="relative w-full aspect-square overflow-hidden rounded-xl">
        <img
          src={image}
          alt={`Gallery image ${id}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#16213B] to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <span className="bg-cyan-500/20 backdrop-blur-md border border-cyan-500/50 text-white px-4 py-2 rounded-full text-sm font-medium">
                ნახვა
             </span>
        </div>
      </div>
    </Link>
  )
}

export default function GallerySection() {
  return (
    <section className="bg-[#0F172A] pb-20 pt-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-12 items-center">
          
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl text-white font-bold tracking-tight">
              ჩვენი <span className="text-cyan-500">გალერეა</span>
            </h2>
            <div className="h-1.5 w-24 bg-cyan-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {galleries.map((item) => (
              <GalleryCard key={item.id} {...item} />
            ))}
          </div>

          <Link
            href="/features/gallery"
            className="group relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-200 bg-cyan-600 rounded-full hover:bg-cyan-500 hover:shadow-lg hover:shadow-cyan-500/30 active:scale-95"
          >
            სრული გალერეა
          </Link>

        </div>
      </div>
    </section>
  )
}