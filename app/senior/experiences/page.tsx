"use client"

import { motion } from "framer-motion"
import {
    ArrowRight,
    Briefcase,
    Calendar,
    BarChart,
    SlidersHorizontal,
    Plus
} from "lucide-react"
import { useState } from "react"

export default function ExperiencesPage() {

    const [activeCompany, setActiveCompany] = useState("All")
    const [activeDifficulty, setActiveDifficulty] = useState("All")

    const experiences = [
        { company: "Google", role: "SDE Intern", date: "Jan 2024", difficulty: "Hard", rounds: 5, helpful: 124 },
        { company: "Amazon", role: "Frontend Engineer", date: "Feb 2024", difficulty: "Medium", rounds: 4, helpful: 98 },
        { company: "Microsoft", role: "Backend Engineer", date: "Mar 2024", difficulty: "Hard", rounds: 6, helpful: 156 },
        { company: "Netflix", role: "UI Engineer", date: "Apr 2024", difficulty: "Medium", rounds: 3, helpful: 88 },
    ]

    return (
        <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white rounded-[40px] p-4 h-full overflow-hidden text-black"
        >

            {/* ================= LEFT ================= */}
            <div className="lg:col-span-9 bg-[#f5f5f5] rounded-[50px] p-8 overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

                {/* Header Row */}
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-bold">Interview Experiences</h2>

                    <button className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition">
                        <Plus size={16} />
                        Add Experience
                    </button>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                    {experiences.map((exp, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="relative h-64 bg-[#0c0c0c] rounded-[40px] p-6 overflow-hidden shadow-xl group"
                        >

                            {/* Scribble */}
                            <svg className="absolute right-0 top-0 h-full opacity-20" viewBox="0 0 200 200">
                                <path
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    d="M100,20 C150,50 50,150 180,180"
                                    strokeLinecap="round"
                                />
                            </svg>

                            {/* Top */}
                            <div className="flex justify-between relative z-10">
                                <div className="w-10 h-10 bg-[#26282b] rounded-full border border-gray-600 flex items-center justify-center text-white">
                                    <Briefcase size={16} />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="relative z-10 mt-4 space-y-2">
                                <p className="text-orange-300 text-xs font-bold tracking-[0.18em] uppercase">
                                    {exp.company}
                                </p>

                                <h2 className="text-white text-lg font-bold leading-snug">
                                    {exp.role}
                                </h2>

                                <div className="text-white text-sm opacity-80 space-y-1">
                                    <p className="flex items-center gap-1">
                                        <Calendar size={14} /> {exp.date}
                                    </p>
                                    <p className="flex items-center gap-1">
                                        <BarChart size={14} /> {exp.rounds} rounds • {exp.difficulty}
                                    </p>
                                </div>
                            </div>

                            {/* Bottom */}
                            <div className="flex justify-between items-end relative z-10 mt-auto">

                                <div className="text-white font-semibold text-sm">
                                    ⭐ {exp.helpful} helpful
                                </div>

                                <div className="relative w-12 h-12 flex items-center justify-center group">
                                    <svg
                                        className="absolute inset-0 w-full h-full -rotate-90"
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
                                            className="stroke-dasharray-[289] stroke-dashoffset-[289] transition-all duration-700 group-hover:stroke-dashoffset-0"
                                        />
                                    </svg>

                                    <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center transition group-hover:scale-105">
                                        <ArrowRight className="w-4 h-4 text-black" />
                                    </button>
                                </div>
                            </div>

                        </motion.div>
                    ))}
                </div>
            </div>


            {/* ================= RIGHT PANEL ================= */}
            {/* ================= RIGHT PANEL ================= */}
{/* Added: overflow-y-auto and scrollbar hiding utilities */}
<div className="lg:col-span-3 flex flex-col gap-4 h-full overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-10">

    {/* Smart Filters */}
    <div className="bg-white rounded-[40px] p-6 shadow-sm border border-gray-50 space-y-5">
        <h3 className="font-bold flex items-center gap-2">
            <SlidersHorizontal size={16} /> Smart Filters
        </h3>

        {/* Company */}
        <div>
            <p className="text-xs text-gray-400 font-semibold uppercase mb-2">Company</p>
            <div className="flex flex-wrap gap-2">
                {["All", "Google", "Amazon", "Microsoft", "Netflix"].map(c => (
                    <button
                        key={c}
                        onClick={() => setActiveCompany(c)}
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition
                        ${activeCompany === c
                            ? "bg-black text-white"
                            : "bg-gray-100 hover:bg-black hover:text-white"
                        }`}
                    >
                        {c}
                    </button>
                ))}
            </div>
        </div>

        {/* Difficulty */}
        <div>
            <p className="text-xs text-gray-400 font-semibold uppercase mb-2">Difficulty</p>
            <div className="flex flex-wrap gap-2">
                {["All", "Easy", "Medium", "Hard"].map(d => (
                    <button
                        key={d}
                        onClick={() => setActiveDifficulty(d)}
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition
                        ${activeDifficulty === d
                            ? "bg-black text-white"
                            : "bg-gray-100 hover:bg-black hover:text-white"
                        }`}
                    >
                        {d}
                    </button>
                ))}
            </div>
        </div>
    </div>

    {/* ===== ANALYTICS GRAPH ===== */}
    <div className="bg-[#FFA365] rounded-[45px] p-8 shadow-xl relative shrink-0"> {/* Added shrink-0 to prevent compression */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#ffb988] rounded-full opacity-40 blur-2xl" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#ffd3b0] rounded-full opacity-40 blur-2xl" />

        <h3 className="relative z-10 text-2xl font-bold mb-8">
            Q → Like Ratio
        </h3>

        <div className="relative z-10 flex items-end justify-between h-44 px-2">
            {[
                { day: 'Mon', h: 'h-32', val: 39 },
                { day: 'Tue', h: 'h-16', val: 14 },
                { day: 'Wed', h: 'h-44', val: 48, active: true },
                { day: 'Thu', h: 'h-24', val: 24 },
                { day: 'Fri', h: 'h-32', val: 22 }
            ].map((bar) => (
                <div key={bar.day} className="flex flex-col items-center gap-4">
                    <div
                        className={`w-12 ${bar.h} rounded-full relative transition-all duration-300
                        ${bar.active
                                ? "bg-black text-white scale-110 shadow-xl"
                                : "bg-[#dc7c0f] text-white opacity-90"
                        }`}
                    >
                        <span className="absolute top-3 w-full text-center text-xs font-bold">
                            {bar.val}
                        </span>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-tighter text-black">
                        {bar.day}
                    </span>
                </div>
            ))}
        </div>
    </div>
</div>

        </motion.main>
    )
}
