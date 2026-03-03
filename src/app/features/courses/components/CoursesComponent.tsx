"use client";

import Link from 'next/link';
import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

interface Course {
  id: number;
  href: string;
  title: string;
  description: string;
  image: string;
  price: string;
  duration: string;
}

const courses: Course[] = [
  { id: 1, href: '/features/courses', title: '3D Design and Modeling', description: 'სამგანზომილებიანი მოდელირება და ვიზუალიზაცია.', image: '/3ddesign.jpg', price: '2700 ₾', duration: '9 თვე' },
  { id: 2, href: '/features/courses', title: 'IT სპეციალისტი', description: 'აპარატურული და პროგრამული უზრუნველყოფა.', image: '/cur-1.jpg', price: '2700 ₾', duration: '9 თვე' },
  { id: 3, href: '/features/courses', title: 'ვებ ტექნოლოგიები', description: 'HTML + CSS - WEB გვერდების მართვა და სტილი.', image: '/course-3.jpg', price: '2700 ₾', duration: '9 თვე' },
  { id: 4, href: '/features/courses', title: 'გრაფიკული დიზაინი', description: 'ვექტორული გრაფიკა Adobe Illustrator-ის ბაზაზე.', image: '/course-2.jpg', price: '2700 ₾', duration: '9 თვე' },
  { id: 5, href: '/features/courses', title: 'პროგრამირება', description: 'დაპროგრამების საფუძვლები C++-ის ბაზაზე.', image: '/course-img1.jpeg', price: '2700 ₾', duration: '9 თვე' },
];

const CourseCard = ({ id, href, title, description, image, price, duration }: Course) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["20deg", "-20deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-20deg", "20deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: -100, rotateZ: -5 },
        visible: { opacity: 1, x: 0, rotateZ: 0 }
      }}
      transition={{ type: "spring", duration: 1.2, bounce: 0.4 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: "1500px",
      }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="group relative bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-5 h-full transition-shadow hover:shadow-[0_0_50px_rgba(6,182,212,0.3)]"
      >
        <Link href={`${href}/${id}`} className="block">
          <div 
            style={{ transform: "translateZ(50px)" }} 
            className="relative w-full aspect-video overflow-hidden rounded-2xl mb-6 shadow-2xl"
          >
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute top-4 right-4 bg-cyan-500 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg">
              {duration}
            </div>
          </div>

          <div style={{ transform: "translateZ(30px)" }} className="space-y-4">
            <h3 className="text-2xl font-black text-white group-hover:text-cyan-400 transition-colors">
              {title}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
              {description}
            </p>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                {price}
              </span>
              <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300">
                →
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default function AllCoursesPage() {
  return (
    <main className="min-h-screen bg-[#020617] pb-32 pt-14 px-6 overflow-hidden">
      <section className="max-w-7xl mx-auto">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-20 flex flex-col items-center text-center"
        >

          <div className='lg:flex-row flex flex-col gap-4 justify-between w-full items-center'>
             <h1 className="text-5xl md:text-7xl text-white font-black mb-6 tracking-tighter">
              აღმოაჩინე <span className="text-cyan-500">მომავალი</span>
            </h1>

            <Link href="/" passHref>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3.5 bg-white/5 cursor-pointer backdrop-blur-lg text-cyan-400 font-bold rounded-xl border border-cyan-500/50 hover:bg-cyan-500 hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
            >
              მთავარი გვერდი
            </motion.button>
          </Link>
            
          </div>

        </motion.div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.2 } }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {courses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </motion.div>

      </section>
    </main>
  );
}