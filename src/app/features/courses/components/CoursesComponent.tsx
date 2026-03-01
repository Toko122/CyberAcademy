import Link from 'next/link'
import React from 'react'

interface Course {
  id: number
  href: string
  title: string
  description: string
  image: string
  price: string
  duration: string
}

const courses: Course[] = [
     {
    id: 1,
    href: '/features/courses',
    title: '3D Design and Modeling',
    description: '',
    image: '/3ddesign.jpg',
    price: '2700 ₾',
    duration: '9 თვე'
  },
   {
    id: 2,
    href: '/features/courses',
    title: 'IT სპეციალისტი',
    description: 'პერსონალური კომპიუტერის აპარატურული და პროგრამული უზრუნველყოფა',
    image: '/cur-1.jpg',
    price: '2700 ₾',
    duration: '9 თვე'
  },
  {
    id: 3,
    href: '/features/courses',
    title: 'ვებ ტექნოლოგიები',
    description: 'HTML + CSS - WEB გვერდების მართვა და სტილების შექმნა',
    image: '/course-3.jpg',
    price: '2700 ₾',
    duration: '9 თვე'
  },
  {
    id: 4,
    href: '/features/courses',
    title: 'გრაფიკული დიზაინი',
    description: 'ვექტორული გრაფიკა პროგრამა Adobe Illustrator CorelDraw-ის ბაზაზე',
    image: '/course-2.jpg',
    price: '2700 ₾',
    duration: '9 თვე'
  },
  {
    id: 5,
    href: '/features/courses',
    title: 'პროგრამირების საფუძვლები და ალგორითმები',
    description: 'დაპროგრამების საფუძვლები C++-ის ბაზაზე',
    image: '/course-img1.jpeg',
    price: '2700 ₾',
    duration: '9 თვე'
  },
]

const CourseCard = ({ id, href, title, description, image, price, duration }: Course) => {
  return (
    <Link
      href={`${href}/${id}`}
      className="group relative bg-[#1E293B]/50 border border-white/10 rounded-2xl p-4 flex flex-col transition-all duration-300 hover:bg-[#1E293B] hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.2)]"
    >
      <div className="relative w-full aspect-video overflow-hidden rounded-xl mb-5">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 bg-cyan-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
          {duration}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors mb-2">
            {title}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
          <span className="text-xl font-bold text-white italic">{price}</span>
          <span className="text-cyan-500 font-medium text-sm flex items-center gap-1 group-hover:underline">
            დეტალურად →
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function AllCoursesPage() {
  return (
    <main className="min-h-screen bg-[#0F172A] pb-30 pt-28 px-6">
      <section className="max-w-7xl mx-auto mt-10 flex flex-col items-center">
        
        <div className="mb-16 flex flex-col items-center">
          <h1 className="text-3xl md:text-5xl text-white font-bold mb-4">
            ყველა <span className="text-cyan-500">კურსი</span>
          </h1>
          <p className="text-gray-400 max-w-2xl text-center">
            შეარჩიეთ თქვენთვის სასურველი მიმართულება და დაიწყეთ კარიერული წინსვლა ჩვენთან ერთად.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>

      </section>
    </main>
  )
}