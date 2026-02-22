// app/student/drives/page.tsx

"use client"

import { motion } from "framer-motion"
import {
    ArrowRight,
    Briefcase,
    Calendar,
    MapPin,
    SlidersHorizontal,
    Search
} from "lucide-react"
import { useState } from "react"

export default function StudentDrivesPage() {

    const [activeCompany, setActiveCompany] = useState("All")
    const [activeRole, setActiveRole] = useState("All")

    const drives = [
        { company: "Google", role: "Software Engineer", date: "Oct 15, 2026", location: "Bangalore", ctc: "24 LPA", applicants: 142 },
        { company: "Amazon", role: "Frontend Developer", date: "Oct 18, 2026", location: "Hyderabad", ctc: "18 LPA", applicants: 98 },
        { company: "Microsoft", role: "Backend Engineer", date: "Oct 22, 2026", location: "Noida", ctc: "22 LPA", applicants: 156 },
        { company: "Atlassian", role: "UI/UX Designer", date: "Nov 05, 2026", location: "Remote", ctc: "16 LPA", applicants: 88 },
    ]

    return (
        <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white rounded-[40px] p-4 h-full overflow-hidden text-black"
        >

            {/* ================= LEFT (DRIVES FEED) ================= */}
            <div className="lg:col-span-9 bg-[#f5f5f5] rounded-[50px] p-8 overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

                {/* Header Row */}
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-bold">Upcoming Drives</h2>

                    {/* Search Bar */}
                    <div className="flex items-center bg-white rounded-full px-5 py-3 shadow-sm border border-gray-100 w-full max-w-xs">
                        <Search size={20} className="text-gray-400" />
                        <input
                            placeholder="Search companies..."
                            className="ml-3 flex-1 bg-transparent outline-none text-sm"
                        />
                    </div>
                </div>

                {/* DRIVES GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                    {drives.map((drive, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="relative h-64 bg-[#0c0c0c] rounded-[40px] p-6 overflow-hidden shadow-xl group cursor-pointer"
                        >

                            {/* Decorative Scribble from Lead's Design */}
                            <svg className="absolute right-0 top-0 h-full opacity-20 transition-opacity group-hover:opacity-40" viewBox="0 0 200 200">
                                <path
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    d="M100,20 C150,50 50,150 180,180"
                                    strokeLinecap="round"
                                />
                            </svg>

                            {/* Top Icon */}
                            <div className="flex justify-between relative z-10">
                                <div className="w-10 h-10 bg-[#26282b] rounded-full border border-gray-600 flex items-center justify-center text-white">
                                    <Briefcase size={16} />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="relative z-10 mt-4 space-y-2">
                                <p className="text-orange-300 text-xs font-bold tracking-[0.18em] uppercase">
                                    {drive.company}
                                </p>

                                <h2 className="text-white text-lg font-bold leading-snug">
                                    {drive.role}
                                </h2>

                                <div className="text-white text-sm opacity-80 space-y-1 mt-2">
                                    <p className="flex items-center gap-2">
                                        <Calendar size={14} className="text-[#b4a9f8]" /> {drive.date}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <MapPin size={14} className="text-[#b4a9f8]" /> {drive.location}
                                    </p>
                                </div>
                            </div>

                            {/* Bottom CTA & Stats */}
                            <div className="flex justify-between items-end relative z-10 mt-auto">
                                <div className="text-white font-semibold text-sm">
                                    <span className="text-green-400">{drive.ctc}</span>
                                </div>

                                <div className="relative w-12 h-12 flex items-center justify-center group/btn">
                                    <svg
                                        className="absolute inset-0 w-full h-full -rotate-90"
                                        viewBox="0 0 100 100"
                                    >
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="46"
                                            fill="none"
                                            stroke="#1783e1"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            className="stroke-dasharray-[289] stroke-dashoffset-[289] transition-all duration-700 group-hover/btn:stroke-dashoffset-0"
                                        />
                                    </svg>
                                    <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center transition group-hover/btn:scale-105">
                                        <ArrowRight className="w-4 h-4 text-black" />
                                    </button>
                                </div>
                            </div>

                        </motion.div>
                    ))}
                </div>
            </div>

            {/* ================= RIGHT PANEL (FILTERS) ================= */}
            <div className="lg:col-span-3 flex flex-col gap-4 h-full overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-10">

                {/* Smart Filters */}
                <div className="bg-white rounded-[40px] p-6 shadow-sm border border-gray-50 space-y-5">
                    <h3 className="font-bold flex items-center gap-2">
                        <SlidersHorizontal size={16} /> Filter Drives
                    </h3>

                    {/* Company Filter */}
                    <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase mb-2">Target Companies</p>
                        <div className="flex flex-wrap gap-2">
                            {["All", "MAANG", "Fintech", "Startups", "Service Based"].map(c => (
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

                    {/* Role Filter */}
                    <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase mb-2">Role Type</p>
                        <div className="flex flex-wrap gap-2">
                            {["All", "SDE", "Frontend", "Backend", "Data Science"].map(r => (
                                <button
                                    key={r}
                                    onClick={() => setActiveRole(r)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition
                                    ${activeRole === r
                                            ? "bg-black text-white"
                                            : "bg-gray-100 hover:bg-black hover:text-white"
                                        }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ===== MINI STAT GRAPH (Using Lead's Orange Style) ===== */}
                <div className="bg-[#FFA365] rounded-[45px] p-8 shadow-xl relative overflow-hidden flex-shrink-0 mt-auto">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#ffb988] rounded-full opacity-40 blur-2xl" />
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#ffd3b0] rounded-full opacity-40 blur-2xl" />

                    <h3 className="relative z-10 text-xl font-bold mb-6 leading-tight">
                        Your Application<br/>Velocity
                    </h3>

                    <div className="relative z-10 flex items-end justify-between h-32 px-1">
                        {[
                            { day: 'W1', val: 2 },
                            { day: 'W2', val: 5, active: true },
                            { day: 'W3', val: 3 },
                            { day: 'W4', val: 4 }
                        ].map((bar) => (
                            <div key={bar.day} className="flex flex-col items-center gap-3">
                                <div
                                    className={`w-10 rounded-full relative transition-all duration-300
                                    ${bar.active
                                            ? "bg-black text-white scale-110 shadow-xl"
                                            : "bg-[#dc7c0f] text-white opacity-90"}
                                    `}
                                    style={{ height: `${bar.val * 20}px` }}
                                >
                                    <span className="absolute top-2 w-full text-center text-xs font-bold">
                                        {bar.val}
                                    </span>
                                </div>
                                <span className="text-xs font-bold uppercase tracking-tight text-black">
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