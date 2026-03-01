import Link from 'next/link'
import React from 'react'

interface MentorItem {
  id: number
  href: string
  image: string
}

const mentors: MentorItem[] = [
  {
    id: 1,
    href: '/mentors/1',
    image: '/kaxi.jpg',
  },
  {
    id: 2,
    href: '/mentors/2',
    image: '/mentors1.jpeg',
  },
  {
    id: 3,
    href: '/mentors/3',
    image: '/mentors3.jpeg',
  },
]

const MentorCard = ({ id, href, image }: MentorItem) => {
  return (
    <Link
      href={href}
      className="group relative bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col transition-all duration-300 hover:bg-white/10 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(34,_211,_238,_0.15)]"
    >
      <div className="relative w-full aspect-[4/5] overflow-hidden rounded-xl">
        <img
          src={image}
          alt={`Mentor ${id}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-6 py-2 rounded-full text-sm font-medium">
            პროფილი
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function MentorsSection() {
  return (
    <section className="bg-[#0F172A] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-12 items-center">
          
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl text-white font-bold tracking-tight">
              ჩვენი <span className="text-cyan-500">მენტორები</span>
            </h2>
            <div className="h-1.5 w-24 bg-cyan-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {mentors.map((mentor) => (
              <MentorCard key={mentor.id} {...mentor} />
            ))}
          </div>

          <Link href={'/features/mentors'} className="group relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-200 bg-cyan-600 rounded-full hover:bg-cyan-500 hover:shadow-lg hover:shadow-cyan-500/30 active:scale-95" >ყველას ნახვა</Link>

        </div>
      </div>
    </section>
  )
}