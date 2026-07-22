"use client";

import Link from "next/link";
import React, { memo, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
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

  const handleDelete = async () => {
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

  const handleEdit = () => {
    if (!isAdmin) return alert("არ გაქვს წვდომა!");

    router.push(`/admin/features/courses/edit/${id}`);
  };

  if (isDeleting) return null;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ type: "spring", duration: 0.8, bounce: 0.3 }}
      className="h-full"
    >
      <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1e293b]/50 shadow-xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_20px_50px_rgba(6,182,212,0.18)]">
        <Link
          href={`/features/courses/${id}`}
          aria-label={`${title} კურსის ნახვა`}
          className="flex min-h-0 flex-1 flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-inset"
        >
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              quality={85}
            />
            <div className="absolute right-3 top-3 z-10 max-w-[calc(100%-1.5rem)] rounded-full bg-cyan-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
              {duration || "9 თვე"}
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">
            <h3 className="line-clamp-2 text-xl font-black leading-tight text-white transition-colors group-hover:text-cyan-400 sm:text-2xl">
              {title}
            </h3>
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-400">
              {description}
            </p>

            <div className="mt-auto flex min-w-0 items-center justify-between gap-4 border-t border-white/10 pt-5">
              <span className="min-w-0 text-xl font-black text-white sm:text-2xl">
                {price} ₾
              </span>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-xl text-cyan-400 transition group-hover:bg-cyan-500 group-hover:text-white" aria-hidden="true">→</span>
            </div>
          </div>
        </Link>
        {isAdmin && (
          <div className="grid grid-cols-2 gap-2 border-t border-white/10 p-3">
            <button type="button" onClick={handleEdit} className="min-h-11 cursor-pointer rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-xs font-bold text-blue-400 transition hover:bg-blue-500 hover:text-white focus-visible:ring-2 focus-visible:ring-blue-400">
              რედაქტირება
            </button>
            <button type="button" onClick={handleDelete} className="min-h-11 cursor-pointer rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-400 transition hover:bg-red-500 hover:text-white focus-visible:ring-2 focus-visible:ring-red-400">
              წაშლა
            </button>
          </div>
        )}
      </article>
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

        <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
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
