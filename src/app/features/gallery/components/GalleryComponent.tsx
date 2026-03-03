'use client'

import React, { useState, useEffect } from 'react'
import CardSwap, { Card } from './GallerySwap'
import Link from 'next/link'
import { motion } from 'framer-motion'

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

export default function GalleryCardSwap() {
  const [cardSize, setCardSize] = useState({ width: 500, height: 380 })
  const [cardDist, setCardDist] = useState(70)
  const [verticalDist, setVerticalDist] = useState(40)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth

      if (width < 360) {
        setCardSize({ width: 280, height: 210 })
        setCardDist(40)
        setVerticalDist(25)
      } else if (width < 480) {
        setCardSize({ width: 320, height: 240 })
        setCardDist(45)
        setVerticalDist(30)
      } else if (width < 640) {
        setCardSize({ width: 380, height: 260 })
        setCardDist(50)
        setVerticalDist(35)
      } else if (width < 1024) {
        setCardSize({ width: 450, height: 320 })
        setCardDist(60)
        setVerticalDist(40)
      } else {
        setCardSize({ width: 500, height: 380 })
        setCardDist(70)
        setVerticalDist(40)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <main className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4 sm:px-6 py-12 lg:py-20 overflow-hidden">
      <div className="px-4 lg:px-16 w-full flex flex-col-reverse lg:flex-row gap-12 lg:gap-16 items-center justify-center lg:justify-between">
        
        {/* ტექსტი */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-6 sm:space-y-8 text-center lg:text-left order-2 lg:order-1 w-full lg:max-w-lg"
        >
          <span className="text-cyan-500 font-mono tracking-widest uppercase text-xs sm:text-sm block">
            ჩვენი ცხოვრება
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl text-white font-black leading-[1.1] tracking-tight">
            დაათვალიერე <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              აკადემიის
            </span> გალერეა
          </h2>
          <div className="h-1.5 w-20 sm:w-24 bg-cyan-500 rounded-full mb-6 mx-auto lg:mx-0 shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
          <p className="text-gray-400 text-base sm:text-lg md:text-xl leading-relaxed max-w-md mx-auto lg:mx-0">
            გაეცანით ჩვენს ყოველდღიურობას, სასწავლო პროცესს და იმ გარემოს, სადაც იქმნება მომავალი ტექნოლოგიები.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <Link href="/" passHref className="w-full sm:w-auto">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-3.5 bg-white/5 cursor-pointer backdrop-blur-lg text-cyan-400 font-bold rounded-xl border border-cyan-500/50 hover:bg-cyan-500 hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
              >
                მთავარი გვერდი
              </motion.button>
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative flex justify-center items-center order-1 lg:order-2 py-10 sm:py-0 w-full lg:max-w-[600px]"
        >
          <div className="absolute w-48 h-48 sm:w-72 sm:h-72 bg-cyan-500/10 rounded-full blur-[80px] sm:blur-[120px] -z-10" />
          
          <CardSwap
            width={cardSize.width}
            height={cardSize.height}
            cardDistance={cardDist}
            verticalDistance={verticalDist}
            delay={2500}
            pauseOnHover
            skewAmount={3}
          >
            {allPhotos.map(photo => (
              <Card
                key={photo.id}
                customClass="cursor-grab active:cursor-grabbing"
              >
                <div className="relative w-full h-full rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl group">
                  <img
                    src={photo.image}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/10 to-transparent opacity-90 flex flex-col justify-end p-5 sm:p-8">
                    <span className="text-cyan-400 text-[10px] sm:text-xs font-mono uppercase tracking-widest mb-1 sm:mb-2 block">
                      {photo.category}
                    </span>
                    <h3 className="text-white text-lg sm:text-2xl font-black">
                      {photo.title}
                    </h3>
                  </div>
                </div>
              </Card>
            ))}
          </CardSwap>
        </motion.div>

      </div>
    </main>
  )
}