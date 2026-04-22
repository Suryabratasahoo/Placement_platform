// app/student/questions/page.tsx

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
    Send,
    Loader2,
    Plus,
    Pencil,
    Trash2
} from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useUserStore } from "@/store/userStore"
import toast from "react-hot-toast"

export default function StudentQuestionsPage() {
    const { userId, universityId, isAuthenticated } = useUserStore();
    const [questions, setQuestions] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [activeTag, setActiveTag] = useState("All")
    
    // Modal & Form State
    const [showAskModal, setShowAskModal] = useState(false)
    const [newTitle, setNewTitle] = useState("")
    const [newDesc, setNewDesc] = useState("")
    const [isPosting, setIsPosting] = useState(false)

    // Edit & Delete State
    const [editingQuestion, setEditingQuestion] = useState<any>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDesc, setEditDesc] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    
    const [deletingQuestion, setDeletingQuestion] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Helper to format tags: DSA(LinkedList) -> DSA • LINKED LIST
    const formatTag = (title: string) => {
        if (!title) return "COMMUNITY";
        const match = title.match(/\((.*?)\)/);
        if (match) {
            const category = title.split('(')[0].trim();
            const topic = match[1].trim();
            return `${category} • ${topic}`.toUpperCase();
        }
        return title.split(' ')[0].toUpperCase();
    }

    // Fetch Questions
    const fetchQuestions = async () => {
        try {
            setIsLoading(true)
            const res = await fetch('/api/student/questions')
            if (res.ok) {
                const data = await res.json()
                setQuestions(data)
            }
        } catch (error) {
            toast.error("Failed to load questions.")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchQuestions()
    }, [])

    const handlePostQuestion = async () => {
        if (!isAuthenticated || !userId) {
            return toast.error("You must be signed in to post a question.")
        }

        if (!newTitle.trim() || !newDesc.trim()) {
            return toast.error("Title and description are required.")
        }

        setIsPosting(true)
        try {
            const res = await fetch('/api/student/questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newTitle,
                    description: newDesc,
                    tags: ["Community"],
                    author: userId,
                    universityId: universityId
                })
            })

            if (res.ok) {
                toast.success("Question published!")
                setNewTitle("")
                setNewDesc("")
                setShowAskModal(false)
                fetchQuestions() 
            } else {
                const err = await res.json()
                toast.error(err.message || "Failed to post question.")
            }
        } catch (error) {
            toast.error("An error occurred.")
        } finally {
            setIsPosting(false)
        }
    };

    const handleUpdateQuestion = async () => {
        if (!editingQuestion || !editTitle.trim() || !editDesc.trim()) return;
        
        setIsUpdating(true);
        try {
            const res = await fetch(`/api/student/questions/${editingQuestion._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: editTitle,
                    description: editDesc,
                    userId
                })
            });

            if (res.ok) {
                toast.success("Question updated!");
                setEditingQuestion(null);
                fetchQuestions();
            } else {
                toast.error("Failed to update.");
            }
        } catch (error) {
            toast.error("An error occurred.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteQuestion = async () => {
        if (!deletingQuestion) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/student/questions/${deletingQuestion._id}?userId=${userId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                toast.success("Question deleted.");
                setDeletingQuestion(null);
                fetchQuestions();
            } else {
                toast.error("Failed to delete.");
            }
        } catch (error) {
            toast.error("An error occurred.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white rounded-[40px] p-4 h-full overflow-hidden text-black relative"
        >

            {/* ================= LEFT (QUESTIONS FEED) ================= */}
            <div className="lg:col-span-9 bg-[#f5f5f5] rounded-[50px] p-8 flex flex-col overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-black tracking-tight">Student Q&A Hub</h2>
                    <button 
                         onClick={() => setShowAskModal(true)}
                         className="lg:hidden w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-lg"
                    >
                        <Plus size={24} />
                    </button>
                </div>

                {/* Search + Filter */}
                <div className="flex flex-wrap items-center gap-3 mb-10">
                    <div className="flex items-center bg-white rounded-full px-5 py-3 shadow-sm border border-gray-100 w-full md:w-150">
                        <Search size={22} className="text-gray-400" />
                        <input
                            placeholder="Search questions..."
                            className="ml-3 flex-1 bg-transparent outline-none text-sm font-medium"
                        />
                    </div>

                    {["All", "Technical", "HR Round", "Experiences"].map(tag => (
                        <button
                            key={tag}
                            onClick={() => setActiveTag(tag)}
                            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition cursor-pointer
                            ${activeTag === tag
                                    ? "bg-black text-white shadow-xl scale-[1.02]"
                                    : "bg-white border border-gray-100 hover:bg-black hover:text-white"}
                            `}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                {/* ===== QUESTIONS GRID ===== */}
                {isLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-400">
                        <Loader2 className="animate-spin" size={40} />
                        <p className="text-xs font-black uppercase tracking-[0.2em]">Synchronizing...</p>
                    </div>
                ) : questions.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center py-20">
                         <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                             <MessageSquare size={40} />
                         </div>
                         <h3 className="text-xl font-bold text-gray-900">No questions found</h3>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-10">
                        {questions.map((item, i) => (
                            <Link key={item._id} href={`/student/questions/${item._id}`}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="relative h-72 bg-[#0c0c0c] rounded-[40px] p-8 overflow-hidden shadow-xl group cursor-pointer flex flex-col"
                                >

                                    {/* Scribble */}
                                    <svg className="absolute right-0 top-0 h-full opacity-20 pointer-events-none" viewBox="0 0 200 200">
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
                                        <div className="flex gap-2">
                                            {item.author === userId && (
                                                <>
                                                    <button 
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setEditingQuestion(item);
                                                            setEditTitle(item.title);
                                                            setEditDesc(item.description);
                                                        }}
                                                        className="w-10 h-10 bg-white/10 hover:bg-[#681cf5] rounded-full flex items-center justify-center text-white transition-colors"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setDeletingQuestion(item);
                                                        }}
                                                        className="w-10 h-10 bg-white/10 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </>
                                            )}
                                            <button className="w-9 h-9 bg-[#4e5055] rounded-full text-white flex items-center justify-center pointer-events-none">
                                                ⋯
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="relative z-10 mt-4 space-y-2">
                                        <p className="text-orange-300 text-xs font-bold tracking-[0.18em] uppercase">
                                            {formatTag(item.title)}
                                        </p>
                                        <h2 className="text-white text-lg font-bold leading-snug line-clamp-4">
                                            {item.description}
                                        </h2>
                                        
                                        {/* Attribution Label */}
                                        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest pt-2">
                                            Asked by: {item.universityId || "Anonymous"}
                                        </p>
                                    </div>

                                    {/* Bottom */}
                                    <div className="flex justify-between items-end relative z-10 mt-auto">

                                        <div className="flex gap-4 text-white font-semibold text-sm">
                                            👍 {item.upvotes || 0}
                                            💬 {item.answers?.length || 0}
                                        </div>

                                        <div className="relative w-12 h-12 flex items-center justify-center group/btn">

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
                                                        transition-all duration-700 ease-in-out
                                                        [stroke-dasharray:289]
                                                        [stroke-dashoffset:289]
                                                        group-hover/btn:[stroke-dashoffset:0]
                                                    "
                                                />
                                            </svg>

                                            {/* Button */}
                                            <button
                                                className="
                                                    w-10 h-10 bg-white rounded-full
                                                    flex items-center justify-center
                                                    transition-transform duration-300
                                                    group-hover/btn:scale-105 pointer-events-none
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
                )}
            </div>

            {/* ================= RIGHT PANEL ================= */}
            <div className="lg:col-span-3 flex flex-col gap-4 h-full max-h-screen overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-8">

                {/* Ask a Question CTA */}
                <div 
                    onClick={() => setShowAskModal(true)}
                    className="bg-[#681cf5] rounded-[40px] p-8 shadow-xl relative overflow-hidden flex-shrink-0 text-white cursor-pointer hover:scale-[1.01] transition-transform group"
                >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-110 transition-transform" />
                    <h3 className="relative z-10 text-2xl font-black mb-3 leading-tight tracking-tight">Got a doubt?</h3>
                    <p className="relative z-10 text-xs font-medium opacity-80 mb-8 leading-relaxed">Tap into the collective brainpower of your batchmates and seniors.</p>
                    <button className="relative z-10 w-full bg-white text-black font-black py-4 rounded-[24px] transition-all shadow-[0_10px_30px_rgba(0,0,0,0.1)] active:scale-95 group-hover:bg-[#b4a9f8] group-hover:text-white cursor-pointer uppercase tracking-[0.2em] text-[10px]">
                        Start Discussion
                    </button>
                </div>

                {/* GOAL CARD */}
                <div className="mt-auto bg-[#FFA365] rounded-[40px] p-8 shadow-xl relative overflow-hidden text-black mb-8">
                     <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black/5 to-transparent" />
                     <h4 className="font-black text-lg mb-1 leading-tight relative">Active Batch</h4>
                     <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-6 relative">Engagement Goal</p>
                     <div className="flex items-end gap-3 relative">
                        <span className="text-6xl font-black tracking-tighter">42</span>
                        <div className="mb-2">
                            <p className="text-[10px] font-black leading-none opacity-50 uppercase">Questions</p>
                            <p className="text-[10px] font-black leading-none uppercase">/ 50 Weekly</p>
                        </div>
                     </div>
                </div>
            </div>

            {/* ASK QUESTION MODAL */}
            <AnimatePresence>
                {showAskModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAskModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md" 
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 40 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 40 }}
                            className="relative bg-white rounded-[50px] p-12 max-w-2xl w-full shadow-2xl border border-white/10 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-80 h-80 bg-[#681cf5] opacity-[0.05] rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

                            <div className="relative z-10 flex items-center justify-between mb-12">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-[#681cf5] rounded-[24px] flex items-center justify-center text-white shadow-2xl shadow-[#681cf5]/30">
                                        <MessageSquare size={32} />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black tracking-tight">Drop a Question</h2>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">Get answers from the community</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowAskModal(false)} className="w-14 h-14 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 rounded-2xl transition-all"><X size={24} /></button>
                            </div>

                            <div className="space-y-8 relative z-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Title</label>
                                    <input 
                                        value={newTitle}
                                        onChange={e => setNewTitle(e.target.value)}
                                        placeholder="e.g. DSA(LinkedList) Problem"
                                        className="w-full bg-[#f9fafb] border border-gray-100 rounded-[28px] px-8 py-5 outline-none focus:border-[#681cf5] focus:bg-white transition-all font-bold text-gray-900 text-lg shadow-inner"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Description</label>
                                    <textarea 
                                        value={newDesc}
                                        onChange={e => setNewDesc(e.target.value)}
                                        placeholder="Elaborate your request..."
                                        rows={4}
                                        className="w-full bg-[#f9fafb] border border-gray-100 rounded-[28px] px-8 py-6 outline-none focus:border-[#681cf5] focus:bg-white transition-all font-semibold text-gray-700 resize-none shadow-inner"
                                    />
                                </div>

                                <div className="pt-6 flex gap-4">
                                    <button onClick={() => setShowAskModal(false)} className="flex-1 py-5 bg-gray-100 text-gray-500 font-black uppercase tracking-widest rounded-[24px] hover:bg-gray-200 transition-all text-xs">Cancel</button>
                                    <button onClick={handlePostQuestion} disabled={isPosting} className="flex-[2] py-5 bg-black text-white font-black uppercase tracking-widest rounded-[24px] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-4 disabled:opacity-50 text-xs">
                                        {isPosting ? 'Posting...' : <>Post Question <Send size={18} /></>}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* EDIT QUESTION MODAL */}
            <AnimatePresence>
                {editingQuestion && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingQuestion(null)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 40 }} className="relative bg-white rounded-[50px] p-12 max-w-2xl w-full shadow-2xl border border-white/10">
                            <h2 className="text-3xl font-black mb-8">Edit Question</h2>
                            <div className="space-y-6">
                                <input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="w-full bg-gray-100 rounded-3xl px-8 py-5 border-none outline-none font-bold" />
                                <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={4} className="w-full bg-gray-100 rounded-3xl px-8 py-6 border-none outline-none font-semibold resize-none" />
                                <div className="flex gap-4">
                                    <button onClick={() => setEditingQuestion(null)} className="flex-1 py-5 bg-gray-100 text-gray-500 font-black uppercase rounded-[24px]">Cancel</button>
                                    <button onClick={handleUpdateQuestion} disabled={isUpdating} className="flex-[2] py-5 bg-black text-white font-black uppercase rounded-[24px] disabled:opacity-50">
                                        {isUpdating ? 'Updating...' : 'Update Question'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* DELETE CONFIRMATION MODAL */}
            <AnimatePresence>
                {deletingQuestion && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeletingQuestion(null)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 40 }} className="relative bg-white rounded-[50px] p-12 max-w-md w-full shadow-2xl text-center">
                            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Trash2 size={40} />
                            </div>
                            <h2 className="text-2xl font-black mb-4">Delete Question?</h2>
                            <p className="text-gray-500 mb-8 font-medium">This action cannot be undone. All answers will also be removed.</p>
                            <div className="flex gap-4">
                                <button onClick={() => setDeletingQuestion(null)} className="flex-1 py-4 bg-gray-100 text-gray-500 font-bold rounded-2xl">No, keep it</button>
                                <button onClick={handleDeleteQuestion} disabled={isDeleting} className="flex-1 py-4 bg-red-600 text-white font-bold rounded-2xl disabled:opacity-50">
                                    {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.main>
    )
}
