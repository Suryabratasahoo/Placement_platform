"use client"

import { motion, AnimatePresence } from "framer-motion"
import { 
    Clock, 
    BookOpen,
    Eye,
    X,
    Loader2,
    Briefcase,
    User,
    Sparkles,
    Search,
    ArrowRight
} from "lucide-react"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"

export default function StudentExperiencesPage() {
    const [experiences, setExperiences] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedExp, setSelectedExp] = useState<any | null>(null)
    const [searchTerm, setSearchTerm] = useState("")

    const fetchExperiences = async () => {
        try {
            const res = await fetch('/api/student/experiences')
            if (!res.ok) throw new Error("Failed to fetch")
            setExperiences(await res.json())
        } catch(e) {
            toast.error("Failed to load approved experiences.")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchExperiences()
    }, [])

    const filtered = experiences.filter(exp => 
        exp.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
        exp.role.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white rounded-[40px] p-4 h-full overflow-hidden text-black"
        >
            {/* ================= MAIN FEED ================= */}
            <div className="lg:col-span-9 bg-[#f9fafb] rounded-[50px] p-8 flex flex-col overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 shrink-0">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight">Success Stories</h2>
                        <p className="text-sm font-semibold text-gray-500 mt-1">Verified Senior Experiences</p>
                    </div>
                    
                    <div className="flex items-center bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-[#1783e1]/20 focus-within:border-[#1783e1]">
                        <Search size={16} className="text-gray-400" />
                        <input 
                            type="text"
                            placeholder="Search company or role..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none outline-none ml-2 text-sm font-medium w-full md:w-64"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="h-40 flex items-center justify-center">
                        <Loader2 className="animate-spin text-[#1783e1] w-8 h-8" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center pb-20">
                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                            <Sparkles size={32} className="text-[#1783e1]" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">No stories found</h3>
                        <p className="text-gray-500 text-sm">Check back later for newly approved senior experiences.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 pb-10">
                        {filtered.map((exp, i) => (
                            <motion.div
                                key={exp._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => setSelectedExp(exp)}
                                className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer relative overflow-hidden group shrink-0 hover:border-[#1783e1]/30"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#1783e1] opacity-[0.03] rounded-full blur-2xl group-hover:opacity-10 transition-opacity" />
                                
                                <div className="flex justify-between items-start mb-3 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-[#1783e1]/10 to-[#1783e1]/5 flex items-center justify-center text-[#1783e1] shrink-0 border border-[#1783e1]/20">
                                            <Briefcase size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-xl text-gray-900 leading-none mb-1.5 flex items-center gap-2 group-hover:text-[#1783e1] transition-colors">
                                                {exp.company}
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                <p className="text-[12px] text-gray-500 font-bold uppercase tracking-wider bg-gray-50 px-2 py-0.5 rounded-full inline-block">
                                                    {exp.role}
                                                </p>
                                                <p className="text-[10px] text-[#1783e1] font-bold uppercase tracking-widest bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full inline-block">
                                                    {exp.type}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="pl-[4.25rem] mb-5 relative z-10">
                                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                                        {exp.content}
                                    </p>
                                </div>

                                <div className="mt-2 pl-[4.25rem] flex items-center justify-between pt-4 relative z-10">
                                    <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                                        <span className="flex items-center gap-1.5 text-gray-500"><User size={14} className="text-gray-400" /> {exp.authorName}</span>
                                        <span className="flex items-center gap-1"><Clock size={12} /> {new Date(exp.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="text-xs font-bold uppercase tracking-widest text-[#1783e1] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                                        Read More <ArrowRight size={14} />
                                    </div>
                                </div>

                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* ================= RIGHT PANEL ================= */}
            <div className="lg:col-span-3 flex flex-col gap-4 h-full max-h-screen overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-8">
                {/* HERO BOX */}
                <div className="bg-gradient-to-br from-[#1783e1] to-[#0d6ac1] text-white rounded-[40px] p-8 shadow-xl relative overflow-hidden flex-shrink-0">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
                    
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-6 border border-white/20">
                        <BookOpen size={20} className="text-white" />
                    </div>
                    
                    <h3 className="relative z-10 text-2xl font-black mb-2 tracking-tight leading-none">Learn from<br/>the Best</h3>
                    <p className="relative z-10 text-sm text-blue-100 mb-6 font-medium leading-relaxed opacity-90">
                        Read interview experiences, OA details, and preparation strategies directly from placed seniors.
                    </p>
                    
                    <div className="relative z-10 bg-white/20 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between border border-white/10">
                        <span className="text-xs font-bold tracking-widest uppercase">Total Reads</span>
                        <span className="text-xl font-black">{experiences.length}</span>
                    </div>
                </div>

                <div className="bg-white rounded-[40px] p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                        <Sparkles size={24} className="text-gray-400" />
                    </div>
                    <h4 className="font-bold text-gray-800 text-sm">Want to contribute?</h4>
                    <p className="text-xs text-gray-500 mt-1 mb-4">Seniors can share their experiences via the Senior Portal to help juniors.</p>
                </div>
            </div>

            {/* ================= BLUR MODAL FOR READING ================= */}
            <AnimatePresence>
                {selectedExp && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setSelectedExp(null)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative w-full max-w-3xl bg-white rounded-[40px] overflow-hidden flex flex-col max-h-[90vh] shadow-2xl"
                        >
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 p-8 flex justify-between items-start shrink-0 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60" />
                                
                                <div className="flex gap-5 items-center relative z-10">
                                    <div className="w-16 h-16 bg-white border-2 border-gray-100 shadow-sm rounded-full flex flex-col items-center justify-center text-[#1783e1] shrink-0">
                                        <Briefcase size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-3xl text-gray-900 tracking-tight leading-none mb-2">{selectedExp.company}</h3>
                                        <div className="flex items-center gap-3">
                                            <p className="font-bold text-gray-500 uppercase tracking-widest text-[11px] bg-gray-100 px-3 py-1 rounded-full">{selectedExp.role}</p>
                                            <p className="font-bold text-[#1783e1] uppercase tracking-widest text-[11px] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">{selectedExp.type}</p>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setSelectedExp(null)}
                                    className="relative z-10 w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-black hover:text-white transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Modal Body (Scrollable Read Area) */}
                            <div className="p-8 overflow-y-auto w-full max-h-full">
                                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#fce5d8] rounded-full flex flex-col items-center justify-center text-[#ff802b] shrink-0 border border-[#FFA365]/20 font-black text-sm">
                                            {selectedExp.authorName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm leading-none mb-0.5">{selectedExp.authorName}</p>
                                            <p className="text-xs text-gray-400 font-medium">{selectedExp.universityId}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Published On</p>
                                        <p className="text-sm font-semibold">{new Date(selectedExp.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                
                                <div className="prose prose-blue prose-sm md:prose-base max-w-none text-gray-700 leading-relaxed font-medium">
                                    {selectedExp.content.split('\n').map((paragraph: string, idx: number) => (
                                        <p key={idx} className="mb-5">{paragraph}</p>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </motion.main>
    )
}
