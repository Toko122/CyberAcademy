'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { MapPin, Clock, CreditCard, CheckCircle2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const courses = [
  { id: 1, title: '3D Design and Modeling', description: 'შეისწავლეთ სამგანზომილებიანი მოდელირება და დიზაინი თანამედროვე სტანდარტებით.', image: '/3ddesign.jpg', price: '2700 ₾', duration: '9 თვე' },
  { id: 2, title: 'IT სპეციალისტი', description: 'პერსონალური კომპიუტერის აპარატურული და პროგრამული უზრუნველყოფა, ქსელების საფუძვლები.', image: '/cur-1.jpg', price: '2700 ₾', duration: '9 თვე' },
  { id: 3, title: 'ვებ ტექნოლოგიები', description: 'HTML + CSS - WEB გვერდების მართვა და სტილების შექმნა. სრული პრაქტიკული კურსი.', image: '/course-3.jpg', price: '2700 ₾', duration: '9 თვე' },
  { id: 4, title: 'გრაფიკული დიზაინი', description: 'ვექტორული გრაფიკა პროგრამა Adobe Illustrator CorelDraw-ის ბაზაზე.', image: '/course-2.jpg', price: '2700 ₾', duration: '9 თვე' },
  { id: 5, title: 'პროგრამირების საფუძვლები და ალგორითმები', description: 'დაპროგრამების საფუძვლები C++-ის ბაზაზე. ალგორითმული აზროვნების განვითარება.', image: '/course-img1.jpeg', price: '2700 ₾', duration: '9 თვე' },
]

const CourseDetails = () => {
  const params = useParams()
  const course = courses.find((c) => c.id === Number(params.id))

  if (!course) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center text-white p-6">
        <h2 className="text-2xl mb-4 text-center">კურსი ვერ მოიძებნა</h2>
        <Link href="/features/courses" className="text-cyan-500 hover:underline">უკან დაბრუნება</Link>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#0F172A] pt-34 md:pt-38 pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        
        <Link href="/features/courses" className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-500 transition-colors mb-8 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          უკან ყველა კურსზე
        </Link>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          <div className="w-full lg:w-2/5 order-1 lg:order-2 lg:sticky lg:top-32 h-fit z-10">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              
              <div className="relative bg-[#1E293B] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-64 md:h-80 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                <div className="p-6 space-y-6">
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3 text-gray-400">
                      <Clock size={20} className="text-cyan-500" />
                      <span>ხანგრძლივობა</span>
                    </div>
                    <span className="text-white font-bold">{course.duration}</span>
                  </div>

                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3 text-gray-400">
                      <CreditCard size={20} className="text-cyan-500" />
                      <span>სრული ღირებულება</span>
                    </div>
                    <span className="text-2xl font-black text-cyan-400">{course.price}</span>
                  </div>

                  <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
                    <p className="text-cyan-200 text-sm text-center font-medium">
                      🚀 კურსის დასრულების შემდეგ გაიცემა სერტიფიკატი
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-3/5 order-2 lg:order-1 space-y-8 relative z-0">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                {course.title.split(' ')[0]} <span className="text-cyan-500">{course.title.split(' ').slice(1).join(' ')}</span>
              </h1>
              <div className="h-1.5 w-20 bg-cyan-500 rounded-full" />
            </div>

            <div className="space-y-6 text-gray-300 leading-relaxed text-lg">
              <p className="font-semibold text-white">
                {course.description}
              </p>
              <p>
                გსურთ შეისწავლოთ {course.title}? ნახოთ მათი შესაძლებლობები და შეძლოთ გამოყენება? 
                მაშინ დარეგისტრირდი კიბერ აკადემიის შესაბამის კურსზე და შეისწავლე ეს დარგი საფუძვლიანად.
              </p>
              <p>
                მიმდინარე კურსის ფარგლებში თქვენ გაეცნობით რეალურ შესაძლებლობებს 
                და შეძლებთ გამოიყენოთ მიღებული ცოდნა ნებისმიერ პროფესიულ საქმიანობაში.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-4 shadow-xl">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="text-cyan-500" />
                კურსი მოიცავს:
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500">•</span> სიღრმისეული თეორიული მასალა
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500">•</span> პრაქტიკული სამუშაოები პროგრამებში
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500">•</span> რეალურ ქეისებზე დაფუძნებული სწავლება
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500">•</span> პორტფოლიოს მომზადება
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-center pt-6">
              <div className="w-full sm:w-auto flex items-center gap-3 text-gray-300 bg-white/5 px-5 py-3 rounded-xl border border-white/10">
                <MapPin className="text-cyan-500" size={20} />
                <span>ბათუმი, აღმაშენებლის 13ბ</span>
              </div>
              <button className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 px-10 rounded-xl transition-all active:scale-95 shadow-lg shadow-cyan-600/20">
                რეგისტრაცია
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}

export default CourseDetails