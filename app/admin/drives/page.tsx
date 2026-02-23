// app/admin/drives/page.tsx

"use client"

import { motion } from "framer-motion"
import {
    ArrowRight,
    Briefcase,
    Calendar,
    Users,
    SlidersHorizontal,
    Plus,
    CheckCircle,
    Clock,
    Zap // <--- Added Zap right here!
} from "lucide-react"

import { useState } from "react"

export default function AdminDrivesPage() {

    const [activeStatus, setActiveStatus] = useState("All")

    // Admin view of drives includes status and applicant counts
    const drives = [
        { company: "Google", role: "SDE Intern", date: "Oct 15, 2026", status: "Active", applicants: 142, rounds: 4 },
        { company: "Amazon", role: "Frontend Engineer", date: "Oct 18, 2026", status: "Active", applicants: 210, rounds: 3 },
        { company: "Microsoft", role: "Backend Engineer", date: "Oct 10, 2026", status: "Completed", applicants: 350, rounds: 5 },
        { company: "Atlassian", role: "UI/UX Designer", date: "Nov 05, 2026", status: "Draft", applicants: 0, rounds: 2 },
    ]

    return (
        <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white rounded-[40px] p-4 h-full overflow-hidden text-black"
        >

            {/* ================= LEFT (DRIVES MANAGEMENT) ================= */}
            <div className="lg:col-span-9 bg-[#f5f5f5] rounded-[50px] p-8 overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

                {/* Header Row */}
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-bold">Manage Drives</h2>

                    <button className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition shadow-lg">
                        <Plus size={16} />
                        Post New Drive
                    </button>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                    {drives.map((drive, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="relative h-64 bg-[#0c0c0c] rounded-[40px] p-6 overflow-hidden shadow-xl group"
                        >

                            {/* Decorative Scribble */}
                            <svg className="absolute right-0 top-0 h-full opacity-20 transition-opacity group-hover:opacity-40" viewBox="0 0 200 200">
                                <path
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    d="M100,20 C150,50 50,150 180,180"
                                    strokeLinecap="round"
                                />
                            </svg>

                            {/* Top Status */}
                            <div className="flex justify-between relative z-10">
                                <div className="w-10 h-10 bg-[#26282b] rounded-full border border-gray-600 flex items-center justify-center text-white">
                                    <Briefcase size={16} />
                                </div>
                                
                                {/* Status Badge */}
                                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 h-fit
                                    ${drive.status === 'Active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                                      drive.status === 'Completed' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 
                                      'bg-gray-500/20 text-gray-400 border border-gray-500/30'}`}
                                >
                                    {drive.status === 'Active' && <Zap size={10} />}
                                    {drive.status === 'Completed' && <CheckCircle size={10} />}
                                    {drive.status === 'Draft' && <Clock size={10} />}
                                    {drive.status}
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

                                <div className="text-white text-sm opacity-80 space-y-1 pt-1">
                                    <p className="flex items-center gap-1">
                                        <Calendar size={14} className="text-[#FFA365]" /> {drive.date}
                                    </p>
                                    <p className="flex items-center gap-1">
                                        <Users size={14} className="text-[#FFA365]" /> {drive.applicants} Applicants
                                    </p>
                                </div>
                            </div>

                            {/* Bottom CTA */}
                            <div className="flex justify-end items-end relative z-10 mt-auto">
                                <div className="relative w-12 h-12 flex items-center justify-center group/btn cursor-pointer">
                                    <svg
                                        className="absolute inset-0 w-full h-full -rotate-90"
                                        viewBox="0 0 100 100"
                                    >
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="46"
                                            fill="none"
                                            stroke="#FFA365"
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


            {/* ================= RIGHT PANEL ================= */}
            <div className="lg:col-span-3 flex flex-col gap-4 h-full overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-10">

                {/* Smart Filters */}
                <div className="bg-white rounded-[40px] p-6 shadow-sm border border-gray-50 space-y-5">
                    <h3 className="font-bold flex items-center gap-2">
                        <SlidersHorizontal size={16} /> Filters
                    </h3>

                    {/* Status Filter */}
                    <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase mb-2">Drive Status</p>
                        <div className="flex flex-wrap gap-2">
                            {["All", "Active", "Draft", "Completed"].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setActiveStatus(s)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition
                                    ${activeStatus === s
                                            ? "bg-black text-white"
                                            : "bg-gray-100 hover:bg-black hover:text-white"
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="pt-4 border-t border-gray-100 space-y-3">
                        <p className="text-xs text-gray-400 font-semibold uppercase mb-2">Quick Stats</p>
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-gray-500">Total Drives</span>
                            <span>45</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-gray-500">Active</span>
                            <span className="text-green-500">12</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-gray-500">Total Applications</span>
                            <span>1,402</span>
                        </div>
                    </div>
                </div>

                {/* ===== MINI ANALYTICS GRAPH (Orange Style) ===== */}
                <div className="bg-[#FFA365] rounded-[45px] p-8 shadow-xl relative shrink-0 mt-auto">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#ffb988] rounded-full opacity-40 blur-2xl" />
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#ffd3b0] rounded-full opacity-40 blur-2xl" />

                    <h3 className="relative z-10 text-xl font-bold mb-8">
                        Weekly Apps
                    </h3>

                    <div className="relative z-10 flex items-end justify-between h-32 px-1">
                        {[
                            { day: 'Mon', h: 'h-16', val: 120 },
                            { day: 'Tue', h: 'h-8', val: 40 },
                            { day: 'Wed', h: 'h-24', val: 210, active: true },
                            { day: 'Thu', h: 'h-12', val: 80 },
                            { day: 'Fri', h: 'h-16', val: 142 }
                        ].map((bar) => (
                            <div key={bar.day} className="flex flex-col items-center gap-2">
                                <div
                                    className={`w-10 ${bar.h} rounded-full relative transition-all duration-300
                                    ${bar.active
                                            ? "bg-black text-white scale-110 shadow-xl"
                                            : "bg-[#dc7c0f] text-white opacity-90"
                                        }`}
                                >
                                    {/* Tooltip on hover could go here, for now just static */}
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-tighter text-black mt-1">
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