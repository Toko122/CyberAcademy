'use client'

import { motion } from "framer-motion";
import Image from "next/image";
import { memo } from "react";

interface IPartner {
  id: string;
  name: string;
  logo: string;
  color: string;
}

const PartnersComponent = memo(function PartnersComponent({ partners }: { partners: IPartner[] }) {
  if (!partners || partners.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-gray-400 text-lg">პარტნიორები ჯერ არ დამატებულა</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-3 sm:gap-6 p-0 sm:p-6 lg:p-10 group/container">
      {partners.map((partner) => (
        <motion.div
          key={partner.id}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className={`
            relative w-full aspect-square sm:w-40 sm:h-40 flex items-center justify-center 
            rounded-2xl border border-white/10 backdrop-blur-sm
            ${partner.color}
            transition-all duration-400
            group-hover/container:blur-sm group-hover/container:scale-95 group-hover/container:opacity-50
            hover:!scale-110 hover:!blur-none hover:!opacity-100 hover:border-white/30 hover:shadow-2xl
          `}
        >
          <Image
            src={partner.logo}
            alt={partner.name}
            width={128}
            height={128}
            className="w-2/3 h-2/3 object-contain drop-shadow-xl"
            loading="lazy"
            quality={85}
          />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
        </motion.div>
      ))}
    </div>
  );
});


export default PartnersComponent;
