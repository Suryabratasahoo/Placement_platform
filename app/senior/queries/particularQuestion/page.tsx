// app/senior/queries/particularQuestion/page.tsx

"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, MessageCircle, ThumbsUp, Send, ThumbsDown } from "lucide-react"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link" // <-- Added Link import!

// 1. Dedicated Floating Emoji Component
const FloatingEmoji = ({ emoji, onClear }: { emoji: string; onClear: () => void }) => {
    return (
        <motion.span
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -80, scale: 1.5, x: Math.random() * 40 - 20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            onAnimationComplete={onClear}
            className="absolute pointer-events-none text-2xl z-50"
        >
            {emoji}
        </motion.span>
    )
}

// 2. Updated Individual Card Component
const CommentCard = ({ user, text }: { user: string; text: string }) => {
    const [reactions, setReactions] = useState<{ id: number; emoji: string }[]>([]);
    const [votes, setVotes] = useState(0);

    const spawnReaction = (emoji: string) => {
        const id = Date.now() + Math.random();
        setReactions(prev => [...prev, { id, emoji }]);
        setVotes(prev => (emoji === "👍" ? prev + 1 : prev - 1));
    };

    const removeReaction = (id: number) => {
        setReactions(prev => prev.filter(r => r.id !== id));
    };

    return (
        <div
            className="
        group relative bg-white rounded-[32px] p-8
        shadow-sm border border-gray-100
        overflow-hidden transition-all duration-300
        hover:shadow-lg hover:-translate-y-[2px]
      "
        >
            {/* Professional Shine sweep layer */}
            <div
                className="
          absolute inset-0
          bg-gradient-to-r from-transparent via-white/60 to-transparent
          translate-x-[-120%] group-hover:translate-x-[120%]
          transition-transform duration-1000 ease-out
          pointer-events-none
        "
            />

            {/* Layout matching your image */}
            <div className="relative z-10 flex flex-col gap-6">

                {/* Top Section: Comment text (Quote style) */}
                <p className="text-gray-700 text-lg leading-relaxed font-medium italic">
                    "{text}"
                </p>

                {/* Bottom section */}
                <div className="flex items-end justify-between">

                    {/* Left: User Info */}
                    <div className="flex items-center gap-4">
                        <div
                            className="
                                w-12 h-12 rounded-full
                                bg-gradient-to-br from-indigo-400 to-purple-500
                                flex items-center justify-center
                                text-white font-bold shadow-sm
                            "
                        >
                            {user.charAt(0)}
                        </div>

                        <div>
                            <p className="font-bold text-gray-900 text-sm">{user}</p>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-tight">Community Contributor</p>
                        </div>
                    </div>

                    {/* Right: Interaction Bar */}
                    <div className="flex items-center gap-1 bg-gray-50/80 rounded-2xl p-1.5 border border-gray-100">

                        {/* Like */}
                        <button
                            onClick={() => spawnReaction("👍")}
                            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white hover:shadow-sm transition-all active:scale-90 relative"
                        >
                            <ThumbsUp size={18} className="text-gray-400 group-hover:text-green-500 transition-colors" />
                            <AnimatePresence>
                                {reactions.map(r => r.emoji === "👍" && (
                                    <FloatingEmoji
                                        key={r.id}
                                        emoji="👍"
                                        onClear={() => removeReaction(r.id)}
                                    />
                                ))}
                            </AnimatePresence>
                        </button>

                        {/* Vote Counter */}
                        <span className="text-xs font-bold text-gray-500 min-w-[20px] text-center">
                            {votes}
                        </span>

                        {/* Dislike */}
                        <button
                            onClick={() => spawnReaction("👎")}
                            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white hover:shadow-sm transition-all active:scale-90 relative"
                        >
                            <ThumbsDown size={18} className="text-gray-400 group-hover:text-red-400 transition-colors" />
                            <AnimatePresence>
                                {reactions.map(r => r.emoji === "👎" && (
                                    <FloatingEmoji
                                        key={r.id}
                                        emoji="👎"
                                        onClear={() => removeReaction(r.id)}
                                    />
                                ))}
                            </AnimatePresence>
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};


// 3. Main Page Component
function QuestionDetailContent() {
    const searchParams = useSearchParams()
    const id = searchParams.get("id")

    const [query, setQuery] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [liked, setLiked] = useState(false)
    const [likes, setLikes] = useState(0)
    const [inputText, setInputText] = useState("")

    useEffect(() => {
        if (!id) return;
        fetch(`/api/queries/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setQuery(data.data)
                    setLikes(data.data.upvotes || 0)
                }
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [id])

    const toggleLike = () => {
        setLiked(!liked)
        setLikes(prev => liked ? prev - 1 : prev + 1)
    }

    const handleSend = async () => {
        if (!inputText.trim() || !query) return;

        const newAnswer = {
            user: "Senior Alumni",
            role: "senior",
            text: inputText
        }

        try {
            const res = await fetch(`/api/queries/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newAnswer)
            })
            const data = await res.json()
            if (data.success) {
                setQuery(data.data)
                setInputText("")
            }
        } catch (error) {
            console.error("Failed to post answer", error)
        }
    }

    if (loading) return <div className="p-8 text-black grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white rounded-[40px] h-screen overflow-hidden">Loading...</div>
    if (!query) return <div className="p-8 text-black grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white rounded-[40px] h-screen overflow-hidden">Query not found.</div>

    return (
        <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white rounded-[40px] p-4 h-screen overflow-hidden text-black"
        >
            {/* LEFT SIDEBAR */}
            <div className="lg:col-span-3 bg-[#0c0c0c] rounded-[40px] p-6 text-white flex flex-col shadow-xl h-full overflow-hidden">
                
                {/* <-- WRAPPED THE BACK BUTTON IN A LINK HERE --> */}
                <Link href="/senior/queries">
                    <button className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100 mb-6 transition-opacity">
                        <ArrowLeft size={16} /> Back
                    </button>
                </Link>

                <div className="space-y-4">
                    <p className="text-orange-300 text-xs font-bold tracking-[0.18em] uppercase">{query.tags?.join(" • ") || "No Tags"}</p>
                    <h2 className="text-xl font-bold leading-snug">{query.title}</h2>
                    
                    <div className="flex gap-5 text-sm font-semibold pt-2">
                        <button onClick={toggleLike} className={`flex items-center gap-1 transition ${liked ? "text-orange-400" : "text-white"}`}>
                            <ThumbsUp size={16} fill={liked ? "currentColor" : "none"} />
                            {likes}
                        </button>
                        <span className="flex items-center gap-1 opacity-80">
                            <MessageCircle size={16} /> {query.answers?.length || 0}
                        </span>
                    </div>
                </div>

                <div className="mt-8 relative h-40 rounded-[28px] overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center border border-white/5">
                    <h2 className="text-lg font-bold text-white mb-2">Help Your Juniors</h2>
                    <p className="text-gray-400 text-xs leading-relaxed">Your guidance today builds the leaders of tomorrow.</p>
                </div>

                <div className="mt-auto pt-6">
                    <div className="bg-[#1a1a1a] rounded-[24px] p-2 flex items-center gap-2 border border-gray-700 focus-within:border-gray-500 transition-colors">
                        <textarea
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            placeholder="Share your thoughts..."
                            rows={1}
                            className="flex-1 bg-transparent px-2 py-1 resize-none outline-none text-sm text-white placeholder-gray-400"
                        />
                        <button onClick={handleSend} className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition shadow-lg shadow-white/10">
                            <Send size={16} className="text-black" />
                        </button>
                    </div>
                </div>
            </div>

            {/* RIGHT MAIN CONTENT (Comments) */}
            <div className="lg:col-span-9 bg-[#f9fafb] rounded-[40px] p-8 flex flex-col overflow-hidden border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Answers</h2>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{query.answers?.length || 0} Responses</span>
                </div>
                
                <div className="flex-1 overflow-y-auto scrollbar-none space-y-6 pr-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    {query.answers?.map((c: any, i: number) => (
                        <CommentCard key={i} user={c.user} text={c.text} />
                    ))}
                </div>
            </div>
        </motion.main>
    )
}

export default function QuestionDetailPage() {
    return (
        <Suspense fallback={<div className="p-8 text-black grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white rounded-[40px] h-screen overflow-hidden">Loading...</div>}>
            <QuestionDetailContent />
        </Suspense>
    )
}