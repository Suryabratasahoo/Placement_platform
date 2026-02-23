// app/admin/students/page.tsx

"use client"

import { motion } from "framer-motion"
import {
    Search,
    Filter,
    User,
    GraduationCap,
    ArrowRight,
    CheckCircle,
    Clock
} from "lucide-react"
import { useState } from "react"

export default function AdminStudentsPage() {
    const [activeBranch, setActiveBranch] = useState("All");

    const students = [
        { name: "Rahul Sharma", branch: "CSE", cgpa: "9.2", status: "Placed", company: "Google", apps: 12 },
        { name: "Aditi Verma", branch: "ECE", cgpa: "8.8", status: "Interviewing", company: "Amazon", apps: 18 },
        { name: "Karan Patel", branch: "CSE", cgpa: "8.5", status: "Unplaced", company: null, apps: 24 },
        { name: "Neha Singh", branch: "IT", cgpa: "9.5", status: "Placed", company: "Microsoft", apps: 5 },
        { name: "Vikram Reddy", branch: "MEC", cgpa: "7.9", status: "Interviewing", company: "TCS", apps: 30 },
    ]

    return (
        <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white rounded-[40px] p-4 h-full overflow-hidden text-black"
        >

            {/* ================= LEFT (STUDENT DIRECTORY) ================= */}
            <div className="lg:col-span-9 bg-[#f5f5f5] rounded-[50px] p-8 flex flex-col overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

                <h2 className="text-3xl font-bold mb-8">Student Tracker</h2>

                {/* Search + Filter */}
                <div className="flex flex-wrap items-center gap-3 mb-10">

                    {/* Search */}
                    <div className="flex items-center bg-white rounded-full px-5 py-3 shadow-sm border border-gray-100 w-full md:w-150">
                        <Search size={26} className="text-gray-400" />
                        <input
                            placeholder="Search by name, roll number..."
                            className="ml-3 flex-1 bg-transparent outline-none text-sm"
                        />
                    </div>

                    {/* Filter Pills */}
                    {["All", "CSE", "ECE", "IT", "MEC", "CIVIL"].map(branch => (
                        <button
                            key={branch}
                            onClick={() => setActiveBranch(branch)}
                            className={`px-5 py-2 rounded-full text-sm font-semibold transition cursor-pointer
                            ${activeBranch === branch
                                    ? "bg-black text-white shadow"
                                    : "bg-white border border-gray-100 hover:bg-black hover:text-white"}
                            `}
                        >
                            {branch}
                        </button>
                    ))}
                </div>


                {/* ===== STUDENTS GRID ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-10">

                    {students.map((student, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="relative h-56 bg-[#0c0c0c] rounded-[40px] p-6 overflow-hidden shadow-xl group cursor-pointer"
                        >

                            {/* Scribble */}
                            <svg className="absolute right-0 top-0 h-full opacity-20 transition-opacity group-hover:opacity-40" viewBox="0 0 200 200">
                                <path
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    d="M100,20 C150,50 50,150 180,180"
                                    strokeLinecap="round"
                                />
                            </svg>

                            {/* Top row */}
                            <div className="flex justify-between relative z-10">
                                <div className="w-10 h-10 bg-[#26282b] rounded-full border border-gray-600 flex items-center justify-center text-white">
                                    <User size={16} />
                                </div>
                                
                                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 h-fit
                                    ${student.status === 'Placed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                                      student.status === 'Interviewing' ? 'bg-[#FFA365]/20 text-[#FFA365] border border-[#FFA365]/30' : 
                                      'bg-gray-500/20 text-gray-400 border border-gray-500/30'}`}
                                >
                                    {student.status === 'Placed' ? <CheckCircle size={10} /> : <Clock size={10} />}
                                    {student.status}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="relative z-10 mt-4 space-y-2">
                                <p className="text-orange-300 text-xs font-bold tracking-[0.18em] uppercase flex items-center gap-2">
                                    <GraduationCap size={14} /> {student.branch} • CGPA {student.cgpa}
                                </p>
                                <h2 className="text-white text-xl font-bold leading-snug truncate">
                                    {student.name}
                                </h2>
                                {student.company && (
                                    <p className="text-sm text-gray-400 font-semibold truncate pt-1">
                                        {student.status === 'Placed' ? 'Placed at ' : 'Interviewing at '} 
                                        <span className="text-white">{student.company}</span>
                                    </p>
                                )}
                            </div>

                            {/* Bottom */}
                            <div className="flex justify-between items-end relative z-10 mt-auto">
                                <div className="text-gray-400 font-semibold text-sm">
                                    {student.apps} Applications
                                </div>

                                <div className="relative w-12 h-12 flex items-center justify-center group/btn">
                                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="46"
                                            fill="none"
                                            stroke="#FFA365"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            className="stroke-dasharray-[289] stroke-dashoffset-[289] transition-all duration-700 ease-in-out group-hover/btn:stroke-dashoffset-0"
                                        />
                                    </svg>
                                    <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center transition-transform duration-300 group-hover/btn:scale-105">
                                        <ArrowRight className="w-4 h-4 text-black" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* ================= RIGHT PANEL ================= */}
            <div className="lg:col-span-3 flex flex-col gap-4 h-full max-h-screen overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-8">

                {/* ===== SMART FILTERS ===== */}
                <div className="bg-white rounded-[40px] p-6 shadow-sm border border-gray-50 space-y-5 flex-shrink-0">
                    <h3 className="font-bold flex items-center gap-2">
                        <Filter size={16} /> Filter Status
                    </h3>

                    {/* Status Filters */}
                    <div>
                        <div className="flex flex-wrap gap-2">
                            {["All", "Placed", "Interviewing", "Unplaced"].map(status => (
                                <button
                                    key={status}
                                    className="px-4 py-1.5 rounded-full text-sm font-semibold bg-gray-100 hover:bg-black hover:text-white transition"
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-400 font-semibold uppercase mb-3">CGPA Range</p>
                        <div className="flex items-center gap-2">
                            <input type="text" placeholder="Min" className="w-16 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-sm text-center outline-none" />
                            <span className="text-gray-400">-</span>
                            <input type="text" placeholder="Max" className="w-16 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-sm text-center outline-none" />
                        </div>
                    </div>
                </div>

            </div>
        </motion.main>
    )
}