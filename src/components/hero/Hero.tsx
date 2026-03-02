import Link from 'next/link'
import React from 'react'

interface Course {
  id: number
  href: string
  title: string
  description: string
  image: string
}

const courses: Course[] = [
  {
    id: 3,
    href: '/features/courses',
    title: 'ვებ ტექნოლოგიები',
    description: 'HTML + CSS - WEB გვერდების მართვა და სტილების შექმნა',
    image: '/course-3.jpg',
  },
  {
    id: 4,
    href: '/features/courses',
    title: 'გრაფიკული დიზაინი',
    description: 'ვექტორული გრაფიკა პროგრამა Adobe Illustrator CorelDraw-ის ბაზაზე',
    image: '/course-2.jpg',
  },
  {
    id: 5,
    href: '/features/courses',
    title: 'პროგრამირების საფუძვლები და ალგორითმები',
    description: 'დაპროგრამების საფუძვლები C++-ის ბაზაზე',
    image: '/course-img1.jpeg',
  },
]

const CourseCard = ({
  id,
  href,
  title,
  description,
  image,
}: Course) => {
  return (
    // <Link
    //   key={id}
    //   href={`${href}/${id}`}
    //   className="group relative bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col transition-all duration-300 hover:bg-white/10 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.2)]"
    // >
    //   <div className="relative w-full aspect-video overflow-hidden rounded-xl mb-6">
    //     <img
    //       src={image}
    //       alt={title}
    //       className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
    //     />
    //     <div className="absolute inset-0 bg-gradient-to-t from-[#16213B] to-transparent opacity-60" />
    //   </div>

    //   <div className="space-y-3">
    //     <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
    //       {title}
    //     </h3>

    //     <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
    //       {description}
    //     </p>

    //     <div className="pt-4 flex items-center text-cyan-500 font-medium text-sm">
    //       ვრცლად ნახვა
    //     </div>
    //   </div>
    // </Link>
    <></>
  )
}

export default function CoursesSection() {
  return (
    // <main className="min-h-screen bg-[#0F172A] pb-10 pt-38 px-6">
    //   <section className="max-w-7xl mx-auto">
    //     <div className="flex flex-col gap-12 items-center">

    //       <div className="text-center space-y-4">
    //         <h1 className="text-4xl md:text-5xl text-white font-bold tracking-tight">
    //           ჩვენი <span className="text-cyan-500">კურსები</span>
    //         </h1>
    //         <div className="h-1.5 w-24 bg-cyan-500 mx-auto rounded-full" />
    //       </div>

    //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
    //         {courses.map((course) => (
    //           <CourseCard key={course.id} {...course} />
    //         ))}
    //       </div>

    //       <Link
    //         href="/features/courses"
    //         className="group relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-200 bg-cyan-600 rounded-full hover:bg-cyan-500 hover:shadow-lg hover:shadow-cyan-500/30 active:scale-95"
    //       >
    //         ყველა კურსის ნახვა
    //       </Link>

    //     </div>
    //   </section>
    // </main>
   <>
    
   </>
  )
}