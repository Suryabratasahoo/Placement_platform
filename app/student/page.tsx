"use client"

import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, BookOpen, Clock, Zap, ArrowUpRight, MoreHorizontal, Calendar, ArrowRight, Box, Share, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

export default function StudentDashboard() {

  const [index, setIndex] = useState(0);
  const items = [
    { image: "/image1.png" },
    { image: "/image2.png" },
    { image: "/image3.png" },
  ];

  const nextStep = () => setIndex((prev) => (prev + 1) % items.length);
  const prevStep = () => setIndex((prev) => (prev - 1 + items.length) % items.length);

  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="grid bg-white rounded-[40px] p-4 grid-cols-1 lg:grid-cols-12 gap-4 max-w-full mx-auto w-full h-full overflow-auto scrollbar-none text-black font-sans [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      {/* === LEFT COLUMN: Stats & Promo === */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        {/* Blue Promo Card (Google Drive) */}
        <div className="bg-[#1783e1] rounded-[40px] p-8 relative overflow-hidden h-75 flex">
          <div className="z-10 max-w-[65%]">
            <h2 className="text-white text-3xl font-bold leading-tight mb-2">
              Upcoming <br /> Mega Drive
            </h2>
            <p className="text-sm text-white opacity-80 mb-6">
              Google Software Engineering Role • 24 LPA
            </p>
            <button className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white transition-transform hover:scale-105">
              <ArrowUpRight size={20} />
            </button>
          </div>
          <Trophy className="absolute -right-10 -bottom-5 w-55 h-55 text-white opacity-20 rotate-12" />
        </div>

        {/* Dual Stat Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Applications Card */}
          <div className="relative overflow-hidden bg-white border-[3px] border-[#fdecdb] rounded-[40px] p-5 flex items-center shadow-sm h-32">
            <div className="absolute -top-2.5 -left-2.5 w-24 h-24 bg-[#db935f] rounded-full opacity-100" style={{ borderRadius: '45% 55% 70% 30% / 30% 40% 60% 70%' }}></div>
            <div className="relative z-10 flex items-center w-full">
              <div className="w-14 h-14 bg-[#e67b2f] rounded-full flex items-center justify-center shadow-inner">
                <BookOpen size={24} className="text-white" />
              </div>
              <div className="flex-1 text-center">
                <p className="text-sm text-gray-500 font-semibold">Applied</p>
                <h3 className="text-3xl font-bold text-gray-800">12</h3>
              </div>
            </div>
          </div>

          {/* Shortlisted Card */}
          <div className="relative overflow-hidden bg-white border-[3px] border-[#e2e0f7] rounded-[40px] p-5 flex items-center shadow-sm h-32">
            <div className="absolute -top-2.5 -left-2.5 w-24 h-24 bg-[#8961d3] rounded-full opacity-100" style={{ borderRadius: '45% 55% 70% 30% / 30% 40% 60% 70%' }}></div>
            <div className="relative z-10 flex items-center w-full">
              <div className="w-14 h-14 bg-[#681cf5] rounded-full flex items-center justify-center shadow-inner">
                <Clock size={24} className="text-white" />
              </div>
              <div className="flex-1 text-center">
                <p className="text-sm text-gray-500 font-semibold">Shortlists</p>
                <h3 className="text-3xl font-bold text-gray-800">3</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Resource Card */}
        <div className="relative w-full max-w-2xl h-52 bg-[#0c0c0c] rounded-[40px] p-6 overflow-hidden flex flex-col justify-between shadow-xl">
          <svg className="absolute right-0 top-0 h-full opacity-20 pointer-events-none" viewBox="0 0 200 200">
            <path fill="none" stroke="white" strokeWidth="1.5" d="M100,20 C150,50 50,150 180,180" strokeLinecap="round" />
          </svg>
          <div className="flex justify-between items-start relative z-10">
            <div className="w-10 h-10 bg-[#26282b] rounded-full flex items-center justify-center border border-gray-600">
              <Box className="text-[#dd6510] w-4 h-4" />
            </div>
            <button className="w-9 h-9 bg-[#4e5055] rounded-full flex items-center justify-center">
              <Share className="text-white w-4 h-4" />
            </button>
          </div>
          <div className="relative z-10 space-y-1">
            <p className="text-orange-200 text-xs font-bold tracking-[0.18em] uppercase">Resource Hub</p>
            <h2 className="text-white text-xl font-bold leading-snug max-w-sm">TCS NQT Preparation Guide</h2>
          </div>
          <div className="flex justify-between items-end relative z-10">
            <div className="flex items-center">
              <div className="flex -space-x-3">
                <div className="w-9 h-9 rounded-full border-2 border-[#2D2F33] bg-yellow-100 flex items-center justify-center text-lg">👨🏻‍💻</div>
                <div className="w-9 h-9 rounded-full border-2 border-[#2D2F33] bg-purple-100 flex items-center justify-center text-lg">👨🏻</div>
                <div className="w-9 h-9 rounded-full border-2 border-[#2D2F33] bg-green-100 flex items-center justify-center text-lg">👩🏻‍🎨</div>
              </div>
              <span className="ml-4 text-white font-bold text-lg">+142</span>
            </div>
            <div className="relative group flex items-center justify-center">
              <svg className="absolute w-14 h-14 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="#FDBA74" strokeWidth="3" strokeLinecap="round" className="stroke-dasharray-[289] stroke-dashoffset-[289] transition-all duration-700 ease-in-out group-hover:stroke-dashoffset-0" />
              </svg>
              <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center transition-transform duration-300 ease-in-out group-hover:scale-105 cursor-pointer">
                <ArrowRight className="text-black w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* === CENTER COLUMN: Main Progress === */}
      <div className="lg:col-span-5 bg-[#f5f5f5] rounded-[50px] p-10 flex flex-col shadow-sm h-full max-h-screen overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Activity</h2>
          <div className="bg-gray-100 rounded-2xl px-5 py-2.5 text-xs font-bold flex items-center gap-2 cursor-pointer border border-gray-200">
            This Month <MoreHorizontal size={14} />
          </div>
        </div>

        {/* Orange Activity Display Area */}
        <div className="bg-[#FFA365] rounded-[45px] p-10 mb-8 relative overflow-hidden shrink-0">
          <div className="flex gap-12 mb-10 relative z-10">
            <h3 className="text-4xl font-bold">12 <span className="text-lg font-medium">Applied</span></h3>
            <h3 className="text-4xl font-bold">5 <span className="text-lg font-medium">OA</span></h3>
          </div>

          <div className="flex items-end justify-between h-44 px-2 relative z-10">
            {[
              { day: 'Mon', h: 'h-32', val: 3 },
              { day: 'Tue', h: 'h-16', val: 1 },
              { day: 'Wed', h: 'h-44', val: 5, active: true },
              { day: 'Thu', h: 'h-24', val: 2 },
              { day: 'Fri', h: 'h-32', val: 4 }
            ].map((bar) => (
              <div key={bar.day} className="flex flex-col items-center gap-4">
                <div className={`w-14 ${bar.h} rounded-full relative transition-all duration-300 ${bar.active ? 'bg-black text-white scale-105' : 'bg-[#dc7c0f] text-[#ffffff] opacity-80'}`}>
                  <span className="absolute top-4 w-full text-center text-xs font-bold">{bar.val}</span>
                </div>
                <span className="text-xs font-bold text-white uppercase tracking-tighter">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Peer Stats Bar */}
        <div className="flex justify-between items-center p-6 bg-gray-50 rounded-[35px] border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#ffdd67] rounded-full flex items-center justify-center text-white shadow-md">★</div>
            <div>
              <p className="font-bold text-base leading-tight">Peer Selections</p>
              <p className="text-xs text-gray-400">Recent placements in your branch</p>
            </div>
          </div>
          <div className="flex -space-x-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-gray-200" />
            ))}
          </div>
        </div>
      </div>

      {/* === RIGHT COLUMN: Calendar & Suggestions === */}
      <div className="lg:col-span-3 flex flex-col gap-4">
        <div className="bg-white rounded-[40px] p-6 shadow-sm border border-gray-50">
          <h2 className="text-2xl font-bold leading-tight mb-2">
            Upcoming <span className="inline-block ml-1">🎯</span><br />
            Deadlines
          </h2>
          <p className="text-sm text-orange-500 font-semibold flex items-center gap-2 mb-6">
            📦 Stay on track
          </p>
          <div className="flex justify-between">
            {[
              { day: "Mon", date: 20, done: true },
              { day: "Tue", date: 21, done: true },
              { day: "Wed", date: 22 },
              { day: "Thr", date: 23 },
              { day: "Fri", date: 24 },
            ].map((item) => (
              <div key={item.date} className="bg-[#f7f7f7] rounded-[26px] px-4 py-3 flex flex-col items-center gap-1 relative w-[52px]">
                <span className="text-xs text-gray-400 font-semibold">{item.day}</span>
                <span className="text-lg font-bold text-black">{item.date}</span>
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center mt-1 ${item.done ? "bg-[#f3b58b]" : "bg-[#c9f3a1]"}`}>
                  📝
                </div>
                {item.done && (
                  <span className="absolute bottom-1 right-1 w-4 h-4 bg-black text-white text-[10px] flex items-center justify-center rounded-full">✕</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Highlight Card */}
        <div className="bg-[#681cf5] rounded-[40px] p-3 text-white flex items-center gap-5 shadow-lg relative overflow-hidden group">
          <div className="bg-white/20 p-3 rounded-2xl relative z-10">
            <Zap size={24} fill="white" className="group-hover:animate-pulse" />
          </div>
          <div className="relative z-10">
            <p className="font-bold text-base leading-tight">Mock Interview</p>
            <p className="text-[11px] opacity-80 font-medium">Scheduled for Friday, 4 PM</p>
          </div>
        </div>

        {/* Carousel */}
        <div className="bg-white rounded-[40px] p-6 h-64 shadow-sm border border-gray-50 flex flex-col relative group">
          <div className="flex justify-between items-center mb-6">
            <p className="font-bold text-sm uppercase tracking-wider text-gray-400">Featured Drives</p>
            <MoreHorizontal size={16} />
          </div>
          <div className="relative flex-1 overflow-hidden rounded-[28px]">
            <AnimatePresence mode="wait">
              <motion.div key={index} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="absolute inset-0 grid grid-cols-2 gap-3">
                <div className="relative rounded-[28px] overflow-hidden cursor-pointer">
                  <Image src={items[index].image} alt="drive" fill className="object-cover hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="relative rounded-[28px] overflow-hidden cursor-pointer">
                  <Image src={items[(index + 1) % items.length].image} alt="drive" fill className="object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <button onClick={prevStep} className="absolute left-2 top-37.5 cursor-pointer -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextStep} className="absolute right-2 top-37.5 cursor-pointer -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </motion.main>
  );
}