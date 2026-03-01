'use client'

import './Footer.css'

const partners = [
  "/partneors1.png",
  "/partneors2.png",
  "/partneors3.png",
  "/partneors4.png",
  "/partneors5.png",
];

const Footer = () => {
  return (
    <footer className="w-full overflow-hidden bg-gray-50 border-t border-gray-200 py-4">
      
      <div className="relative flex w-max animate-marquee">
        
        {partners.map((logo, index) => (
          <div
            key={`first-${index}`}
            className="w-[200px] mx-8 flex items-center justify-center shrink-0"
          >
            <img
              src={logo}
              alt={`Partner ${index + 1}`}
              className="w-full h-auto grayscale hover:grayscale-0 transition duration-300"
            />
          </div>
        ))}

        {partners.map((logo, index) => (
          <div
            key={`second-${index}`}
            className="w-[200px] mx-8 flex items-center justify-center shrink-0"
          >
            <img
              src={logo}
              alt={`Partner ${index + 1}`}
              className="w-full h-auto grayscale hover:grayscale-0 transition duration-300"
            />
          </div>
        ))}

      </div>
    </footer>
  );
};

export default Footer;