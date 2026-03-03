'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GridScan } from './GridScan'
import Link from 'next/link'

const patches = [
  { id: 1, title: 'გუნდი', link: '/features/mentors' },
  { id: 2, title: 'კარიერა' },
  { id: 3, title: 'პროფესიული კურსები' },
  { id: 4, title: 'კურსები', size: 'wide' },
  { id: 5, title: 'ჩვენს შესახებ', size: 'wide' },
  { id: 6, title: 'პარტნიორები', size: 'thin' },
  { id: 7, title: 'გალერეა', size: 'thin' },
  { id: 8, title: 'კონტაქტი', size: 'thin' },
  { id: 9, title: 'სოციალური მედია', size: 'thin' },
]

const glassColors = {
  1: 'rgba(252, 211, 77, 0.18)', 
  2: 'rgba(110, 231, 183, 0.18)', 
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
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const cardVariants = {
  hidden: (id) => ({
    opacity: 0,
    x: id % 3 === 0 ? 80 : id % 3 === 1 ? -80 : 0,
    y: id % 3 === 2 ? 80 : 20,
    scale: 0.85,
    rotate: id % 2 === 0 ? 2 : -2,
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 45,
      damping: 14,
    }
  }
}

const Main = () => {

  const getSizeClass = (size) => {
    switch (size) {
      case 'wide': return 'lg:col-span-2 sm:col-span-2'
      case 'thin': return 'lg:col-span-1 sm:col-span-1'
      default: return 'col-span-1'
    }
  }

  return (
    <div className="relative w-full min-h-screen bg-slate-950 flex items-center justify-center p-4 md:p-8 overflow-x-hidden overflow-y-auto">
      
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

      <div className="relative z-10 w-full max-w-[1200px] py-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 italic"
        >
          {patches.map((patch) => {
            const cardContent = (
              <motion.div
                custom={patch.id}
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.02, 
                  y: -8,
                  backgroundColor: "rgba(255, 255, 255, 0.25)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
                }}
                whileTap={{ scale: 0.98 }}
                style={{ 
                  backgroundColor: glassColors[patch.id],
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.3)'
                }}
                className={`
                  ${getSizeClass(patch.size)}
                  min-h-[120px] lg:min-h-[160px] 
                  rounded-[1.5rem] lg:rounded-[2rem] flex items-center justify-center
                  text-white text-lg lg:text-2xl font-extralight cursor-pointer tracking-widest
                  transition-all duration-500 relative group overflow-hidden px-6 lg:px-8
                `}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <span className="relative z-10 drop-shadow-2xl text-center leading-tight uppercase select-none">
                  {patch.title}
                </span>
              </motion.div>
            )

            return (
              <React.Fragment key={patch.id}>
                {patch.link ? (
                  <Link href={patch.link} passHref>
                    {cardContent}
                  </Link>
                ) : (
                  cardContent
                )}
              </React.Fragment>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}

export default Main