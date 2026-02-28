"use client"

import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, BookOpen, Clock, Zap, ArrowUpRight, MoreHorizontal, Calendar, ArrowRight, Box, Share, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

export default function DashboardLayout() {

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
      {/* #1783e1 */}
      {/* #681cf5 */}
      {/* === LEFT COLUMN: Stats & Promo === */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        {/* Promo Card */}
        <div className="bg-gradient-to-br from-[#2E8BFF] to-[#0066FF] rounded-[40px] p-8 relative overflow-hidden h-75 flex shadow-lg shadow-blue-200/40 group border border-blue-400/20">
          {/* Decorative Background Blob */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>

          {/* Left Content */}
          <div className="z-10 max-w-[60%] flex flex-col justify-center">
            <h2 className="text-white text-3xl font-extrabold leading-tight mb-3 tracking-tight">
              A series of <br /> Olympiads
            </h2>

            <p className="text-sm text-white/80 mb-6 font-medium leading-relaxed">
              For erudite people from all over the world
            </p>

            <button className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-md hover:scale-105 hover:bg-blue-50 transition-all cursor-pointer">
              <ArrowUpRight size={24} strokeWidth={2.5} />
            </button>
          </div>

          {/* Big Trophy */}
          <Trophy
            className="absolute -right-6 -bottom-8 w-56 h-56 text-white opacity-20 rotate-12 group-hover:rotate-6 group-hover:scale-105 transition-all duration-700 ease-out"
          />
        </div>


        {/* Dual Stat Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Lessons Card */}
          <div className="relative overflow-hidden bg-white rounded-[35px] py-6 px-5 flex flex-col justify-center shadow-sm border border-orange-50/80 h-36 group hover:shadow-md transition-shadow">
            {/* The Decorative Blob Background */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-[#ffd9b8] to-[#ffc099] rounded-full opacity-40 group-hover:scale-110 transition-transform duration-500 ease-out"
              style={{ borderRadius: '45% 55% 70% 30% / 30% 40% 60% 70%' }}></div>

            <div className="relative z-10 flex flex-col gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#ff9b52] to-[#e67b2f] rounded-[18px] flex items-center justify-center shadow-md shadow-orange-200 rounded-tl-[10px] rounded-br-[10px]">
                <BookOpen size={20} className="text-white" />
              </div>

              <div className="flex items-baseline gap-2">
                <h3 className="text-[32px] font-extrabold text-gray-800 leading-none">78</h3>
                <p className="text-sm text-gray-500 font-bold tracking-wide">Lessons</p>
              </div>
            </div>
          </div>

          {/* Hours Card */}
          <div className="relative overflow-hidden bg-white rounded-[35px] py-6 px-5 flex flex-col justify-center shadow-sm border border-purple-50/80 h-36 group hover:shadow-md transition-shadow">
            {/* The Decorative Blob Background */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-[#eadfff] to-[#d8c4fa] rounded-full opacity-60 group-hover:scale-110 transition-transform duration-500 ease-out"
              style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}></div>

            <div className="relative z-10 flex flex-col gap-3 items-end text-right">
              <div className="w-12 h-12 bg-gradient-to-br from-[#8444f6] to-[#681cf5] rounded-[18px] flex items-center justify-center shadow-md shadow-purple-200 rounded-tr-[10px] rounded-bl-[10px]">
                <Clock size={20} className="text-white" />
              </div>

              <div className="flex items-baseline gap-2 flex-row-reverse">
                <h3 className="text-[32px] font-extrabold text-gray-800 leading-none">43</h3>
                <p className="text-sm text-gray-500 font-bold tracking-wide">Hours</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-full max-w-2xl h-52 bg-[#1A1A24] rounded-[40px] p-6 overflow-hidden flex flex-col justify-between shadow-lg shadow-gray-200/50 group border border-gray-100">

          {/* Background Scribble */}
          <svg
            className="absolute right-0 top-0 h-full opacity-20 pointer-events-none"
            viewBox="0 0 200 200"
          >
            <path
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              d="M100,20 C150,50 50,150 180,180"
              strokeLinecap="round"
            />
          </svg>

          {/* Top */}
          <div className="flex justify-between items-start relative z-10">
            <div className="w-10 h-10 bg-[#26282b] rounded-full flex items-center justify-center border border-gray-600">
              <Box className="text-[#dd6510] w-4 h-4" />
            </div>

            <button className="w-9 h-9 bg-[#4e5055] rounded-full flex items-center justify-center">
              <Share className="text-white w-4 h-4" />
            </button>
          </div>

          {/* Text */}
          <div className="relative z-10 space-y-1">
            <p className="text-orange-200 text-xs font-bold tracking-[0.18em] uppercase">
              Geometry in Action
            </p>
            <h2 className="text-white text-xl font-bold leading-snug max-w-sm">
              Creative approaches to plane shapes
            </h2>
          </div>

          {/* Bottom */}
          <div className="flex justify-between items-end relative z-10">

            {/* Avatars */}
            <div className="flex items-center">
              <div className="flex -space-x-3">
                <div className="w-9 h-9 rounded-full border-2 border-[#2D2F33] bg-yellow-100 flex items-center justify-center text-lg">👨🏻‍💻</div>
                <div className="w-9 h-9 rounded-full border-2 border-[#2D2F33] bg-purple-100 flex items-center justify-center text-lg">👨🏻</div>
                <div className="w-9 h-9 rounded-full border-2 border-[#2D2F33] bg-green-100 flex items-center justify-center text-lg">👩🏻‍🎨</div>
              </div>
              <span className="ml-4 text-white font-bold text-lg">+43</span>
            </div>

            {/* CTA */}
            <div className="relative group flex items-center justify-center">

              {/* SVG animated ring */}
              <svg
                className="absolute w-14 h-14 -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="#FDBA74"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="
        stroke-dasharray-[289]
        stroke-dashoffset-[289]
        transition-all duration-700 ease-in-out
        group-hover:stroke-dashoffset-0
      "
                />
              </svg>

              {/* Button */}
              <button
                className="
      w-12 h-12 bg-white rounded-full 
      flex items-center justify-center
      transition-transform duration-300 ease-in-out
      group-hover:scale-105
      cursor-pointer
    "
              >
                <ArrowRight className="text-black w-4 h-4" />
              </button>

            </div>


          </div>
        </div>

      </div>

      {/* === CENTER COLUMN: Main Progress (The White Background Main Part) === */}
      <div className="lg:col-span-5 bg-[#f5f5f5] rounded-[50px] p-10 flex flex-col shadow-sm h-full 
                max-h-screen 
                overflow-y-auto 
                scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Progress</h2>
          <div className="bg-gray-100 rounded-2xl px-5 py-2.5 text-xs font-bold flex items-center gap-2 cursor-pointer border border-gray-200">
            All subjects <MoreHorizontal size={14} />
          </div>
        </div>

        {/* Gradient Progress Display Area */}
        <div className="bg-gradient-to-br from-[#FF9654] to-[#FF6A13] rounded-[45px] p-8 sm:p-10 mb-8 relative overflow-hidden shrink-0 shadow-lg shadow-orange-200/50">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-[0.08] rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-[0.08] rounded-full blur-2xl translate-y-1/3 -translate-x-1/3"></div>

          <div className="flex gap-10 sm:gap-14 mb-10 relative z-10">
            <h3 className="text-[40px] font-extrabold text-white leading-none">48 <span className="text-lg font-bold opacity-90 tracking-wide">lessons</span></h3>
            <h3 className="text-[40px] font-extrabold text-white leading-none">12 <span className="text-lg font-bold opacity-90 tracking-wide">hours</span></h3>
          </div>

          {/* Interactive Bar Chart */}
          <div className="flex items-end justify-between h-48 px-1 relative z-10">
            {[
              { day: 'Mon', h: 'h-28', val: 39 },
              { day: 'Tue', h: 'h-16', val: 14 },
              { day: 'Wed', h: 'h-44', val: 48, active: true },
              { day: 'Thu', h: 'h-20', val: 24 },
              { day: 'Fri', h: 'h-32', val: 22 }
            ].map((bar) => (
              <div key={bar.day} className="flex flex-col items-center gap-3 group">
                <div className={`w-12 sm:w-14 ${bar.h} rounded-[24px] relative transition-all duration-400 ease-out cursor-pointer group-hover:scale-105 ${bar.active ? 'bg-white text-orange-500 shadow-xl' : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm shadow-sm'}`}>
                  <span className={`absolute top-4 w-full text-center text-sm font-bold ${bar.active ? 'text-orange-600' : 'text-white'}`}>{bar.val}</span>
                </div>
                <span className="text-xs font-extrabold text-white uppercase tracking-widest opacity-95">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Student Stats Bar */}
        <div className="flex justify-between items-center p-5 bg-white rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer mx-1">
          <div className="absolute right-0 top-0 w-40 h-full bg-gradient-to-l from-gray-50 to-transparent"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 bg-gradient-to-br from-[#ffe785] to-[#ffc837] rounded-[22px] flex items-center justify-center text-white shadow-md text-xl transform group-hover:rotate-[10deg] transition-transform">★</div>
            <div>
              <p className="font-extrabold text-[17px] text-gray-800 leading-tight tracking-tight">Rating of students</p>
              <p className="text-[13px] text-gray-400 font-medium mt-0.5">10 best students this week</p>
            </div>
          </div>
          <div className="flex -space-x-2 relative z-10 pr-2">
            {[
              { color: 'bg-blue-100', emoji: '🧑‍🎓', bg: 'z-30' },
              { color: 'bg-purple-100', emoji: '👩‍🏫', bg: 'z-20' },
              { color: 'bg-green-100', emoji: '👨‍🔬', bg: 'z-10' }
            ].map((i, idx) => (
              <div key={idx} className={`w-11 h-11 rounded-full border-[3px] border-white ${i.color} flex items-center justify-center shadow-sm ${i.bg} relative hover:-translate-y-1 hover:scale-110 transition-all cursor-pointer`}>
                <span className="text-sm">{i.emoji}</span>
              </div>
            ))}
          </div>
        </div>


      </div>

      {/* === RIGHT COLUMN: Calendar & Suggestions === */}
      <div className="lg:col-span-3 flex flex-col gap-4">
        <div className="bg-white rounded-[40px] p-7 shadow-sm border border-gray-50 relative overflow-hidden group">
          {/* Decorative blur */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none group-hover:bg-orange-100 transition-colors duration-700"></div>

          {/* Title */}
          <h2 className="text-[26px] font-extrabold leading-tight mb-2 relative z-10 text-gray-800 tracking-tight">
            Today’s reading <span className="inline-block ml-1 animate-bounce duration-[3000ms]">📚</span><br />
            is ready
          </h2>

          <p className="text-[13px] text-orange-500 font-bold flex items-center gap-2 mb-8 relative z-10 tracking-wide uppercase">
            📦 Charge your mind
          </p>

          {/* Days row */}
          <div className="flex justify-between relative z-10 gap-1.5">

            {[
              { day: "Mon", date: 20, done: true },
              { day: "Tue", date: 21, done: true },
              { day: "Wed", date: 22, active: true },
              { day: "Thu", date: 23 },
              { day: "Fri", date: 24 },
            ].map((item) => (
              <div
                key={item.date}
                className={`rounded-[30px] px-2 py-4 flex flex-col items-center gap-1.5 relative flex-1 transition-all duration-300 cursor-pointer
                  ${item.active ? 'bg-[#1C1A27] shadow-xl shadow-gray-200 scale-105 -translate-y-1' : 'bg-[#f8f9fa] hover:bg-gray-100'}`}
              >
                <span className={`text-[11px] font-bold uppercase tracking-wider ${item.active ? 'text-gray-400' : 'text-gray-400'}`}>
                  {item.day}
                </span>

                <span className={`text-[22px] font-extrabold ${item.active ? 'text-white' : 'text-gray-800'}`}>
                  {item.date}
                </span>

                {/* tiny book badge */}
                <div
                  className={`w-8 h-8 rounded-[12px] flex items-center justify-center mt-1 transition-colors
            ${item.done ? "bg-[#FFE8D6]" : item.active ? "bg-[#333333]" : "bg-[#EDF7E8]"}`}
                >
                  <span className={`${item.active ? 'opacity-60 grayscale' : ''} text-[13px] drop-shadow-sm`}>📖</span>
                </div>

                {/* completed check */}
                {item.done && (
                  <span className="absolute -top-1 -right-1 w-[22px] h-[22px] bg-[#1C1A27] text-white text-[11px] font-bold flex items-center justify-center rounded-full border-[3px] border-white shadow-sm z-10">
                    ✓
                  </span>
                )}
              </div>
            ))}

          </div>
        </div>


        {/* Routine Highlight Card */}
        <div className="bg-gradient-to-r from-[#681cf5] to-[#8646f6] rounded-[35px] p-4 text-white flex items-center gap-5 shadow-lg shadow-purple-200/40 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="bg-white/20 p-3.5 rounded-[22px] relative z-10 backdrop-blur-sm border border-white/10 shadow-inner">
            <Zap size={22} fill="white" className="group-hover:animate-bounce" />
          </div>
          <div className="relative z-10 flex flex-col py-1">
            <p className="font-extrabold text-[17px] leading-tight tracking-tight">Reading routine</p>
            <p className="text-[12px] text-white/80 font-bold tracking-wide mt-1">Progress: 76% complete</p>
          </div>
        </div>

        {/* Secondary Recommended Content */}
        <div className="bg-white rounded-[40px] p-6 h-64 shadow-sm border border-gray-50 flex flex-col relative group">
          {/* Header */}
          <div className="flex justify-between items-center mb-5 mt-1">
            <p className="font-extrabold text-[13px] uppercase tracking-widest text-gray-400">Recommended</p>
            <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm">
              <MoreHorizontal size={18} className="text-gray-500" />
            </button>
          </div>

          {/* Carousel Container */}
          <div className="relative flex-1 overflow-hidden rounded-[28px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute inset-0 grid grid-cols-2 gap-3"
              >
                {/* First image */}
                <div className="relative rounded-[28px] overflow-hidden cursor-pointer">
                  <Image
                    src={items[index].image}
                    alt="item"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Second image */}
                <div className="relative rounded-[28px] overflow-hidden cursor-pointer">
                  <Image
                    src={items[(index + 1) % items.length].image}
                    alt="item"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows - Using absolute positioning to stay on the edges */}
          <button
            onClick={prevStep}
            className="absolute left-2 top-37.5 cursor-pointer -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={nextStep}
            className="absolute right-2 top-37.5 cursor-pointer -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

    </motion.main>
    // </div>
  );
}