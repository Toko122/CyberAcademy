'use client'

import React, { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface PCCardProps {
  name: string
  role: string
  avatar: string
  linkedin?: string
}

const PCCard: React.FC<PCCardProps> = ({ name, role, avatar, linkedin }) => {
  const cardRef = useRef<HTMLDivElement>(null)
  
  // Motion values
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // აჩქარებული ფიზიკა: Stiffness 300 და Damping 20 ხდის მოძრაობას ძალიან სწრაფს და ზამბარასავით მოქნილს
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 })

  // როტაციის კუთხეები - ოდნავ გავზარდეთ 25 გრადუსამდე უფრო მკვეთრი 3D-სთვის
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["25deg", "-25deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-25deg", "25deg"])

  // განათების (Glare) მოძრაობა
  const glareOpacity = useTransform(mouseXSpring, [-0.5, 0.5], [0.6, 0.1])
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    
    // მაუსის კოორდინატების გამოთვლა
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    
    x.set(mouseX / width - 0.5)
    y.set(mouseY / height - 0.5)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <div className="[perspective:1500px] p-10">
      <motion.section
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d", // აუცილებელია შიდა 3D ეფექტებისთვის
        }}
        className="relative w-80 h-[460px] rounded-[30px] border border-white/20 bg-gray-900/40 backdrop-blur-2xl shadow-2xl cursor-pointer overflow-visible"
      >
        {/* ფონური ანიმაციური ფერები */}
        <div className="absolute inset-0 rounded-[30px] overflow-hidden z-0">
          <div className="absolute top-[-20%] left-[-20%] w-[100%] h-[100%] bg-blue-600/20 blur-[100px] animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-20%] w-[100%] h-[100%] bg-purple-600/20 blur-[100px] animate-pulse" />
        </div>

        {/* 3D კონტენტი - TranslateZ სხვადასხვა დონეზე */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
          
          {/* Avatar - ყველაზე მაღალ სიმაღლეზე (80px) */}
          <div 
            style={{ transform: "translateZ(80px)" }}
            className="w-40 h-40 rounded-full p-1 bg-gradient-to-tr from-blue-500 to-purple-500 shadow-2xl mb-6"
          >
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-gray-900">
              <img src={avatar} alt={name} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* ტექსტი - საშუალო სიმაღლეზე (50px) */}
          <div style={{ transform: "translateZ(50px)" }} className="space-y-2">
            <h3 className="text-white text-3xl font-black tracking-tight drop-shadow-2xl">
              {name}
            </h3>
            <p className="text-blue-400 font-bold uppercase text-xs tracking-[0.2em]">
              {role}
            </p>
          </div>

          {/* ღილაკი - (30px) */}
          {linkedin && (
            <div style={{ transform: "translateZ(30px)" }} className="mt-8">
              <a
                href={linkedin}
                target="_blank"
                className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-110 transition-transform duration-200 shadow-[0_10px_20px_rgba(255,255,255,0.2)]"
              >
                LinkedIn
              </a>
            </div>
          )}
        </div>

        {/* Dynamic Glare (ბზინვარება რომელიც მაუსს დაყვება) */}
        <motion.div
          style={{
            opacity: glareOpacity,
            background: `linear-gradient(135deg, white 0%, transparent 50%)`,
            left: glareX,
            transform: "translateZ(100px)", // ბზინვარება ყველაზე ზემოთაა
          }}
          className="absolute inset-0 pointer-events-none blur-xl"
        />

        {/* ბარათის "სისქის" ეფექტი (Border Beam) */}
        <div className="absolute inset-0 rounded-[30px] border-2 border-white/10 pointer-events-none" />
      </motion.section>
    </div>
  )
}

export default PCCard