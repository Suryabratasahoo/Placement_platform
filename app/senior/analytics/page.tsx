"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Flame, Award, TrendingUp, Users, MoreHorizontal, Star, Zap } from "lucide-react"
import { useState } from "react"
import { QuestionsLoading } from "../loadingContent"   
import { useEffect } from "react" 

export default function AnalyticsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [hoveredBar, setHoveredBar] = useState<number | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 100);
        return () => clearTimeout(timer);
    }, []);

    const pieData = [
        { label: "CSE", value: 40, color: "#818cf8" },
        { label: "ECE", value: 25, color: "#fb923c" },
        { label: "MEC", value: 15, color: "#93c5fd" },
        { label: "CIVIL", value: 10, color: "#facc15" },
        { label: "IT", value: 10, color: "#f472b6" },
    ];

    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    let cumulativeOffset = 0;

    const barData = [
        { day: 'Mon', percentage: 60, val: 39 },
        { day: 'Tue', percentage: 30, val: 14 },
        { day: 'Wed', percentage: 90, val: 48, active: true },
        { day: 'Thu', percentage: 45, val: 24 },
        { day: 'Fri', percentage: 55, val: 22 }
    ];

    return (
        <AnimatePresence mode="wait">
            {isLoading ? (
                <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="p-4 h-screen bg-white"
                >
                    <QuestionsLoading />
                </motion.div>
            ) : (
        <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white rounded-[40px] p-4 h-screen overflow-hidden text-black font-sans"
        >

            {/* === LEFT COLUMN === */}
            <div className="lg:col-span-3 flex flex-col gap-4">
                <div className="bg-[#681cf5] rounded-[40px] p-8 relative overflow-hidden h-64 flex flex-col justify-between shadow-lg">
                    <div className="z-10">
                        <p className="text-white/70 text-sm font-bold tracking-widest uppercase mb-1">Current Status</p>
                        <h2 className="text-white text-3xl font-bold leading-tight">Mentor <br /> Level 4</h2>
                    </div>
                    <div className="z-10 flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-2xl p-3 w-fit">
                        <Zap size={20} fill="white" className="text-white" />
                        <span className="text-white font-bold text-sm">Top 2% this week</span>
                    </div>
                    <Award className="absolute -right-8 -bottom-8 w-48 h-48 text-white opacity-10 rotate-12" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {[
                        { label: "Answered", value: 128, color: "bg-[#fdecdb]", iconColor: "#e67b2f", icon: <Star size={16}/> },
                        { label: "Helped", value: 356, color: "bg-[#e2e0f7]", iconColor: "#681cf5", icon: <Users size={16}/> },
                    ].map((s, i) => (
                        <div key={i} className="relative overflow-hidden bg-white border-[3px] border-gray-50 rounded-[35px] p-5 flex flex-col items-center justify-center shadow-sm h-36">
                            <div className="w-10 h-10 rounded-full mb-2 flex items-center justify-center" style={{ backgroundColor: s.color, color: s.iconColor }}>
                                {s.icon}
                            </div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">{s.label}</p>
                            <h3 className="text-2xl font-black text-gray-800">{s.value}</h3>
                        </div>
                    ))}
                </div>

                <div className="bg-[#0c0c0c] rounded-[40px] p-6 flex items-center justify-between shadow-xl mt-auto">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#26282b] rounded-full flex items-center justify-center border border-gray-700">
                            <Flame className="text-[#dd6510]" />
                        </div>
                        <div>
                            <p className="text-white font-bold text-lg">12 Day Streak</p>
                            <p className="text-orange-200/60 text-xs uppercase tracking-widest font-bold">Unstoppable</p>
                        </div>
                    </div>
                    <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center group">
                        <TrendingUp size={18} className="text-black group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            </div>

            {/* === RIGHT COLUMN === */}
            <div className="lg:col-span-9 bg-[#f5f5f5] rounded-[50px] p-10 flex flex-col gap-6 overflow-y-auto scrollbar-none">
                
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold tracking-tight">Contributions</h2>
                    <div className="bg-white border border-gray-200 rounded-2xl px-5 py-2.5 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm">
                        Weekly View <MoreHorizontal size={14} />
                    </div>
                </div>

                {/* FIXED ANIMATED BAR CHART */}
                <div className="bg-[#FFA365] rounded-[45px] p-10 relative">
                    <div className="flex gap-12 mb-10 relative z-10 text-black font-sans">
                        <h3 className="text-4xl font-bold">48 <span className="text-lg font-medium opacity-70">lessons</span></h3>
                        <h3 className="text-4xl font-bold">12 <span className="text-lg font-medium opacity-70">hours</span></h3>
                    </div>

                    {/* Container with defined height for bars */}
                    <div className="flex items-end justify-between h-56 px-4 relative z-10">
                        {barData.map((bar, i) => (
                            <div 
                                key={bar.day} 
                                className="flex flex-col items-center gap-4 h-full justify-end"
                                onMouseEnter={() => setHoveredBar(i)}
                                onMouseLeave={() => setHoveredBar(null)}
                            >
                                <div className="relative flex flex-col items-center group cursor-pointer h-full justify-end">
                                    {/* Tooltip */}
                                    <AnimatePresence>
                                        {hoveredBar === i && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                                animate={{ opacity: 1, y: -10, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                                                className="absolute -top-12 bg-black text-white text-[10px] px-3 py-1.5 rounded-xl font-bold z-20 whitespace-nowrap shadow-xl"
                                            >
                                                {bar.val} contributions
                                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <motion.div 
                                        initial={{ height: 0 }}
                                        animate={{ height: `${bar.percentage}%` }}
                                        transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                        className={`w-16 rounded-full relative overflow-hidden flex items-start justify-center pt-4 transition-all duration-300 ${bar.active ? 'bg-black text-white shadow-2xl scale-[1.02]' : 'bg-[#dc7c0f] text-white opacity-90'}`}
                                    >
                                        <motion.span 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 1 + (i * 0.1) }}
                                            className="text-xs font-black"
                                        >
                                            {bar.val}
                                        </motion.span>
                                    </motion.div>
                                </div>
                                <span className="text-xs font-bold text-white uppercase tracking-widest">{bar.day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* ANIMATED LINE CHART */}
                    <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-50 flex flex-col justify-between">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg text-gray-800">Growth Curve</h3>
                            <Zap size={16} className="text-orange-400" />
                        </div>
                        <div className="h-44 w-full relative">
                            <svg viewBox="0 0 400 150" className="w-full h-full">
                                <motion.path 
                                    d="M0,120 C50,110 80,20 150,80 S 250,140 400,30" 
                                    fill="none" 
                                    stroke="#681cf5" 
                                    strokeWidth="6" 
                                    strokeLinecap="round" 
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 2, ease: "easeInOut" }}
                                />
                                <motion.circle 
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 2 }}
                                    cx="400" cy="30" r="7" fill="#681cf5" 
                                />
                                <motion.circle 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0, 0.2, 0] }}
                                    transition={{ delay: 2, repeat: Infinity, duration: 2 }}
                                    cx="400" cy="30" r="15" fill="#681cf5" 
                                />
                            </svg>
                        </div>
                    </div>

                    {/* ANIMATED DONUT CHART */}
                    <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-50 flex flex-col items-center relative overflow-hidden">
                        <div className="flex justify-between w-full mb-2">
                            <h3 className="font-bold text-lg text-gray-800">Branch Distribution</h3>
                        </div>

                        <div className="relative w-56 h-56 mt-2">
                            <svg viewBox="0 0 240 240" className="w-full h-full -rotate-90">
                                {pieData.map((slice, i) => {
                                    const strokeDashoffset = circumference - (slice.value / 100) * circumference;
                                    const currentOffset = cumulativeOffset;
                                    cumulativeOffset += (slice.value / 100) * circumference;

                                    return (
                                        <motion.circle
                                            key={i}
                                            cx="120"
                                            cy="120"
                                            r={radius}
                                            fill="transparent"
                                            stroke={slice.color}
                                            strokeWidth="28"
                                            strokeDasharray={circumference}
                                            initial={{ strokeDashoffset: circumference }}
                                            animate={{ strokeDashoffset: strokeDashoffset }}
                                            transition={{ duration: 1.2, delay: i * 0.15, ease: "easeOut" }}
                                            style={{
                                                transformOrigin: "center",
                                                transform: `rotate(${(currentOffset / circumference) * 360}deg)`,
                                            }}
                                            strokeLinecap="butt"
                                        />
                                    );
                                })}
                                <circle cx="120" cy="120" r="50" fill="white" />
                            </svg>

                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <motion.span 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                    className="text-xl font-black text-gray-900 leading-none"
                                >
                                    100%
                                </motion.span>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Total</span>
                            </div>

                            <div className="absolute inset-0 pointer-events-none font-bold text-[9px] tracking-tight text-gray-700">
                                <span className="absolute bottom-[4%] left-1/2 -translate-x-1/2">CSE (40%)</span>
                                <span className="absolute top-[45%] left-[-10%]">ECE (25%)</span>
                                <span className="absolute top-[10%] left-[10%]">MEC (15%)</span>
                                <span className="absolute top-[5%] right-[15%]">CIVIL</span>
                                <span className="absolute top-[35%] right-[-8%]">IT</span>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            {pieData.slice(0, 3).map((item, i) => (
                                <div key={i} className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-[9px] font-bold text-gray-400 uppercase">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.main>
            )}
        </AnimatePresence>
    )
}
