'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GridScan } from './GridScan'

const patches = [
  { id: 1, title: 'გუნდი' },
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
    rotate: id % 2 === 0 ? 4 : -4,
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
  const [active, setActive] = useState(null)

  const getSizeClass = (size) => {
    switch (size) {
      case 'wide': return 'lg:col-span-2'
      case 'thin': return 'lg:col-span-1'
      default: return ''
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950 flex items-center justify-center">
      
      <div className="fixed inset-0 z-0">
        <GridScan
          sensitivity={0.55}
          lineThickness={1}
          linesColor="#392e4e"
          gridScale={0.1}
          scanColor="#FF9FFC"
          scanOpacity={0.4}
          enablePost
          bloomIntensity={0.6}
          chromaticAberration={0.002}
          noiseIntensity={0.01}
        />
      </div>

      <div className="relative z-10 w-full max-w-[1000px] px-6 py-4">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 italic"
        >
          {patches.map((patch) => (
            <React.Fragment key={patch.id}>
              <motion.div
                custom={patch.id}
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.03, 
                  y: -5,
                  backgroundColor: "rgba(255, 255, 255, 0.22)",
                }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActive(active === patch.id ? null : patch.id)}
                style={{ 
                  backgroundColor: glassColors[patch.id],
                  backdropFilter: 'blur(14px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.25)'
                }}
                className={`
                  ${getSizeClass(patch.size)}
                  h-[110px] lg:h-[125px] rounded-[1.8rem] flex items-center justify-center
                  text-white text-lg font-extralight cursor-pointer tracking-widest
                  transition-all duration-500 relative group overflow-hidden px-6
                `}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 drop-shadow-2xl text-center leading-tight">
                  {patch.title}
                </span>
              </motion.div>

              <AnimatePresence>
                {active === patch.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 80, damping: 20 }}
                    className="col-span-full overflow-hidden"
                  >
                    <motion.div
                      style={{ 
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                        backdropFilter: 'blur(25px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)'
                      }}
                      className="rounded-[2rem] p-8 my-3 text-white shadow-2xl flex flex-col items-center justify-center border-t border-white/10"
                    >
                       <h2 className="text-2xl font-thin uppercase tracking-[0.3em] mb-4">{patch.title}</h2>
                       <div className="h-[1px] w-16 bg-white/20 mb-4" />
                       <p className="text-white/60 text-sm font-light text-center max-w-md leading-relaxed">
                          თქვენი არჩეული სექციის დეტალური აღწერა გამოჩნდება აქ, კომპაქტურ და ელეგანტურ სტილში.
                       </p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default Main