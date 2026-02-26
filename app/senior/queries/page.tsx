// app/senior/queries/page.tsx

"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
    Search,
    Filter,
    MoreHorizontal,
    Zap,
    ChevronLeft,
    ChevronRight,
    ArrowRight
} from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link" // <-- Added Link import!

export default function QuestionsFeedPage() {

    const [index, setIndex] = useState(0)
    const [activeTag, setActiveTag] = useState("All");

    const items = [
        { image: "/image1.png" },
        { image: "/image2.png" },
        { image: "/image3.png" },
    ]

    const questions = [
        {
            title: "How to find intersection of two linked lists in O(1) space?",
            tags: ["DSA", "Linked List"],
            upvotes: 124,
            answers: 18,
        },
        {
            title: "Most common HR interview questions for freshers?",
            tags: ["HR"],
            upvotes: 89,
            answers: 12,
        },
        {
            title: "Google SDE preparation roadmap?",
            tags: ["Company", "Google"],
            upvotes: 210,
            answers: 34,
        },
        {
            title: "Best way to optimize recursion in DP problems?",
            tags: ["DSA"],
            upvotes: 56,
            answers: 9,
        },
        {
            title: "How to crack Amazon OA in 30 days?",
            tags: ["Company"],
            upvotes: 143,
            answers: 27,
        },
    ]

    const nextStep = () => setIndex((prev) => (prev + 1) % items.length)
    const prevStep = () => setIndex((prev) => (prev - 1 + items.length) % items.length)

    return (
        <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="
            grid grid-cols-1 lg:grid-cols-12 gap-4
            bg-white rounded-[40px] p-4
            h-full overflow-hidden
            text-black
        "
        >

            {/* ================= LEFT (QUESTIONS) ================= */}
            <div className="
            lg:col-span-9 bg-[#f5f5f5] rounded-[50px] p-8
            flex flex-col
            overflow-y-auto
            scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
        ">

                <h2 className="text-3xl font-bold mb-8">Questions Feed</h2>

                {/* Search + Filter */}
                <div className="flex flex-wrap items-center gap-3 mb-10">

                    {/* Search (slightly shorter) */}
                    <div className="
        flex items-center
        bg-white rounded-full
        px-5 py-3 shadow-sm
        border border-gray-100
        w-full md:w-150
    ">
                        <Search size={26} className="text-gray-400" />

                        <input
                            placeholder="Search anything..."
                            className="ml-3 flex-1 bg-transparent outline-none text-sm"
                        />
                    </div>

                    {/* Filter Pills */}
                    {["All", "DSA", "HR", "Company"].map(tag => (
                        <button
                            key={tag}
                            onClick={() => setActiveTag(tag)}
                            className={`px-5 py-2 rounded-full text-sm font-semibold transition cursor-pointer
        ${activeTag === tag
                                    ? "bg-black text-white shadow"
                                    : "bg-white border border-gray-100 hover:bg-black hover:text-white"}
        `}
                        >
                            {tag}
                        </button>
                    ))}


                </div>


                {/* ===== QUESTIONS GRID ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                    {questions.map((q, i) => (
                        // <-- Wrapped in Link tag here!
                        <Link href="/senior/queries/particularQuestion" key={i}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="relative h-56 bg-[#0c0c0c] rounded-[40px] p-6 overflow-hidden shadow-xl group cursor-pointer"
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
                                        ❓
                                    </div>
                                    <button className="w-9 h-9 bg-[#4e5055] rounded-full text-white flex items-center justify-center pointer-events-none">
                                        ⋯
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="relative z-10 mt-4 space-y-2">
                                    <p className="text-orange-300 text-xs font-bold tracking-[0.18em] uppercase">
                                        {q.tags.join(" • ")}
                                    </p>
                                    <h2 className="text-white text-lg font-bold leading-snug line-clamp-2">
                                        {q.title}
                                    </h2>
                                </div>

                                {/* Bottom */}
                                <div className="flex justify-between items-end relative z-10 mt-auto">

                                    <div className="flex gap-4 text-white font-semibold text-sm">
                                        👍 {q.upvotes}
                                        💬 {q.answers}
                                    </div>

                                    <div className="relative w-12 h-12 flex items-center justify-center group">

                                        {/* Animated ring */}
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
        w-10 h-10 bg-white rounded-full
        flex items-center justify-center
        transition-transform duration-300
        group-hover:scale-105 pointer-events-none
        "
                                        >
                                            <ArrowRight className="w-4 h-4 text-black" />
                                        </button>

                                    </div>

                                </div>

                            </motion.div>
                        </Link>
                    ))}

                </div>
            </div>


            {/* ================= RIGHT PANEL ================= */}
            <div className="lg:col-span-3 
    flex flex-col gap-4 
    h-full max-h-screen 
    overflow-y-auto 
    scrollbar-none 
    [scrollbar-width:none] 
    [-ms-overflow-style:none] 
    [&::-webkit-scrollbar]:hidden
    pb-8">

                {/* ===== SMART FILTERS ===== */}
                <div className="bg-white rounded-[40px] p-6 shadow-sm border border-gray-50 space-y-5 flex-shrink-0">
                    <h3 className="font-bold flex items-center gap-2">
                        <Filter size={16} /> Smart Filters
                    </h3>

                    {/* Tag Filters */}
                    <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase mb-2">Category</p>
                        <div className="flex flex-wrap gap-2">
                            {["All", "DSA", "HR", "Company"].map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => setActiveTag(tag)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition
                        ${activeTag === tag
                                            ? "bg-black text-white"
                                            : "bg-gray-100 hover:bg-black hover:text-white"}
                        `}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Difficulty Filter */}
                    <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase mb-2">Difficulty</p>
                        <div className="flex flex-wrap gap-2">
                            {["All", "Easy", "Medium", "Hard"].map(level => (
                                <button
                                    key={level}
                                    className="px-4 py-1.5 rounded-full text-sm font-semibold bg-gray-100 hover:bg-black hover:text-white transition"
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ===== ANALYTICS GRAPH ===== */}
                <div className="bg-[#FFA365] rounded-[45px] p-8 shadow-xl relative overflow-hidden flex-shrink-0">
                    {/* Soft Background Blobs */}
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#ffb988] rounded-full opacity-40 blur-2xl" />
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#ffd3b0] rounded-full opacity-40 blur-2xl" />

                    <h3 className="relative z-10 text-2xl font-bold mb-8">
                        Questions Answered
                    </h3>

                    <div className="relative z-10 flex items-end justify-between h-44 px-2">
                        {[
                            { day: 'Mon', val: 4 },
                            { day: 'Tue', val: 2 },
                            { day: 'Wed', val: 6, active: true },
                            { day: 'Thu', val: 3 },
                            { day: 'Fri', val: 5 },
                            { day: 'Sat', val: 1 },
                            { day: 'Sun', val: 4 }
                        ].map((bar) => (
                            <div key={bar.day} className="flex flex-col items-center gap-4">
                                <div
                                    className={`w-10 rounded-full relative transition-all duration-300
                        ${bar.active
                                            ? "bg-black text-white scale-110 shadow-xl"
                                            : "bg-[#dc7c0f] text-white opacity-90"}
                        `}
                                    style={{ height: `${bar.val * 18}px` }}
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