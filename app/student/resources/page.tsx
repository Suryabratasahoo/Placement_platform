// app/student/resources/page.tsx

"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
    Search,
    Filter,
    ArrowRight,
    MessageCircle,
    ThumbsUp,
    FileText,
    BookOpen,
    X,
    MessageSquare,
    Send
} from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import toast from "react-hot-toast"

export default function StudentResourcesPage() {
    const [activeTag, setActiveTag] = useState("All");

    // Dynamic State for Resources
    const [resources, setResources] = useState([
        {
            id: "tcs-prep-guide",
            title: "TCS NQT 2026 Complete Preparation Guide & Previous Papers",
            tags: ["Company Prep", "TCS"],
            upvotes: 342,
            answers: 45,
            type: "guide",
            icon: <BookOpen size={16} className="text-[#1783e1]" />
        },
        {
            id: "intersection-linked-lists",
            title: "How to find intersection of two linked lists in O(1) space?",
            tags: ["DSA", "Linked List"],
            upvotes: 124,
            answers: 18,
            type: "question",
            icon: <MessageCircle size={16} className="text-[#FFA365]" />
        },
        {
            id: "hr-interview-questions",
            title: "Most common HR interview questions for freshers?",
            tags: ["HR", "Interview"],
            upvotes: 89,
            answers: 12,
            type: "question",
            icon: <MessageCircle size={16} className="text-[#FFA365]" />
        },
        {
            id: "google-intern-experience",
            title: "Google SDE Intern Selection Experience (Off-campus)",
            tags: ["Experience", "Google"],
            upvotes: 210,
            answers: 34,
            type: "experience",
            icon: <FileText size={16} className="text-[#681cf5]" />
        },
        {
            id: "recursion-optimization-dp",
            title: "Best way to optimize recursion in DP problems?",
            tags: ["DSA", "Dynamic Programming"],
            upvotes: 56,
            answers: 9,
            type: "question",
            icon: <MessageCircle size={16} className="text-[#FFA365]" />
        },
        {
            id: "system-design-cheat-sheet",
            title: "System Design Cheat Sheet for Entry Level Roles",
            tags: ["Resources", "System Design"],
            upvotes: 188,
            answers: 5,
            type: "guide",
            icon: <BookOpen size={16} className="text-[#1783e1]" />
        },
    ])

    // Modal State
    const [showAskModal, setShowAskModal] = useState(false)
    const [newTitle, setNewTitle] = useState("")
    const [newDesc, setNewDesc] = useState("")
    const [isPosting, setIsPosting] = useState(false)

    const handlePostQuestion = () => {
        if (!newTitle.trim() || !newDesc.trim()) {
            return toast.error("Title and description are required.")
        }

        setIsPosting(true)

        // Simulate network lag
        setTimeout(() => {
            const newRes = {
                id: `q-${Date.now()}`,
                title: newTitle,
                tags: ["Student Q&A", "Community"],
                upvotes: 0,
                answers: 0,
                type: "question",
                icon: <MessageCircle size={16} className="text-[#FFA365]" />
            }

            setResources(prev => [newRes, ...prev])
            setNewTitle("")
            setNewDesc("")
            setIsPosting(false)
            setShowAskModal(false)
            toast.success("Question published successfully!")
        }, 800)
    }

    return (
        <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white rounded-[40px] p-4 h-full overflow-hidden text-black relative"
        >

            {/* ================= LEFT (RESOURCES FEED) ================= */}
            <div className="lg:col-span-9 bg-[#f5f5f5] rounded-[50px] p-8 flex flex-col overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

                <h2 className="text-3xl font-bold mb-8">Resource Hub & Q&A</h2>

                {/* Search + Filter */}
                <div className="flex flex-wrap items-center gap-3 mb-10">

                    {/* Search */}
                    <div className="flex items-center bg-white rounded-full px-5 py-3 shadow-sm border border-gray-100 w-full md:w-150">
                        <Search size={26} className="text-gray-400" />
                        <input
                            placeholder="Search questions, guides, companies..."
                            className="ml-3 flex-1 bg-transparent outline-none text-sm"
                        />
                    </div>

                    {/* Filter Pills */}
                    {["All", "DSA", "Company Prep", "Experiences", "HR"].map(tag => (
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

                {/* ===== RESOURCES GRID ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-10">
                    {resources.map((item, i) => (
                        <Link key={item.id} href={`/student/resources/${item.id}`}>
                            <motion.div
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

                                {/* Top */}
                                <div className="flex justify-between relative z-10">
                                    <div className="w-10 h-10 bg-[#26282b] rounded-full border border-gray-600 flex items-center justify-center">
                                        {item.icon}
                                    </div>
                                    <button className="w-9 h-9 bg-[#4e5055] rounded-full text-white flex items-center justify-center hover:bg-gray-600 transition cursor-pointer">
                                        ⋯
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="relative z-10 mt-4 space-y-2">
                                    <p className="text-orange-300 text-xs font-bold tracking-[0.18em] uppercase">
                                        {item.tags.join(" • ")}
                                    </p>
                                    <h2 className="text-white text-lg font-bold leading-snug line-clamp-2">
                                        {item.title}
                                    </h2>
                                </div>

                                {/* Bottom */}
                                <div className="flex justify-between items-end relative z-10 mt-auto">
                                    <div className="flex gap-4 text-white font-semibold text-sm">
                                        <span className="flex items-center gap-1"><ThumbsUp size={14}/> {item.upvotes}</span>
                                        <span className="flex items-center gap-1"><MessageCircle size={14}/> {item.answers}</span>
                                    </div>

                                    <div className="relative w-12 h-12 flex items-center justify-center group/btn">
                                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                                            <circle
                                                cx="50"
                                                cy="50"
                                                r="46"
                                                fill="none"
                                                stroke="#FDBA74"
                                                strokeWidth="3"
                                                strokeLinecap="round"
                                                className="stroke-dasharray-[289] stroke-dashoffset-[289] transition-all duration-700 ease-in-out group-hover/btn:stroke-dashoffset-0"
                                            />
                                        </svg>
                                        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center transition-transform duration-300 group-hover/btn:scale-105 cursor-pointer">
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
            <div className="lg:col-span-3 flex flex-col gap-4 h-full max-h-screen overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-8">

                {/* Ask a Question CTA */}
                <div 
                    onClick={() => setShowAskModal(true)}
                    className="bg-[#681cf5] rounded-[40px] p-6 shadow-xl relative overflow-hidden flex-shrink-0 text-white cursor-pointer hover:scale-[1.01] transition-transform group"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-110 transition-transform" />
                    <h3 className="relative z-10 text-xl font-bold mb-2">Stuck on a problem?</h3>
                    <p className="relative z-10 text-sm opacity-80 mb-6">Ask the community or seniors for help.</p>
                    <button className="relative z-10 w-full bg-white text-black font-extrabold py-3.5 rounded-[20px] transition-all shadow-lg active:scale-95 group-hover:bg-[#b4a9f8] group-hover:text-white cursor-pointer uppercase tracking-widest text-[10px]">
                        Ask a Question
                    </button>
                </div>

                {/* ===== SMART FILTERS ===== */}
                <div className="bg-white rounded-[40px] p-6 shadow-sm border border-gray-50 space-y-5 flex-shrink-0">
                    <h3 className="font-bold flex items-center gap-2">
                        <Filter size={16} /> Filter by Type
                    </h3>

                    <div className="flex flex-col gap-2">
                        {["All Resources", "Interview Experiences", "Company Prep Guides", "Community Q&A", "Video Lectures"].map((type, idx) => (
                            <button
                                key={type}
                                className={`text-left px-4 py-3 rounded-2xl text-sm font-semibold transition cursor-pointer ${idx === 0 ? "bg-gray-100 text-black" : "text-gray-500 hover:bg-gray-50"}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-auto bg-[#FFA365] rounded-[40px] p-6 shadow-xl relative overflow-hidden text-black mb-8">
                     <h4 className="font-bold text-lg mb-1 leading-tight">Weekly Q&A Goal</h4>
                     <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Community Progress</p>
                     <div className="mt-4 flex items-end gap-2">
                        <span className="text-5xl font-black tracking-tighter">42</span>
                        <span className="text-xl font-bold opacity-50 mb-1">/ 50</span>
                     </div>
                </div>
            </div>

            {/* ASK QUESTION MODAL */}
            <AnimatePresence>
                {showAskModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAskModal(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                        />
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative bg-white rounded-[48px] p-10 max-w-xl w-full shadow-2xl border border-gray-100 overflow-hidden"
                        >
                            {/* Decorative Background Blob */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#681cf5] opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

                            <div className="relative z-10 flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-[#681cf5] rounded-3xl flex items-center justify-center text-white shadow-xl shadow-[#681cf5]/20">
                                        <MessageSquare size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black tracking-tight">Ask a Question</h2>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Share your query with the batch</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setShowAskModal(false)}
                                    className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 rounded-2xl transition-all cursor-pointer"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-6 relative z-10">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Question Title</label>
                                    <input 
                                        value={newTitle}
                                        onChange={e => setNewTitle(e.target.value)}
                                        placeholder="e.g. DSA(LinkedList)"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-3xl px-6 py-4.5 outline-none focus:border-[#681cf5] focus:bg-white transition-all font-bold text-gray-800 shadow-inner"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Description</label>
                                    <textarea 
                                        value={newDesc}
                                        onChange={e => setNewDesc(e.target.value)}
                                        placeholder="Explain your problem in detail... What have you tried so far?"
                                        rows={4}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-3xl px-6 py-4 outline-none focus:border-[#681cf5] focus:bg-white transition-all font-semibold text-gray-700 resize-none shadow-inner"
                                    />
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button 
                                        onClick={() => setShowAskModal(false)}
                                        className="flex-1 py-4.5 bg-gray-100 text-gray-500 font-black uppercase tracking-widest rounded-3xl hover:bg-gray-200 transition-all text-xs cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handlePostQuestion}
                                        disabled={isPosting}
                                        className="flex-[2] py-4.5 bg-black text-white font-black uppercase tracking-widest rounded-3xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/20 text-xs flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
                                    >
                                        {isPosting ? 'Publishing...' : (
                                            <>
                                                <span>Post Question</span>
                                                <Send size={16} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.main>
    )
}