'use client'

import Link from "next/link";
import { useState } from "react";
import { GrMenu } from "react-icons/gr";
import { IoClose } from "react-icons/io5";

const Navbar = () => {
    
    const [openMenu, setOpenMenu] = useState(false);

    const NavItem = ({ href, label }: { href: string, label: string }) => (
        <div className="relative group">
            <div className="absolute inset-0 bg-[#2373c7] blur-md opacity-40 rounded-md"></div>
            <Link 
                href={href} 
                onClick={() => setOpenMenu(false)}
                className="relative z-10 text-white py-2 px-6 bg-[#16213B] rounded-md transition-all 
                           hover:scale-105 duration-300 block shadow-[0px_0px_18px_rgba(19,60,83,0.8)] tracking-wider text-center"
            >
                {label}
            </Link>
        </div>
    );

    return (
        <>
            <div className='bg-[#16213B] w-full h-[110px] fixed top-0 z-50 shadow-lg'>
                <div className="w-full h-full flex items-center justify-center px-8">
                    
                    <div className="lg:flex hidden items-center gap-10 text-white/80 text-[19px]">
                        <NavItem href="/" label="მთავარი" />
                        <NavItem href="/features/courses" label="კურსები" />
                        <NavItem href="/features/mentors" label="გუნდი" />
                        <NavItem href="/features/aboutUs" label="ჩვენს შესახებ" />
                    </div>

                    <div className="lg:hidden flex items-center w-full h-full">
                        <div className="w-full h-full flex items-center justify-between">
                            <Link href={'/'}>
                                <img src={'/white.png'} alt="Logo" className="w-28 h-12 object-contain"/>
                            </Link>
                            <div onClick={() => setOpenMenu(true)} className="cursor-pointer text-white text-3xl">
                                <GrMenu />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div 
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-500 ${
                    openMenu ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setOpenMenu(false)}
            />

            <div className={`fixed top-0 right-0 h-full w-[300px] bg-[#16213B] border-l border-white/10 z-[70] p-8 shadow-2xl transition-transform duration-500 ease-in-out ${
                openMenu ? "translate-x-0" : "translate-x-full"
            }`}>
                <div className="flex justify-end mb-10">
                    <IoClose 
                        className="text-white w-fit cursor-pointer text-4xl cursor-pointer hover:text-red-400 transition-colors" 
                        onClick={() => setOpenMenu(false)} 
                    />
                </div>

                <div className="flex flex-col gap-8">
                    <NavItem href="/" label="მთავარი" />
                    <NavItem href="/features/courses" label="კურსები" />
                    <NavItem href="/features/mentors" label="გუნდი" />
                    <NavItem href="/features/aboutUs" label="ჩვენს შესახებ" />
                </div>

                <div className="absolute bottom-10 left-0 w-full text-center px-8">
                    <p className="text-white/30 text-xs tracking-widest uppercase">Cyber Academy © 2026</p>
                </div>
            </div>
        </>
    );
};

export default Navbar;