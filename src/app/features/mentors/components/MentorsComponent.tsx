'use client'

import React from 'react'
import Card from './MentorsCard'
import { motion, Variants } from 'framer-motion'
import Link from 'next/link'

interface Mentor {
  id: number
  name: string
  role: string
  description: string
  image: string
}

const mentors: Mentor[] = [
  { id: 1, name: "დემიდ ფასიეშვილი", role: "აკადემიის დამფუძნებელი", description: "", image: "/mentors1.jpeg" },
  { id: 2, name: "ზურაბ მესხიძე", role: "აკადემიის დამფუძნებელი", description: "", image: "/mentors3.jpeg" },
  { id: 3, name: "კახი კახიძე", role: "სტაჟირების პროგრამის მენეჯერი", description: "", image: "/kaxi.jpg" },
  { id: 4, name: "სოფიო დუმბაძე", role: "აკადემიის მასწავლებელი", description: "", image: "/mentorsofio.jpg" },
  { id: 5, name: "სოფია სურმანიძე", role: "მოდის დიზაინის მენეჯერი", description: "", image: "/sofia.jpg" },
  { id: 6, name: "დიანა ანანიძე", role: "აკადემიის მასწავლებელი", description: "", image: "/mentordiana.jpg" },
]

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 1, ease: 'easeOut' },
  }),
}

const MentorsComponent: React.FC = () => {
  return (
    <section className="bg-[#0F172A] min-h-screen px-6 flex flex-col justify-center items-center md:py-20 py-10">

      <div className="mb-12 w-full max-w-7xl flex flex-col md:flex-row justify-between items-center">
        
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-4xl md:text-5xl text-white font-bold mb-4">
            ჩვენი <span className="text-cyan-500">მენტორები</span>
          </h2>
          <div className="h-1.5 w-20 bg-cyan-500 mx-auto md:mx-0 rounded-full" />
        </div>

        <Link href="/" passHref>
          <button className="px-6 cursor-pointer py-3 bg-white/10 backdrop-blur-md text-cyan-400 font-semibold rounded-lg border border-cyan-400 hover:bg-cyan-400 hover:text-[#0F172A] transition-all duration-300 shadow-md">
            მთავარი გვერდი
          </button>
        </Link>

      </div>

      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-8 justify-center items-center">
          {mentors.map((mentor, index) => (
            <motion.div
              key={mentor.id}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <Card mentor={mentor} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MentorsComponent