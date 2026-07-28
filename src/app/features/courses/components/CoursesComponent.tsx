"use client";

import { adminFetch } from "@/lib/adminApi";
import { formatPrice, type PriceValue } from "@/lib/utils";
import { ArrowRight, Clock, ImageOff } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { memo, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  totalPrice: PriceValue;
  monthlyPrice: PriceValue;
  duration: string;
  category?: string;
  teacher: {
    id: string;
    name: string;
    image: string | null;
  } | null;
}

const CourseCover = ({ image, title }: { image: string; title: string }) => {
  const [failed, setFailed] = useState(false);
  if (!image || failed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-900 text-slate-500">
        <ImageOff aria-hidden="true" className="h-9 w-9" />
        <span className="text-xs font-semibold">სურათი არ არის</span>
      </div>
    );
  }
  return (
    <Image
      src={image}
      alt={title}
      fill
      sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw"
      className="object-cover transition-transform duration-500 group-hover:scale-[1.035]"
      loading="lazy"
      quality={85}
      onError={() => setFailed(true)}
    />
  );
};

const CourseCard = memo(({
  id, title, description, image, totalPrice, monthlyPrice, duration, category, teacher, isAdmin = false,
}: Course & { isAdmin?: boolean }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const monthly = formatPrice(monthlyPrice);
  const total = formatPrice(totalPrice);

  const handleDelete = async () => {
    if (!isAdmin || !confirm("ნამდვილად გსურთ კურსის წაშლა?")) return;
    setIsDeleting(true);
    const result = await adminFetch("/api/admin/mutations", {
      method: "POST",
      body: JSON.stringify({ entity: "courses", action: "delete", id }),
    });
    if (!result.ok) {
      alert("წაშლა ვერ მოხერხდა");
      setIsDeleting(false);
      return;
    }
    router.refresh();
  };

  if (isDeleting) return null;

  return (
    <motion.article
      variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-[0_18px_45px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1 hover:border-cyan-400/35 hover:shadow-[0_24px_60px_rgba(6,182,212,0.14)]"
    >
      <Link
        href={`/features/courses/${id}`}
        aria-label={`${title} — დეტალურად`}
        className="flex min-h-0 flex-1 cursor-pointer flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-400"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
          <CourseCover image={image} title={title} />
          {category && (
            <span className="absolute left-4 top-4 max-w-[calc(100%-2rem)] truncate rounded-full border border-white/15 bg-slate-950/80 px-3 py-1.5 text-xs font-bold text-cyan-300 backdrop-blur">
              {category}
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">
          <div className="mb-4 flex min-w-0 items-center gap-2 text-sm font-semibold text-slate-400">
            <Clock className="h-4 w-4 shrink-0 text-cyan-400" aria-hidden="true" />
            <span className="truncate">{duration || "ხანგრძლივობა არ არის მითითებული"}</span>
          </div>
          <h2 className="line-clamp-2 text-xl font-black leading-snug tracking-tight text-white transition-colors group-hover:text-cyan-300 sm:text-2xl">
            {title}
          </h2>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
            {description || "კურსის აღწერა მალე დაემატება."}
          </p>

          {teacher && (
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-cyan-400/15 bg-cyan-400/5 p-3">
              {teacher.image ? (
                <Image
                  src={teacher.image}
                  alt={teacher.name}
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full object-cover"
                />
              ) : (
                <div className="h-11 w-11 rounded-full bg-cyan-500/20" aria-hidden="true" />
              )}
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">Teacher</p>
                <p className="truncate text-sm font-bold text-white">{teacher.name}</p>
              </div>
            </div>
          )}

          <div className="mt-6 space-y-3 rounded-2xl border border-white/10 bg-slate-950/55 p-4">
            <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-1">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-400">თვიური გადასახადი</span>
              <span className="text-2xl font-black text-cyan-300">{monthly ? `${monthly} ₾` : "—"}</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-white/10 pt-3">
              <span className="text-xs font-semibold text-slate-400">მთლიანი ღირებულება</span>
              <span className="text-base font-bold text-white">{total ? `${total} ₾` : "—"}</span>
            </div>
          </div>

          <span className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/15 transition hover:bg-cyan-300 active:translate-y-px group-hover:bg-cyan-300">
            დეტალურად
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </Link>

      {isAdmin && (
        <div className="grid grid-cols-2 gap-2 border-t border-white/10 p-3">
          <button type="button" onClick={() => router.push(`/admin/features/courses/edit/${id}`)} className="min-h-11 rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-xs font-bold text-blue-300 transition hover:bg-blue-500 hover:text-white active:translate-y-px focus-visible:ring-2 focus-visible:ring-blue-400">
            რედაქტირება
          </button>
          <button type="button" onClick={handleDelete} className="min-h-11 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-300 transition hover:bg-red-500 hover:text-white active:translate-y-px focus-visible:ring-2 focus-visible:ring-red-400">
            წაშლა
          </button>
        </div>
      )}
    </motion.article>
  );
});

CourseCard.displayName = "CourseCard";

export default function CoursesClient({ courses, isAdmin = false }: { courses: Course[]; isAdmin?: boolean }) {
  const cards = useMemo(
    () => courses.map((course) => <CourseCard key={course.id} {...course} isAdmin={isAdmin} />),
    [courses, isAdmin],
  );

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#020617] px-4 pb-20 pt-10 sm:px-6 sm:pb-28 sm:pt-14">
      <section className="mx-auto max-w-7xl">
        <motion.header initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-10 flex flex-col items-start gap-6 sm:mb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">Cyber Academy</p>
            <h1 className="max-w-4xl text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              აღმოაჩინე <span className="text-cyan-400">მომავალი</span>
            </h1>
          </div>
          <Link href="/" className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-xl border border-cyan-500/40 bg-white/5 px-6 py-3 font-bold text-cyan-300 transition hover:border-cyan-300 hover:bg-cyan-500 hover:text-slate-950 active:translate-y-px sm:w-auto">
            მთავარი გვერდი
          </Link>
        </motion.header>

        <motion.div initial="hidden" animate="visible" className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3 lg:gap-8">
          {courses.length > 0 ? cards : (
            <p className="col-span-full rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-300">
              კურსები ვერ მოიძებნა
            </p>
          )}
        </motion.div>
      </section>
    </main>
  );
}
