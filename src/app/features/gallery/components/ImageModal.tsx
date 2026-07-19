'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import React, { useEffect, memo } from 'react';
import Image from 'next/image';

interface ImageModalProps {
    images: { id: string | number; image: string; title: string; category: string }[];
    currentIndex: number;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
    images,
    currentIndex,
    onClose,
    onPrev,
    onNext,
}) => {
    const currentImage = images[currentIndex];

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') onPrev();
            if (e.key === 'ArrowRight') onNext();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose, onPrev, onNext]);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-8"
                onClick={onClose}
                role="dialog"
                aria-modal="true"
                aria-label={currentImage.title}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    aria-label="Close gallery"
                    className="absolute top-3 right-3 sm:top-6 sm:right-6 min-h-11 min-w-11 p-2 text-white/70 hover:text-white transition-colors bg-white/10 rounded-full z-50 backdrop-blur-md"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Navigation - Left */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onPrev();
                    }}
                    aria-label="Previous image"
                    className="absolute left-1 sm:left-8 top-1/2 -translate-y-1/2 p-2 sm:p-3 text-white/70 hover:text-white transition-all bg-black/40 sm:bg-white/5 hover:bg-white/10 rounded-full z-50 backdrop-blur-md border border-white/10"
                >
                    <ChevronLeft className="w-8 h-8" />
                </button>

                {/* Image Container */}
                <div
                    className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center gap-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    <motion.div
                        key={currentImage.id}
                        initial={{ opacity: 0, x: 20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="relative w-full h-[65vh] sm:h-[80vh] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                    >
                        <div className="relative w-full h-full">
                          <Image
                              src={currentImage.image}
                              alt={currentImage.title}
                              fill
                              sizes="90vw"
                              className="object-contain"
                              quality={90}
                              priority={currentIndex < 3}
                          />
                        </div>

                        {/* Attribution / Info */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/80 to-transparent">
                            <span className="text-cyan-400 text-xs font-mono uppercase tracking-widest mb-1 block">
                                {currentImage.category}
                            </span>
                            <h3 className="text-white text-xl sm:text-2xl font-bold">
                                {currentImage.title}
                            </h3>
                        </div>
                    </motion.div>

                    {/* Action Footer */}
                    <div className="flex gap-4">
                        <a
                            href={currentImage.image}
                            download
                            className="flex min-h-11 items-center gap-2 px-4 sm:px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-all font-medium backdrop-blur-sm"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Download className="w-4 h-4" />
                            Download
                        </a>
                    </div>
                </div>

                {/* Navigation - Right */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onNext();
                    }}
                    aria-label="Next image"
                    className="absolute right-1 sm:right-8 top-1/2 -translate-y-1/2 p-2 sm:p-3 text-white/70 hover:text-white transition-all bg-black/40 sm:bg-white/5 hover:bg-white/10 rounded-full z-50 backdrop-blur-md border border-white/10"
                >
                    <ChevronRight className="w-8 h-8" />
                </button>
            </motion.div>
        </AnimatePresence>
    );
};

export default memo(ImageModal);
