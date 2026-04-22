"use client"

import { motion, AnimatePresence } from "framer-motion"
import { 
    Clock, 
    CheckCircle2, 
    XCircle,
    User,
    Briefcase,
    BookOpen,
    Eye,
    X,
    Loader2
} from "lucide-react"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"

export default function AdminReviewPage() {
    const [queue, setQueue] = useState<any[]>([])
    const [stats, setStats] = useState({ approved: 0, rejected: 0 })
    const [isLoading, setIsLoading] = useState(true)
    const [selectedExp, setSelectedExp] = useState<any | null>(null)
    const [isVerifying, setIsVerifying] = useState(false)

    const fetchQueue = async () => {
        try {
            const res = await fetch('/api/admin/reviews')
            if (!res.ok) throw new Error("Failed to fetch")
            const data = await res.json()
            setQueue(data.pendings)
            setStats(data.stats)
        } catch(e) {
            toast.error("Failed to load review queue.")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchQueue()
    }, [])

    const handleVerification = async (id: string, status: 'approved' | 'rejected') => {
        setIsVerifying(true)
        try {
            const res = await fetch(`/api/admin/reviews/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            })
            if (!res.ok) throw new Error("Verification failed")
            
            toast.success(`Experience historically ${status}!`)
            setQueue(prev => prev.filter(exp => exp._id !== id))
            setStats(prev => ({
                ...prev,
                [status]: prev[status] + 1
            }))
            setSelectedExp(null)
        } catch (e) {
            toast.error("Network error during verification.")
        } finally {
            setIsVerifying(false)
        }
    }

    return (
        <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white rounded-[40px] p-4 h-full overflow-hidden text-black"
        >
            {/* ================= LEFT COMMAND CENTER (QUEUE) ================= */}
            <div className="lg:col-span-9 bg-[#f5f5f5] rounded-[50px] p-8 flex flex-col overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex items-center justify-between mb-8 shrink-0">
                    <div>
                        <h2 className="text-3xl font-bold">Review Pipeline</h2>
                        <p className="text-sm font-semibold text-gray-500 mt-1">Pending Senior Experiences</p>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <BookOpen className="text-[#FFA365]" />
                    </div>
                </div>

                {isLoading ? (
                    <div className="h-40 flex items-center justify-center">
                        <Loader2 className="animate-spin text-[#FFA365] w-8 h-8" />
                    </div>
                ) : queue.length === 0 ? (
                    <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center pb-20">
                        <div className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 size={48} className="text-green-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Queue Cleared!</h3>
                        <p className="text-gray-500">All senior submissions have been successfully verified.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 pb-10">
                        {queue.map((exp, i) => (
                            <motion.div
                                key={exp._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group shrink-0"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-[#fce5d8] flex flex-col items-center justify-center text-[#ff802b] shrink-0 border border-[#FFA365]/20">
                                            <span className="text-[10px] font-bold uppercase tracking-wider -mb-1">EXP</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg text-gray-900 leading-none mb-1 flex items-center gap-2">
                                                {exp.company} <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-500 uppercase tracking-widest">{exp.type}</span>
                                            </h4>
                                            <p className="text-[13px] text-gray-400 font-bold flex items-center gap-1.5 uppercase tracking-wide">
                                                <Briefcase size={12} className="text-[#FFA365]" /> {exp.role}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="pl-16 mb-5">
                                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                                        {exp.content}
                                    </p>
                                </div>

                                <div className="mt-4 pl-16 flex items-center justify-between border-t border-gray-50 pt-4">
                                    <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                                        <span className="flex items-center gap-1.5 text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full"><User size={14} className="text-black" /> {exp.authorName} • {exp.universityId}</span>
                                        <span className="flex items-center gap-1"><Clock size={12} /> {new Date(exp.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedExp(exp)}
                                        className="h-10 px-5 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-full flex items-center justify-center gap-2 hover:bg-[#FFA365] hover:text-black transition-colors"
                                    >
                                        <Eye size={14} /> Review
                                    </button>
                                </div>

                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* ================= RIGHT PANEL ================= */}
            <div className="lg:col-span-3 flex flex-col gap-4 h-full max-h-screen overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-8">
                {/* ACTIVE QUEUE STATS */}
                <div className="bg-[#1a1a1a] text-white rounded-[40px] p-6 shadow-xl relative overflow-hidden flex-shrink-0">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFA365] opacity-20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
                    
                    <h3 className="relative z-10 text-lg font-bold mb-1">Queue Status</h3>
                    <p className="relative z-10 text-xs font-semibold opacity-70 mb-4 uppercase tracking-wider text-[#FFA365]">Pending Reviews</p>
                    
                    <div className="relative z-10 flex items-end gap-2">
                        <span className="text-6xl font-black tracking-tighter">{queue.length}</span>
                        <span className="text-xl font-bold mb-2">left</span>
                    </div>
                </div>

                <div className="h-px bg-gray-200 w-full rounded-full shrink-0 my-1"></div>

                {/* ACCEPTED & REJECTED STATBOXES */}
                <div className="flex flex-col gap-4 shrink-0">
                    <div className="bg-[#1a1a1a] text-white rounded-[40px] p-6 shadow-xl relative overflow-hidden shrink-0 group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 opacity-20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none transition-transform group-hover:scale-110" />
                        
                        <div className="relative z-10 flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold mb-1  transition-colors">Accepted</h3>
                                <p className="text-xs font-semibold opacity-70 uppercase tracking-wider text-green-500">Total Verified</p>
                            </div>
                            <CheckCircle2 size={24} className="text-green-500 opacity-80" />
                        </div>
                        
                        <div className="relative z-10 flex items-end gap-2">
                            <span className="text-5xl font-black tracking-tighter">{stats.approved}</span>
                            <span className="text-lg font-bold mb-1.5 opacity-80">docs</span>
                        </div>
                    </div>

                    <div className="bg-[#1a1a1a] text-white rounded-[40px] p-6 shadow-xl relative overflow-hidden shrink-0 group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500 opacity-20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none transition-transform group-hover:scale-110" />
                        
                        <div className="relative z-10 flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold mb-1  transition-colors">Rejected</h3>
                                <p className="text-xs font-semibold opacity-70 uppercase tracking-wider text-red-500">Failed Checking</p>
                            </div>
                            <XCircle size={24} className="text-red-500 opacity-80" />
                        </div>
                        
                        <div className="relative z-10 flex items-end gap-2">
                            <span className="text-5xl font-black tracking-tighter">{stats.rejected}</span>
                            <span className="text-lg font-bold mb-1.5 opacity-80">docs</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= BLUR MODAL FOR REVIEW ================= */}
            <AnimatePresence>
                {selectedExp && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => !isVerifying && setSelectedExp(null)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative w-full max-w-3xl bg-white rounded-[40px] overflow-hidden flex flex-col max-h-[90vh] shadow-2xl"
                        >
                            {/* Modal Header */}
                            <div className="bg-[#f8f9fa] border-b border-gray-100 p-6 flex justify-between items-center shrink-0">
                                <div className="flex gap-4 items-center">
                                    <div className="w-12 h-12 bg-black rounded-full flex flex-col items-center justify-center text-white shrink-0">
                                        <BookOpen size={16} />
                                    </div>
                                    <div>
                                        <h3 className="font-extrabold text-2xl text-gray-900 tracking-tight leading-none mb-1">{selectedExp.company}</h3>
                                        <p className="font-bold text-gray-500 uppercase tracking-widest text-[10px]">{selectedExp.role}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => !isVerifying && setSelectedExp(null)}
                                    className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-black hover:text-white transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Modal Body (Scrollable Read Area) */}
                            <div className="p-8 overflow-y-auto w-full max-h-full">
                                <div className="flex gap-2 mb-6">
                                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                        {selectedExp.type} Experience
                                    </span>
                                    <span className="bg-[#fce5d8] text-[#ff802b] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                        By {selectedExp.authorName} ({selectedExp.universityId})
                                    </span>
                                </div>
                                
                                <div className="prose prose-sm md:prose-base prose-gray max-w-none text-gray-700 leading-relaxed">
                                    {selectedExp.content.split('\n').map((paragraph: string, idx: number) => (
                                        <p key={idx} className="mb-4">{paragraph}</p>
                                    ))}
                                </div>
                            </div>

                            {/* Modal Footer (Action Strip) */}
                            <div className="bg-white border-t border-gray-100 p-6 flex gap-3 shrink-0">
                                <button 
                                    onClick={() => handleVerification(selectedExp._id, 'rejected')}
                                    disabled={isVerifying}
                                    className="flex-1 max-w-[200px] py-4 bg-red-50 text-red-500 font-extrabold text-sm uppercase tracking-widest rounded-full hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                                >
                                    <XCircle size={16} /> Reject
                                </button>
                                <button 
                                    onClick={() => handleVerification(selectedExp._id, 'approved')}
                                    disabled={isVerifying}
                                    className="flex-1 py-4 bg-[#FFA365] text-black font-extrabold text-sm uppercase tracking-widest rounded-full hover:scale-[1.02] transition disabled:opacity-50 flex justify-center items-center gap-2 shadow-xl shadow-[#FFA365]/30"
                                >
                                    {isVerifying ? <Loader2 size={16} className="animate-spin" /> : <><CheckCircle2 size={16} /> Approve & Publish</>}
                                </button>
                            </div>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </motion.main>
    )
}
