'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { GridScan } from './GridScan'
import Link from 'next/link'
// შეცვალე გზა შენი ფაილების სტრუქტურის მიხედვით
import Card from '../../app/features/contact/components/Links'

const patches = [
  { id: 1, title: 'გუნდი', link: '/features/group', span: 'col-span-1 lg:col-span-4 lg:order-1' },
  { id: 2, title: 'LOGO', link: '/', span: 'col-span-1 lg:col-span-4 order-first lg:order-2', isLogo: true },
  { id: 3, title: 'პროფესიული კურსები', link: '/features/courses', span: 'col-span-1 lg:col-span-4 lg:order-3' },
  { id: 4, title: 'კურსები', link: '/features/courses', span: 'col-span-1 lg:col-span-6 lg:order-4' },
  { id: 5, title: 'ჩვენს შესახებ', link: '/features/courses', span: 'col-span-1 lg:col-span-6 lg:order-5' },
  { id: 6, title: 'პარტნიორები', link: '/features/partners', span: 'col-span-1 lg:col-span-3 lg:order-6' },
  { id: 7, title: 'გალერეა', link: '/features/gallery', span: 'col-span-1 lg:col-span-3 lg:order-7' },
  { id: 8, title: 'კონტაქტი', link: '/features/contact', span: 'col-span-1 lg:col-span-3 lg:order-8' },
  { id: 9, title: 'კარიერა', link: '/features/courses', span: 'col-span-1 lg:col-span-3 lg:order-9' }, 
].map((patch) => patch.id === 5 ? { ...patch, link: '/features/aboutUs' } : patch)

const glassColors = {
  1: 'rgba(252, 211, 77, 0.18)',
  2: 'rgba(255, 255, 255, 0.05)',
  3: 'rgba(252, 165, 165, 0.18)',
  4: 'rgba(147, 197, 253, 0.18)',
  5: 'rgba(252, 211, 77, 0.18)',
  6: 'rgba(110, 231, 183, 0.18)',
  7: 'rgba(252, 165, 165, 0.18)',
  8: 'rgba(252, 211, 77, 0.18)',
  9: 'rgba(110, 231, 183, 0.18)',
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
}

const cardVariants = {
  hidden: () => ({
    opacity: 0,
    y: 18,
    scale: 0.98,
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 18,
    }
  }
}

const Main = () => {
  return (
    <div className="relative w-full min-h-screen bg-slate-950 flex items-center justify-center p-3 sm:p-4 md:p-8 overflow-y-auto">
      
      <div className="fixed inset-0 z-0">
        <GridScan
          sensitivity={0.6}
          lineThickness={1.2}
          linesColor="#00eaff"
          gridScale={0.12}
          scanColor="#3b82f6"
          scanOpacity={0.9}
          enablePost
          bloomIntensity={1.4}
          chromaticAberration={0.003}
          noiseIntensity={0.015}
        />
      </div>

      <div className="relative z-10 w-full max-w-[1200px] py-10 flex flex-col items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-6 italic w-full"
        >
          {patches.map((patch) => {
            const isLogoCard = patch.isLogo;

            const cardContent = (
              <motion.div
                custom={patch.id}
                variants={cardVariants}
                whileHover={{
                  scale: 1.05,
                  y: isLogoCard ? -5 : -8,
                  backgroundColor: isLogoCard ? "transparent" : "rgba(255, 255, 255, 0.25)",
                  boxShadow: isLogoCard ? "none" : "0 20px 40px rgba(0,0,0,0.4)"
                }}
                whileTap={{ scale: 0.98 }}
                style={{
                  backgroundColor: isLogoCard ? 'transparent' : glassColors[patch.id],
                  backdropFilter: isLogoCard ? 'none' : 'blur(16px)',
                  border: isLogoCard ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderTop: isLogoCard ? 'none' : '1px solid rgba(255, 255, 255, 0.3)'
                }}
                className={`
                  min-h-[120px] lg:min-h-[160px]
                  rounded-[1.5rem] lg:rounded-[2rem] flex items-center justify-center
                  text-white text-base sm:text-lg lg:text-2xl font-extralight cursor-pointer tracking-wide sm:tracking-widest
                  transition-all duration-500 relative group overflow-hidden px-4 sm:px-6 lg:px-8
                `}
              >
                {!isLogoCard && (
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                )}
                
                <div className="relative z-10 flex items-center justify-center w-full h-full">
                  {isLogoCard ? (
                    <Image 
                      src="/cyberAcademy.png" 
                      alt="Cyber Academy Logo" 
                      width={220}
                      height={120}
                      className="h-20 lg:h-32 w-auto object-contain invert brightness-[10%] contrast-100 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                    />
                  ) : (
                    <span className="drop-shadow-2xl text-center leading-tight uppercase select-none break-words max-w-full">
                      {patch.title}
                    </span>
                  )}
                </div>
              </motion.div>
            )

            return (
              <div key={patch.id} className={patch.span}>
                {patch.link ? (
                  <Link href={patch.link} passHref className="block h-full">
                    {cardContent}
                  </Link>
                ) : (
                  cardContent
                )}
              </div>
            )
          })}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.45 }}
          className="mt-10 sm:mt-16 flex flex-col items-center space-y-6 max-w-full"
        >
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
          <p className="text-blue-400/60 text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.5em] font-bold italic text-center break-words">
            შემოგვიერთდით
          </p>
          <Card />
        </motion.div>
      </div>
    </div>
  )
}

export default Main
