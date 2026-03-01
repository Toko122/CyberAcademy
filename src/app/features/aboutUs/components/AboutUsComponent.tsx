import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react'; 

const AboutUsComponent = () => {
  return (
    <div className="min-h-screen bg-[#16213B] pb-12 pt-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto shadow-xl rounded-2xl overflow-hidden">
        
        <div className="flex justify-center pt-10">
          <img 
            src="/white.png"
            alt="Cyber Academy Logo" 
            className="h-32 w-auto object-contain"
          />
        </div>

        <div className="p-8">
          <h1 className="text-3xl font-bold text-center text-white mb-8">
            კონტაქტი
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
              <Phone className="text-blue-600 mb-2" />
              <p className="text-gray-700 font-medium">599 27 55 62</p>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
              <MapPin className="text-blue-600 mb-2" />
              <p className="text-gray-700 font-medium text-center">ბათუმი, აღმაშენებლის 13ბ</p>
            </div>

            <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
              <Mail className="text-blue-600 mb-2" />
              <p className="text-gray-700 font-medium lowercase">INFO@ACADEMY.EDU.GE</p>
            </div>
          </div>

          <div className="w-full h-96 rounded-xl overflow-hidden shadow-inner border">
            <iframe
              title="Cyber Academy Location"
              width="100%"
              height="100%"
              src="https://maps.google.com/maps?q=Batumi,Agmashenebeli%2013b&t=&z=15&ie=UTF8&iwloc=&output=embed"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsComponent;