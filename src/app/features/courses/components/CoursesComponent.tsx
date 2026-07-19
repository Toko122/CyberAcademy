"use client";

import Link from "next/link";
import React, { memo, useMemo, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/adminApi";

interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  price: string;
  duration: string;
  category?: string;
}

interface CourseCardProps extends Course {
  isAdmin?: boolean;
}

const CourseCard = memo(({
  id,
  title,
  description,
  image,
  price,
  duration,
  isAdmin = false,
}: CourseCardProps) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["20deg", "-20deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-20deg", "20deg"]);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAdmin) return alert("არ გაქვს წვდომა!");

    if (!confirm("ნამდვილად გსურთ კურსის წაშლა?")) return;

    setIsDeleting(true);

    const result = await adminFetch("/api/admin/mutations", {
      method: "POST",
      body: JSON.stringify({ entity: "courses", action: "delete", id }),
    });

    if (!result.ok || (typeof result.body === "object" && result.body && "success" in result.body && result.body.success === false)) {
      alert("წაშლა ვერ მოხერხდა");
      setIsDeleting(false);
      return;
    }

    router.refresh();
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAdmin) return alert("არ გაქვს წვდომა!");

    router.push(`/admin/features/courses/edit/${id}`);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (isDeleting) return null;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ type: "spring", duration: 0.8, bounce: 0.3 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: "1500px" }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-5 h-full transition-shadow hover:shadow-[0_0_50px_rgba(6,182,212,0.3)]"
      >
        <Link href={`/features/courses/${id}`} className="block">
          <div
            style={{ transform: "translateZ(50px)" }}
            className="relative w-full aspect-video overflow-hidden rounded-2xl mb-6 shadow-2xl"
          >
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
              quality={85}
            />
            <div className="absolute top-4 right-4 bg-cyan-500 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg z-10">
              {duration || "9 თვე"}
            </div>
          </div>

          <div style={{ transform: "translateZ(30px)" }} className="space-y-4 min-w-0">
            <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-cyan-400 transition-colors">
              {title}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
              {description}
            </p>

            <div className="pt-5 sm:pt-6 border-t border-white/10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                {price} ₾
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {isAdmin && (
                  <>
                    <button
                      onClick={handleEdit}
                      className="min-h-11 px-3 cursor-pointer py-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-300 z-20 relative text-xs font-bold border border-blue-500/30"
                    >
                      რედაქტირება
                    </button>
                    <button
                      onClick={handleDelete}
                      className="min-h-11 px-3 cursor-pointer py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 z-20 relative text-xs font-bold border border-red-500/30"
                    >
                      წაშლა
                    </button>
                  </>
                )}
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300">
                  →
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
});

CourseCard.displayName = 'CourseCard';

export default function CoursesClient({
  courses,
  isAdmin = false,
}: {
  courses: Course[];
  isAdmin?: boolean;
}) {
  const courseCards = useMemo(
    () => courses.map((course) => <CourseCard key={course.id} {...course} isAdmin={isAdmin} />),
    [courses, isAdmin]
  );

  return (
    <main className="min-h-screen bg-[#020617] pb-20 sm:pb-32 pt-10 sm:pt-14 px-4 sm:px-6">
      <section className="max-w-7xl mx-auto">

            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-10 sm:mb-16 lg:mb-20 flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between"
          >
            <h1 className="max-w-4xl text-3xl sm:text-5xl lg:text-7xl text-white font-black leading-tight">
              აღმოაჩინე <span className="text-cyan-500">მომავალი</span>
            </h1>

            <Link href="/" className="w-full sm:w-auto text-center px-5 sm:px-6 py-3 bg-white/5 backdrop-blur-lg text-cyan-400 font-bold rounded-xl border border-cyan-500/50 hover:bg-cyan-500 hover:text-white transition-all duration-300">
              
                მთავარი გვერდი
            </Link>
          </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
          {courses.length > 0 ? (
            courseCards
          ) : (
            <p className="text-white text-center col-span-full">
              კურსები ვერ მოიძებნა
            </p>
          )}
        </div>

      </section>
    </main>
  );
}
