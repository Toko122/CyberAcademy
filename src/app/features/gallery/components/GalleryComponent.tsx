'use client';

import React, { useState, memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Image as ImageIcon } from 'lucide-react';
import ImageModal from './ImageModal';

export interface GalleryImage {
  id: string;
  image: string;
  title: string;
  description: string;
  category: string;
}

export default function GalleryComponent({ images, isAdmin }: { images: GalleryImage[]; isAdmin?: boolean }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const openModal = useCallback((index: number) => setSelectedImageIndex(index), []);
  const closeModal = useCallback(() => setSelectedImageIndex(null), []);
  const showNext = useCallback(() =>
    setSelectedImageIndex((prev) =>
      prev !== null ? (prev + 1) % images.length : null
    ), [images.length]);
  const showPrev = useCallback(() =>
    setSelectedImageIndex((prev) =>
      prev !== null ? (prev - 1 + images.length) % images.length : null
    ), [images.length]);

  return (
    <main className="min-h-screen bg-[#020617] text-white px-4 sm:px-6 py-10 sm:py-12 lg:py-24">
      <div className="max-w-7xl mx-auto space-y-12 lg:space-y-16">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-cyan-400 font-mono text-sm tracking-widest uppercase block"
            >
              აკადემიის ცხოვრება
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-[1.1]"
            >
              დაათვალიერე <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                გალერეა
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 text-lg md:text-xl leading-relaxed"
            >
              ჩვენი ყოველდღიურობა, სასწავლო პროცესი და ის გარემო, სადაც
              მომავლის ტექნოლოგიები იქმნება.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full sm:w-auto"
          >
            <Link href="/" passHref>
              <span className="flex min-h-11 w-full sm:w-auto items-center justify-center px-6 sm:px-8 cursor-pointer py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-full border border-white/10 transition-all backdrop-blur-md">
                მთავარი გვერდი
              </span>
            </Link>
          </motion.div>
        </div>

        {images.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {images.map((photo, index) => (
              <GalleryCard
                key={photo.id}
                photo={photo}
                index={index}
                isAdmin={isAdmin}
                onOpen={() => openModal(index)}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-24 h-24 rounded-full bg-cyan-500/10 flex items-center justify-center mb-6">
              <ImageIcon className="w-10 h-10 text-cyan-500" />
            </div>
            <p className="text-gray-400 text-xl">ფოტოები ჯერ არ დაემატა</p>
          </motion.div>
        )}
      </div>

      {selectedImageIndex !== null && images.length > 0 && (
        <ImageModal
          images={images.map((img) => ({
            id: img.id,
            image: img.image,
            title: img.title,
            category: img.category,
          }))}
          currentIndex={selectedImageIndex}
          onClose={closeModal}
          onPrev={showPrev}
          onNext={showNext}
        />
      )}

      {/* Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-72 h-72 sm:w-[500px] sm:h-[500px] bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-72 h-72 sm:w-[500px] sm:h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>
    </main>
  );
}


const GalleryCard = memo(({
  photo,
  index,
  onOpen,
}: {
  photo: GalleryImage;
  index: number;
  isAdmin?: boolean;
  onOpen: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.03, 0.5) }}
      className="relative group break-inside-avoid rounded-2xl overflow-hidden bg-slate-900 border border-white/5 shadow-lg mb-4"
    >
      <button
        type="button"
        aria-label={`Open ${photo.title}`}
        className="relative block w-full cursor-pointer overflow-hidden text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
        onClick={onOpen}
      >
        <Image
          src={photo.image}
          alt={photo.title}
          width={400}
          height={400}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          quality={80}
        />

        {/* Hover overlay with Title/Description */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-5">
          {photo.category && (
            <span className="text-cyan-400 text-[10px] font-mono uppercase tracking-[0.2em] mb-1">
              {photo.category}
            </span>
          )}
          <h3 className="text-white text-base font-bold">{photo.title}</h3>
          {photo.description && (
            <p className="text-gray-300 text-xs mt-1 line-clamp-2">
              {photo.description}
            </p>
          )}
        </div>
      </button>

    </motion.div>
  );
});

GalleryCard.displayName = 'GalleryCard';
