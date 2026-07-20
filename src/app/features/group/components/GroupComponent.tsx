'use client';

import React, { useRef, memo, useState, useCallback } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { adminFetch } from '@/lib/adminApi'

interface IGroup {
  id: string;
  name: string;
  description: string;
  image: string;
  position: string;
}

const GroupCard: React.FC<{ member: IGroup; isAdmin?: boolean }> = ({ member, isAdmin }) => {
  const router = useRouter()
  const cardRef = useRef<HTMLDivElement>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["20deg", "-20deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-20deg", "20deg"])

  const glareOpacity = useTransform(mouseXSpring, [-0.5, 0.5], [0.4, 0.1])
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    
    x.set(mouseX / width - 0.5)
    y.set(mouseY / height - 0.5)
  }, [x, y])

  const handleMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('ნამდვილად გსურთ წევრის წაშლა?')) return
    setIsDeleting(true)
    try {
      const result = await adminFetch('/api/admin/mutations', {
        method: 'POST',
        body: JSON.stringify({ entity: 'groups', action: 'delete', id: member.id }),
      });
      if (!result.ok) {
        throw new Error('Delete failed');
      }
      router.refresh();
    } catch {
      alert("წევრის წაშლა ვერ მოხერხდა")
      setIsDeleting(false)
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/admin/features/group/edit/${member.id}`)
  }

  if (isDeleting) return null

  return (
    <div className="[perspective:1500px] w-full max-w-80 py-5 sm:py-8 lg:py-10">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full min-h-[440px] sm:h-[460px] rounded-[24px] sm:rounded-[30px] border border-white/20 bg-gray-900/40 backdrop-blur-2xl shadow-2xl overflow-visible group"
      >
        <div className="absolute inset-0 rounded-[30px] overflow-hidden z-0">
          <div className="absolute top-[-20%] left-[-20%] w-[100%] h-[100%] bg-cyan-600/20 blur-[100px] animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-20%] w-[100%] h-[100%] bg-blue-600/20 blur-[100px] animate-pulse" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
          
          <div 
            style={{ transform: "translateZ(80px)" }}
            className="w-40 h-40 rounded-full p-1 bg-gradient-to-tr from-cyan-500 to-blue-500 shadow-2xl mb-6"
          >
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-gray-900 relative">
              <Image 
                src={member.image} 
                alt={member.name} 
                fill
                sizes="160px"
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                loading="lazy"
                quality={85}
              />
            </div>
          </div>

          <div style={{ transform: "translateZ(50px)" }} className="space-y-2">
            <h3 className="text-white text-3xl font-black tracking-tight drop-shadow-2xl">
              {member.name}
            </h3>
            <p className="text-cyan-400 font-bold uppercase text-xs tracking-[0.2em]">
              {member.position}
            </p>
          </div>

          <div style={{ transform: "translateZ(30px)" }} className="mt-6">
             <p className="text-gray-400 text-sm line-clamp-3 italic opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500">
                &quot;{member.description}&quot;
             </p>
          </div>

          {/* Admin controls */}
          {isAdmin && (
            <div
              style={{ transform: "translateZ(100px)" }}
              className="absolute top-4 left-4 right-4 flex flex-wrap justify-end gap-2"
            >
              <button
                onClick={handleEdit}
                className="min-h-11 px-3 py-2 cursor-pointer rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-300 backdrop-blur-sm border border-blue-500/30 text-xs font-bold"
              >
                რედაქტირება
              </button>
              <button
                onClick={handleDelete}
                className="min-h-11 px-3 py-2 cursor-pointer rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 backdrop-blur-sm border border-red-500/30 text-xs font-bold"
              >
                წაშლა
              </button>
            </div>
          )}
        </div>

        <motion.div
          style={{
            opacity: glareOpacity,
            background: `linear-gradient(135deg, white 0%, transparent 50%)`,
            left: glareX,
            transform: "translateZ(100px)",
          }}
          className="absolute inset-0 pointer-events-none blur-xl"
        />

        <div className="absolute inset-0 rounded-[30px] border-2 border-white/10 pointer-events-none" />
      </motion.div>
    </div>
  )
}

const GroupComponent = memo(function GroupComponent({ groups, isAdmin }: { groups: IGroup[]; isAdmin?: boolean }) {
  if (!groups || groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-gray-400 text-lg">გუნდის წევრები ჯერ არ დამატებულა</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 sm:gap-y-10 gap-x-6 lg:gap-x-8 justify-items-center w-full max-w-7xl mx-auto">
      {groups.map((member) => (
        <GroupCard key={member.id} member={member} isAdmin={isAdmin} />
      ))}
    </div>
  );
});


export default GroupComponent;
