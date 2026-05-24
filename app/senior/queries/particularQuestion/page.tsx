// app/senior/queries/particularQuestion/page.tsx

"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft, ThumbsUp, MessageSquare, Send, ThumbsDown, Filter } from "lucide-react"
import { toast } from "react-hot-toast"
import { useUserStore } from "@/store/userStore"

export default function ParticularQuestionPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const id = searchParams.get("id")

    const userId = useUserStore((state) => state.userId)
    const name = useUserStore((state) => state.name)
    const role = useUserStore((state) => state.role)

    const [queryData, setQueryData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [newAnswer, setNewAnswer] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [sortMode, setSortMode] = useState<'highest' | 'latest'>('highest')
    const [isSortMenuOpen, setIsSortMenuOpen] = useState(false)

    useEffect(() => {
        if (!id) return

        fetch(`/api/queries/${id}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setQueryData(data.data)
                } else {
                    toast.error("Failed to load question")
                }
                setLoading(false)
            })
            .catch((err) => {
                console.error("Error fetching data:", err)
                setLoading(false)
            })
    }, [id])

    const handleSubmitAnswer = async () => {
        if (!newAnswer.trim()) {
            toast.error("Please write an answer first.")
            return
        }

        if (!userId) {
            toast.error("You must be logged in to answer.")
            return
        }

        setIsSubmitting(true)

        const answerPayload = {
            text: newAnswer,
            role: role || "senior",
            user: name || "Senior Alumni",
            likes: [],
            dislikes: []
        }

        try {
            const res = await fetch(`/api/queries/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(answerPayload),
            })
            const data = await res.json()

            if (data.success) {
                toast.success("Answer posted!")
                setNewAnswer("")
                setQueryData(data.data) 
            } else {
                throw new Error(data.error)
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to post answer")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleVote = async (targetAnswerId: string, action: 'like' | 'dislike') => {
        if (!userId) {
            toast.error("You must be logged in to vote.")
            return
        }

        try {
            const res = await fetch(`/api/queries/${id}/vote`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answerId: targetAnswerId, userId, action }),
            })
            const data = await res.json()

            if (data.success) {
                setQueryData(data.data) 
            } else {
                toast.error(data.error)
            }
        } catch (err) {
            toast.error("Failed to register vote")
        }
    }

    const sortedAnswers = queryData?.answers ? [...queryData.answers].sort((a, b) => {
        if (sortMode === 'highest') {
            const aScore = (a.likes?.length || 0) - (a.dislikes?.length || 0);
            const bScore = (b.likes?.length || 0) - (b.dislikes?.length || 0);
            
            if (bScore === aScore) {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            return bScore - aScore;
        } else {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
    }) : [];

    // Helper function to format the date nicely
    const formatDateTime = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    }

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center text-white min-h-[500px]">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full" />
            </div>
        )
    }

    if (!queryData) {
        return <div className="text-white p-8">Question not found. Return to dashboard.</div>
    }

    return (
        <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white rounded-[40px] p-4 h-[calc(100vh-100px)] overflow-hidden"
        >
            <div className="lg:col-span-4 bg-[#0c0c0c] rounded-[35px] p-8 flex flex-col relative overflow-hidden shadow-2xl">
                
                <svg className="absolute right-0 top-10 h-3/4 opacity-20 pointer-events-none" viewBox="0 0 200 200">
                    <path fill="none" stroke="white" strokeWidth="1.5" d="M100,20 C150,50 50,150 180,180" strokeLinecap="round" />
                </svg>

                <button 
                    onClick={() => router.back()} 
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors w-fit text-sm font-semibold mb-8 relative z-10 cursor-pointer"
                >
                    <ArrowLeft size={16} /> Back
                </button>

                <div className="relative z-10">
                    <p className="text-[#FFB870] text-[10px] font-bold tracking-[0.15em] uppercase mb-3">
                        {queryData?.tags?.join(" • ") || "GENERAL"}
                    </p>
                    <h1 className="text-white text-3xl font-bold leading-tight mb-6">
                        {queryData?.title || "Untitled Question"}
                    </h1>
                    
                    <div className="flex items-center gap-4 text-white/80 font-semibold text-sm mb-8">
                        <div className="flex items-center gap-1.5">
                            <ThumbsUp size={16} /> {queryData?.upvotes || 0}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <MessageSquare size={16} /> {queryData?.answers?.length || 0}
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[20px] p-6 text-center mb-8 relative z-10 backdrop-blur-sm">
                    <h3 className="text-white font-bold text-lg mb-2">Help Your Juniors</h3>
                    <p className="text-white/50 text-xs leading-relaxed">
                        Your guidance today builds the leaders of tomorrow.
                    </p>
                </div>

                <div className="mt-auto relative z-10">
                    <div className="relative flex items-center group">
                        <input
                            type="text"
                            value={newAnswer}
                            onChange={(e) => setNewAnswer(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmitAnswer()}
                            placeholder="Share your thoughts..."
                            disabled={isSubmitting}
                            className="w-full bg-[#1a1a1a] border border-white/10 rounded-full py-4 pl-6 pr-14 outline-none focus:border-[#FFB870]/50 transition-all text-white text-sm placeholder-white/30 disabled:opacity-50"
                        />
                        <button 
                            onClick={handleSubmitAnswer}
                            disabled={isSubmitting}
                            className="absolute right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
                        >
                            {isSubmitting ? (
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
                            ) : (
                                <Send className="w-4 h-4 text-black ml-0.5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-8 bg-[#f5f5f5] rounded-[35px] p-8 flex flex-col overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                
                <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4 relative z-20">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-bold text-black leading-none">Answers</h2>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            {queryData?.answers?.length || 0} RESPONSES
                        </span>
                    </div>

                    <div className="relative">
                        <button 
                            onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                            className="flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-600 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer"
                        >
                            <Filter size={14} />
                            {sortMode === 'highest' ? 'Highest Votes' : 'Latest Responses'}
                        </button>

                        {isSortMenuOpen && (
                            <>
                                <div 
                                    className="fixed inset-0 z-10" 
                                    onClick={() => setIsSortMenuOpen(false)} 
                                />
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 overflow-hidden py-2 flex flex-col">
                                    <button 
                                        onClick={() => { setSortMode('highest'); setIsSortMenuOpen(false); }}
                                        className={`text-left px-5 py-3 text-sm font-semibold transition-colors hover:bg-gray-50 cursor-pointer ${sortMode === 'highest' ? 'text-[#FFB870]' : 'text-gray-500'}`}
                                    >
                                        Highest Votes
                                    </button>
                                    <button 
                                        onClick={() => { setSortMode('latest'); setIsSortMenuOpen(false); }}
                                        className={`text-left px-5 py-3 text-sm font-semibold transition-colors hover:bg-gray-50 cursor-pointer ${sortMode === 'latest' ? 'text-[#FFB870]' : 'text-gray-500'}`}
                                    >
                                        Latest Responses
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-4 relative z-10">
                    {sortedAnswers.length > 0 ? (
                        sortedAnswers.map((ans: any, idx: number) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={ans._id || idx} 
                                className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100"
                            >
                                <p className="text-gray-800 text-base italic mb-6">
                                    "{ans.text}"
                                </p>
                                
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div 
                                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm" 
                                            style={{ backgroundColor: ans.role === 'senior' ? '#8b5cf6' : '#9ca3af' }}
                                        >
                                            {ans.user ? ans.user.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <div className="flex flex-col">
                                            {/* Modified this block to include the date and time */}
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-sm font-bold text-black">
                                                    {ans.user || 'Anonymous'}
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-medium">
                                                    {formatDateTime(ans.createdAt)}
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                                                {ans.role === 'senior' ? 'COMMUNITY CONTRIBUTOR' : 'STUDENT'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 bg-gray-50 rounded-full px-4 py-2 border border-gray-100">
                                        {/* Changed the active color to text-emerald-500 */}
                                        <button 
                                            onClick={() => handleVote(ans._id, 'like')}
                                            className={`transition-colors cursor-pointer ${ans.likes?.includes(userId) ? 'text-emerald-500' : 'text-gray-400 hover:text-black'}`}
                                        >
                                            <ThumbsUp size={16} />
                                        </button>
                                        <span className="text-xs font-bold text-black">
                                            {(ans.likes?.length || 0) - (ans.dislikes?.length || 0)}
                                        </span>
                                        <button 
                                            onClick={() => handleVote(ans._id, 'dislike')}
                                            className={`transition-colors cursor-pointer ${ans.dislikes?.includes(userId) ? 'text-red-400' : 'text-gray-400 hover:text-black'}`}
                                        >
                                            <ThumbsDown size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center text-gray-400 py-16">
                            <MessageSquare size={40} className="opacity-20 mb-4" />
                            <p className="italic text-sm">No answers yet. Be the first to guide your juniors!</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.main>
    )
}