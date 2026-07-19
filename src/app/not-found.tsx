'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 px-4 sm:px-6 py-12">
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-8xl sm:text-9xl font-black text-blue-900 opacity-20 absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          404
        </h1>

        <div className="relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            გვერდი ვერ მოიძებნა
          </h2>
          
          <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
            სამწუხაროდ, გვერდი რომელსაც ეძებთ არ არსებობს ან გადატანილია სხვა მისამართზე.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="inline-flex min-h-11 w-full sm:w-auto items-center justify-center px-6 sm:px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-blue-900/20"
            >
              მთავარზე დაბრუნება
            </Link>
            
            <button 
              onClick={() => router.back()}
              className="min-h-11 w-full sm:w-auto px-6 sm:px-8 cursor-pointer py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg transition-all duration-200"
            >
              უკან გასვლა
            </button>
          </div>
        </div>

        <div className="mt-16 flex justify-center">
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
        </div>
      </div>
    </div>
  );
}
