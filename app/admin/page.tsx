// app/admin/page.tsx

"use client"

import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Users, Briefcase, Zap, ArrowUpRight, MoreHorizontal, ArrowRight, Box, Share, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

export default function AdminDashboard() {

  const [index, setIndex] = useState(0);
  const [showFullCalendar, setShowFullCalendar] = useState(false);

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
        {/* Blue Promo Card */}
        <div className="bg-[#1783e1] rounded-[40px] p-8 relative overflow-hidden h-75 flex">
          <div className="z-10 max-w-[65%]">
            <h2 className="text-white text-3xl font-bold leading-tight mb-2">
              Placement Season <br /> 2026 Live
            </h2>
            <p className="text-sm text-white opacity-80 mb-6">
              Track batch progress and upcoming drives.
            </p>
            <button className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white transition-transform hover:scale-105">
              <ArrowUpRight size={20} />
            </button>
          </div>
          <Trophy className="absolute -right-10 -bottom-5 w-55 h-55 text-white opacity-20 rotate-12" />
        </div>

        {/* Dual Stat Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Companies Card */}
          <div className="relative overflow-hidden bg-white border-[3px] border-[#fdecdb] rounded-[40px] p-5 flex items-center shadow-sm h-32">
            <div className="absolute -top-2.5 -left-2.5 w-24 h-24 bg-[#db935f] rounded-full opacity-100" style={{ borderRadius: '45% 55% 70% 30% / 30% 40% 60% 70%' }}></div>
            <div className="relative z-10 flex items-center w-full">
              <div className="w-14 h-14 bg-[#e67b2f] rounded-full flex items-center justify-center shadow-inner">
                <Briefcase size={24} className="text-white" />
              </div>
              <div className="flex-1 text-center">
                <p className="text-sm text-gray-500 font-semibold">Companies</p>
                <h3 className="text-3xl font-bold text-gray-800">45</h3>
              </div>
            </div>
          </div>

          {/* Placed Card */}
          <div className="relative overflow-hidden bg-white border-[3px] border-[#e2e0f7] rounded-[40px] p-5 flex items-center shadow-sm h-32">
            <div className="absolute -top-2.5 -left-2.5 w-24 h-24 bg-[#8961d3] rounded-full opacity-100" style={{ borderRadius: '45% 55% 70% 30% / 30% 40% 60% 70%' }}></div>
            <div className="relative z-10 flex items-center w-full">
              <div className="w-14 h-14 bg-[#681cf5] rounded-full flex items-center justify-center shadow-inner">
                <Users size={24} className="text-white" />
              </div>
              <div className="flex-1 text-center">
                <p className="text-sm text-gray-500 font-semibold">Placed</p>
                <h3 className="text-3xl font-bold text-gray-800">312</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Card */}
        <div className="relative w-full max-w-2xl h-52 bg-[#0c0c0c] rounded-[40px] p-6 overflow-hidden flex flex-col justify-between shadow-xl">
          <svg className="absolute right-0 top-0 h-full opacity-20 pointer-events-none" viewBox="0 0 200 200">
            <path fill="none" stroke="white" strokeWidth="1.5" d="M100,20 C150,50 50,150 180,180" strokeLinecap="round" />
          </svg>
          <div className="flex justify-between items-start relative z-10">
            <div className="w-10 h-10 bg-[#26282b] rounded-full flex items-center justify-center border border-gray-600">
              <Box className="text-[#dd6510] w-4 h-4" />
            </div>
          </div>
          <div className="relative z-10 space-y-1">
            <p className="text-orange-200 text-xs font-bold tracking-[0.18em] uppercase">Pending Action</p>
            <h2 className="text-white text-xl font-bold leading-snug max-w-sm">Review 14 new Senior Interview Experiences</h2>
          </div>
          <div className="flex justify-between items-end relative z-10">
            <div className="flex items-center">
              <span className="text-white font-bold text-sm opacity-70">Awaiting Approval</span>
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
          <h2 className="text-3xl font-bold tracking-tight">Placement Velocity</h2>
          <div className="bg-gray-100 rounded-2xl px-5 py-2.5 text-xs font-bold flex items-center gap-2 cursor-pointer border border-gray-200">
            This Month <MoreHorizontal size={14} />
          </div>
        </div>

        {/* Orange Activity Display Area */}
        <div className="bg-[#FFA365] rounded-[45px] p-10 mb-8 relative overflow-hidden shrink-0">
          <div className="flex gap-12 mb-10 relative z-10">
            <h3 className="text-4xl font-bold">14 <span className="text-lg font-medium">Drives</span></h3>
            <h3 className="text-4xl font-bold">82 <span className="text-lg font-medium">Offers</span></h3>
          </div>

          <div className="flex items-end justify-between h-44 px-2 relative z-10">
            {[
              { day: 'W1', h: 'h-16', val: 12 },
              { day: 'W2', h: 'h-32', val: 28 },
              { day: 'W3', h: 'h-44', val: 42, active: true },
              { day: 'W4', h: 'h-24', val: 18 }
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

        {/* Top Performers Bar */}
        <div className="flex justify-between items-center p-6 bg-gray-50 rounded-[35px] border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#ffdd67] rounded-full flex items-center justify-center text-white shadow-md">★</div>
            <div>
              <p className="font-bold text-base leading-tight">Top Packages</p>
              <p className="text-xs text-gray-400">Highest offers this season</p>
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
        <div
          className="bg-[#121212] rounded-[40px] p-6 shadow-2xl border border-white/10 cursor-pointer transition-all duration-500 hover:border-[#d4af37]"
          onMouseEnter={() => setShowFullCalendar(true)}
          onMouseLeave={() => setShowFullCalendar(false)}
        >
          <h2 className="text-2xl font-serif font-black leading-tight mb-2 text-white">
            Upcoming <span className="inline-block ml-1">📅</span><br />
            Schedules
          </h2>
          <p className="text-[10px] text-[#d4af37] font-bold uppercase tracking-widest flex items-center gap-2 mb-6">
            📦 Drive Dates
          </p>
          <div className="flex justify-between">
            {[
              { day: "Mon", date: 20, done: true },
              { day: "Tue", date: 21, done: true },
              { day: "Wed", date: 22, active: true },
              { day: "Thr", date: 23 },
              { day: "Fri", date: 24 },
            ].map((item) => (
              <div key={item.date} className={`rounded-[26px] px-2 py-3 flex flex-col items-center gap-1 relative w-[48px] border transition-colors duration-300 ${item.active ? 'bg-[#d4af37]/20 border-[#d4af37] text-white' : 'bg-white/5 border-white/5 text-white/50'}`}>
                <span className="text-[10px] font-bold uppercase tracking-wider">{item.day}</span>
                <span className={`text-lg font-bold ${item.active ? 'text-[#d4af37]' : 'text-white'}`}>{item.date}</span>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 text-[10px] font-black ${item.done ? "bg-[#d4af37] text-black" : item.active ? "bg-[#d4af37]/50 text-black" : "bg-white/10 text-white/30"}`}>
                  {item.done ? '✓' : '•'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Highlight Card */}
        <div className="bg-[#681cf5] rounded-[40px] p-3 text-white flex items-center gap-5 shadow-lg relative overflow-hidden group cursor-pointer">
          <div className="bg-white/20 p-3 rounded-2xl relative z-10">
            <Zap size={24} fill="white" className="group-hover:animate-pulse" />
          </div>
          <div className="relative z-10">
            <p className="font-bold text-base leading-tight">Post New Drive</p>
            <p className="text-[11px] opacity-80 font-medium">Create a new company listing</p>
          </div>
        </div>

        {/* Carousel */}
        <div className="bg-white rounded-[40px] p-6 h-64 shadow-sm border border-gray-50 flex flex-col relative group">
          <div className="flex justify-between items-center mb-6">
            <p className="font-bold text-sm uppercase tracking-wider text-gray-400">Active Companies</p>
            <MoreHorizontal size={16} />
          </div>
          <div className="relative flex-1 overflow-hidden rounded-[28px]">
            <AnimatePresence mode="wait">
              <motion.div key={index} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="absolute inset-0 grid grid-cols-2 gap-3">
                <div className="relative rounded-[28px] overflow-hidden cursor-pointer">
                  <Image src={items[index].image} alt="company" fill className="object-cover hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="relative rounded-[28px] overflow-hidden cursor-pointer">
                  <Image src={items[(index + 1) % items.length].image} alt="company" fill className="object-cover hover:scale-105 transition-transform duration-300" />
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

      {/* === SLIDING FULL MONTH CALENDAR DRAWER === */}
      <AnimatePresence>
        {showFullCalendar && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-[420px] h-full bg-[#121212]/95 backdrop-blur-3xl z-50 p-10 flex flex-col shadow-[-30px_0_60px_rgba(0,0,0,0.5)] border-l border-white/10"
            onMouseEnter={() => setShowFullCalendar(true)}
            onMouseLeave={() => setShowFullCalendar(false)}
          >
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
              <h2 className="text-4xl font-serif font-black text-white">April <span className="text-[#d4af37]">2026</span></h2>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-white">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                <div key={d} className="text-center font-bold text-[#d4af37] text-[10px] uppercase tracking-widest">{d}</div>
              ))}
              {/* 3 Blanks for offset */}
              <div /><div /><div />
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 cursor-pointer
                            ${i + 1 === 22 ? 'bg-[#d4af37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-110' :
                      [20, 21].includes(i + 1) ? 'bg-[#d4af37]/20 text-[#d4af37]' :
                        [15, 28].includes(i + 1) ? 'border border-[#d4af37]/50 text-white' :
                          'text-white/70 hover:bg-white/10 hover:text-white'}`}
                >
                  {i + 1}
                </div>
              ))}
            </div>

            <div className="mt-12 space-y-4 flex-1 overflow-y-auto pr-2 scrollbar-none">
              <h3 className="text-[#d4af37] font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" /> Key Events
              </h3>

              <div className="bg-white/5 p-5 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-[#d4af37]/50 transition-colors cursor-pointer">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#d4af37]" />
                <p className="text-white font-bold text-base">Google SDE I Drive</p>
                <p className="text-white/40 text-xs font-medium mt-1 uppercase tracking-wider">April 15 • 10:00 AM</p>
                <div className="mt-3 flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/10 text-[10px] text-white font-bold">Registration</span>
                </div>
              </div>

              <div className="bg-white/5 p-5 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-[#bca33e]/50 transition-colors cursor-pointer">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#bca33e]" />
                <p className="text-white font-bold text-base">Amazon Assessment</p>
                <p className="text-white/40 text-xs font-medium mt-1 uppercase tracking-wider">April 28 • 02:00 PM</p>
                <div className="mt-3 flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/10 text-[10px] text-white font-bold">OA Link Sent</span>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 py-4 rounded-full border border-white/10 text-white/50 text-xs font-bold uppercase tracking-wider hover:bg-white/5 hover:text-white transition-all">
              View Full Year Report
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.main>
  );
}