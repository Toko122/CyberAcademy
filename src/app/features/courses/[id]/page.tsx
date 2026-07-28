"use client";

import React, { useEffect, useState } from "react";
import { Clock, CreditCard, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { formatPrice, type PriceValue } from "@/lib/utils";

interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  total_price: PriceValue;
  monthly_price: PriceValue;
  duration: string;
  category?: string;
}

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${encodeURIComponent(String(id))}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) {
          setError("კურსი ვერ მოიძებნა ან მოხდა შეცდომა.");
        } else {
          setCourse(await response.json());
        }
      } catch (fetchError) {
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") return;
        setError("კურსი ვერ მოიძებნა ან მოხდა შეცდომა.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    if (id) void fetchCourse();
    return () => controller.abort();
  }, [id]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#0F172A]">
        <span>მიმდინარეობს დატვირთვა...</span>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-[#0F172A] p-6">
        <h2 className="text-2xl mb-4 text-center">{error || "კურსი ვერ მოიძებნა"}</h2>
        <Link href="/features/courses" className="text-cyan-500 hover:underline">
          უკან დაბრუნება
        </Link>
      </div>
    );
  }

  const titleParts = course.title.split(" ");
  const firstWord = titleParts[0];
  const restOfTitle = titleParts.slice(1).join(" ");
  const totalPrice = formatPrice(course.total_price);
  const monthlyPrice = formatPrice(course.monthly_price);

  return (
    <main className="min-h-screen bg-[#0F172A] pt-16 sm:pt-20 lg:pt-24 pb-16 sm:pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <Link href="/features/courses" className="group inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-gray-400 transition-colors hover:text-cyan-500">
            <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
            უკან ყველა კურსზე
          </Link>
          <Link href="/" className="inline-flex min-h-11 items-center rounded-lg border border-white/10 bg-white/5 px-4 font-semibold text-cyan-400 transition hover:border-cyan-400/50 hover:bg-white/10 hover:text-white">
            მთავარი გვერდი
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Image + details */}
          <div className="w-full lg:w-2/5 order-1 lg:order-2 lg:sticky lg:top-32 h-fit z-10">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-[#1E293B] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <Image
                  src={course.image}
                  alt={course.title}
                  width={800}
                  height={640}
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="w-full h-64 md:h-80 object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="p-4 sm:p-6 space-y-6">
                  <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3 text-gray-400">
                      <Clock size={20} className="text-cyan-500" />
                      <span>ხანგრძლივობა</span>
                    </div>
                    <span className="text-white font-bold">{course.duration}</span>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3 text-gray-400">
                      <CreditCard size={20} className="text-cyan-500" />
                      <span>თვიური გადასახადი</span>
                    </div>
                    <span className="text-2xl font-black text-cyan-400">{monthlyPrice ? `${monthlyPrice} ₾` : "—"}</span>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3 text-gray-400">
                      <CreditCard size={20} className="text-cyan-500" />
                      <span>მთლიანი ღირებულება</span>
                    </div>
                    <span className="text-xl font-black text-white">{totalPrice ? `${totalPrice} ₾` : "—"}</span>
                  </div>

                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="block w-full cursor-not-allowed rounded-xl bg-cyan-700/60 px-4 py-4 text-center font-bold text-white/70 shadow-lg shadow-cyan-600/10"
                  >
                    რეგისტრაცია
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="w-full lg:w-3/5 order-2 lg:order-1 space-y-8 relative z-0">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                {firstWord} <span className="text-cyan-500">{restOfTitle}</span>
              </h1>
              <div className="h-1.5 w-20 bg-cyan-500 rounded-full" />
            </div>

            <div className="space-y-6 text-gray-300 leading-relaxed text-lg">
              <p className="font-semibold text-white">{course.description}</p>
              <p>
                გსურთ შეისწავლოთ {course.title}? ნახოთ მათი შესაძლებლობები და შეძლოთ გამოყენება? მაშინ
                დარეგისტრირდი კიბერ აკადემიის შესაბამის კურსზე და შეისწავლე ეს დარგი საფუძვლიანად.
              </p>
              <p>
                მიმდინარე კურსის ფარგლებში თქვენ გაეცნობით რეალურ შესაძლებლობებს და შეძლებთ გამოიყენოთ
                მიღებული ცოდნა ნებისმიერ პროფესიულ საქმიანობაში.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-4 shadow-xl">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="text-cyan-500" />
                კურსი მოიცავს:
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500">•</span> სიღრმისეული თეორიული მასალა
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500">•</span> პრაქტიკული სამუშაოები პროგრამებში
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500">•</span> რეალურ ქეისებზე დაფუძნებული სწავლება
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500">•</span> პორტფოლიოს მომზადება
                </li>
              </ul>
            </div>


          </div>
        </div>
      </div>
    </main>
  );
}
