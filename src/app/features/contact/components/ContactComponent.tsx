'use client'

import React from 'react';
import Image from 'next/image';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Card from './Links';
import { ACADEMY_LOCATION } from '@/lib/academy-location';

interface ContactInfoProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ icon, label, value, href }) => (
  <div className="flex items-start sm:items-center gap-4 sm:gap-6 group min-w-0">
    <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-blue-500/10 border border-blue-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all duration-500 shadow-lg shadow-blue-500/5">
      <span className="text-blue-400 group-hover:text-white transition-colors">
        {icon}
      </span>
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[10px] text-blue-400 uppercase tracking-[0.3em] font-bold mb-1 italic">
        {label}
      </p>
      {href ? (
        <a href={href} className="flex min-h-11 items-center text-white text-sm sm:text-xl font-medium hover:text-blue-300 transition-colors italic tracking-tight break-all sm:break-words">
          {value}
        </a>
      ) : (
        <p className="text-white text-base sm:text-xl font-light italic tracking-tight">
          {value}
        </p>
      )}
    </div>
  </div>
);

const ContactComponent: React.FC = () => {
  return (
    <div className="relative bg-slate-950 min-h-screen py-8 sm:py-12 lg:py-16 px-3 sm:px-6 lg:px-8 flex items-center justify-center font-sans">
      
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px]"></div>
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "url(https://www.transparenttextures.com/patterns/carbon-fibre.png)" }}
        ></div>
      </div>

      <div className="max-w-6xl w-full relative z-10">
        
        <div className="mb-10">
          <Link href="/" passHref>
            <motion.span 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex min-h-11 w-full sm:w-auto items-center justify-center px-6 sm:px-8 py-3.5 bg-white/5 cursor-pointer backdrop-blur-lg text-cyan-400 font-bold rounded-xl border border-cyan-500/50 hover:bg-cyan-500 hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
            >
              მთავარი გვერდი
            </motion.span>
          </Link>
        </div>

        <div className="bg-slate-900/60 border border-white/5 backdrop-blur-3xl rounded-2xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden shadow-blue-900/10">
          <div className="grid grid-cols-1 lg:grid-cols-5">
            
            <div className="lg:col-span-2 p-6 sm:p-10 md:p-14 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900/20">
              <div className="mb-10 sm:mb-14">
                <Image 
                  src="/white.png" 
                  alt="Cyber Academy Logo" 
                  width={180}
                  height={70}
                  className="h-14 w-auto mb-10 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                />
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tighter mb-4 italic uppercase">
                  კონტაქტი
                </h2>
                <div className="h-1 w-16 bg-blue-600 rounded-full mb-8 shadow-[0_0_10px_#2563eb]"></div>
                <p className="text-blue-100/50 leading-relaxed font-light italic text-lg">
                  ჩვენი აკადემია მდებარეობს სასტუმრო <span className="text-blue-400 font-medium italic">დემეტრე თავდადებულის 49</span>.
                </p>
              </div>

              <div className="space-y-8 sm:space-y-12">
                <ContactInfo 
                  icon={<Phone size={24} />} 
                  label="ტელეფონი" 
                  value="577 427 000" 
                  href="tel:+995577427000" 
                />
                <ContactInfo 
                  icon={<Mail size={24} />} 
                  label="ელ-ფოსტა" 
                  value="INFO@ACADEMY.EDU.GE" 
                  href="mailto:INFO@ACADEMY.EDU.GE" 
                />
                <ContactInfo 
                  icon={<MapPin size={24} />} 
                  label="მისამართი" 
                  value="დემეტრე თავდადებულის 49" 
                />
                <Card />
              </div>
            </div>

            <div className="lg:col-span-3 min-h-[340px] sm:min-h-[420px] lg:min-h-[500px] lg:h-auto w-full relative group">
               <iframe
              title={`Cyber Academy Location - ${ACADEMY_LOCATION.address}`}
              width="100%"
              height="100%"
              src={ACADEMY_LOCATION.googleMapsEmbedUrl}
            ></iframe>
              
              <div className="absolute inset-0 pointer-events-none border-l border-white/5 shadow-[inset_30px_0_60px_rgba(0,0,0,0.6)]"></div>
            </div>

          </div>
        </div>

        <div className="mt-8 sm:mt-12 flex flex-col md:flex-row items-center justify-between px-1 sm:px-8 opacity-30 text-white italic text-center md:text-left gap-4">
          <p className="text-[10px] tracking-[0.2em] sm:tracking-[0.35em] lg:tracking-[0.5em] uppercase md:mb-0">
            Cyber Academy © 2026 • Secure Your Future
          </p>
          <div className="flex items-center text-[10px] tracking-[0.12em] sm:tracking-[0.2em] uppercase font-bold">
             <span className="flex items-center gap-2 underline decoration-blue-500/50 underline-offset-4">
              <Globe size={12}/> WWW.ACADEMY.EDU.GE
             </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactComponent;
