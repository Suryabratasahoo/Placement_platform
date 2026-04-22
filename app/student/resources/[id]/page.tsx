// app/student/resources/[id]/page.tsx

"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, MessageCircle, ThumbsUp, Send, ThumbsDown, BookOpen, GraduationCap } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

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

// 2. Individual Comment/Answer Card Component
const AnswerCard = ({ user, text, isSenior }: { user: string; text: string; isSenior?: boolean }) => {
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
        group relative bg-white rounded-[40px] p-8
        shadow-sm border border-gray-100
        overflow-hidden transition-all duration-300
        hover:shadow-lg
      "
        >
            {/* Professional Shine sweep layer */}
            <div
                className="
          absolute inset-0
          bg-gradient-to-r from-transparent via-white/40 to-transparent
          translate-x-[-120%] group-hover:translate-x-[120%]
          transition-transform duration-1000 ease-out
          pointer-events-none
        "
            />

            <div className="relative z-10 flex flex-col gap-6">
                {/* Content text */}
                <p className="text-gray-700 text-lg leading-relaxed font-medium">
                    {text}
                </p>

                {/* Bottom section */}
                <div className="flex items-end justify-between">
                    {/* Left: User Info */}
                    <div className="flex items-center gap-4">
                        <div
                            className={`
                                w-12 h-12 rounded-2xl
                                ${isSenior ? 'bg-black text-white' : 'bg-[#f5f3ff] text-[#b4a9f8]'}
                                flex items-center justify-center
                                font-bold shadow-sm border border-gray-100
                            `}
                        >
                            {isSenior ? <GraduationCap size={20} /> : user.charAt(0)}
                        </div>

                        <div>
                            <p className="font-bold text-gray-900 text-sm flex items-center gap-2">
                                {user}
                                {isSenior && <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-[8px] uppercase tracking-tighter">Senior</span>}
                            </p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{isSenior ? "Verified Expert" : "Community Member"}</p>
                        </div>
                    </div>

                    {/* Right: Interaction Bar */}
                    <div className="flex items-center gap-1 bg-gray-50 rounded-2xl p-1.5 border border-gray-100 font-bold">
                        <button
                            onClick={() => spawnReaction("👍")}
                            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white hover:shadow-sm transition-all active:scale-90 relative"
                        >
                            <ThumbsUp size={18} className="text-gray-400 group-hover:text-green-500" />
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

                        <span className="text-xs font-black text-gray-500 min-w-[24px] text-center">
                            {votes}
                        </span>

                        <button
                            onClick={() => spawnReaction("👎")}
                            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white hover:shadow-sm transition-all active:scale-90 relative"
                        >
                            <ThumbsDown size={18} className="text-gray-400 group-hover:text-red-400" />
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

// Main Page Component
export default function ResourceDetailPage({ params }: { params: { id: string } }) {
    const [liked, setLiked] = useState(false)
    const [likes, setLikes] = useState(124)
    const [inputText, setInputText] = useState("")

    const answers = [
        {
            user: "Vikram Singh",
            text: "The O(1) space solution usually involves calculating the length of both lists and aligning the starting pointers. It's an elegant trick that many interviewers love to see!",
            isSenior: true
        },
        {
            user: "Aditi Sharma",
            text: "Adding to Vikram's point, make sure you handle the case where there is NO intersection. The pointers will both hit null simultaneously in that case.",
            isSenior: false
        },
        {
            user: "Rahul Verma",
            text: "I actually got this exact question in my Amazon interview last month. Using the two-pointer approach where each pointer traverses both lists is much cleaner than the length calculation method.",
            isSenior: true
        }
    ]

    const toggleLike = () => {
        setLiked(!liked)
        setLikes(prev => liked ? prev - 1 : prev + 1)
    }

    return (
        <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white rounded-[40px] p-4 h-full overflow-hidden text-black font-sans"
        >
            {/* LEFT SIDEBAR */}
            <div className="lg:col-span-3 bg-[#0c0c0c] rounded-[40px] p-8 text-white flex flex-col shadow-xl h-full overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#b4a9f8] opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pr-1">
                    <Link href="/student/resources">
                        <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-60 hover:opacity-100 mb-10 transition-all group cursor-pointer">
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Resources
                        </button>
                    </Link>

                    <div className="space-y-6 relative z-10 mb-10">
                        <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                                <BookOpen size={18} className="text-[#FFA365]" />
                             </div>
                             <p className="text-orange-300 text-[10px] font-black tracking-[0.2em] uppercase">DSA • Linked List</p>
                        </div>
                        
                        <h2 className="text-2xl font-black leading-tight tracking-tight">How to find intersection of two linked lists in O(1) space?</h2>
                        
                        <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest pt-4">
                            <button onClick={toggleLike} className={`flex items-center gap-2 transition-all ${liked ? "text-orange-400" : "text-white/60 hover:text-white cursor-pointer"}`}>
                                <ThumbsUp size={16} fill={liked ? "currentColor" : "none"} />
                                {likes} Helpfull
                            </button>
                            <span className="flex items-center gap-2 text-white/60">
                                <MessageCircle size={16} /> 18 Responses
                            </span>
                        </div>
                    </div>

                    <div className="group bg-white/5 border border-white/10 rounded-[32px] p-8 text-center relative overflow-hidden mb-8">
                        <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-2">Contribution Mode</p>
                        <h2 className="text-lg font-bold text-white mb-2 leading-tight">Help the Community</h2>
                        <p className="text-white/60 text-[10px] font-bold leading-relaxed mb-6">Found a better way? Share your knowledge and earn reputation points.</p>
                        <button className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] transition shadow-lg text-[10px] cursor-pointer">Guidelines</button>
                    </div>
                </div>

                {/* Input Area (Pinned to Bottom) */}
                <div className="pt-6 shrink-0">
                    <div className="bg-white/5 rounded-[28px] p-3 flex items-center gap-2 border border-white/10 focus-within:border-white/30 transition-all">
                        <textarea
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            placeholder="Type your answer..."
                            rows={1}
                            className="flex-1 bg-transparent px-3 py-2 resize-none outline-none text-sm text-white placeholder-white/20 font-medium"
                        />
                        <button className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center hover:scale-[1.05] transition-all shadow-xl shadow-white/5 group cursor-pointer">
                            <Send size={18} className="text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* RIGHT MAIN CONTENT (Comments/Answers) */}
            <div className="lg:col-span-9 bg-[#f5f5f5] rounded-[50px] p-10 flex flex-col overflow-hidden border border-gray-100">
                <div className="flex items-center justify-between mb-10 shrink-0">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Verified Answers</h2>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">Community & Senior Perspective</p>
                    </div>
                    <span className="bg-white px-5 py-2.5 border border-gray-200 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest shadow-sm">
                        {answers.length} Total Responses
                    </span>
                </div>
                
                <div className="flex-1 overflow-y-auto scrollbar-none space-y-6 pr-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-10">
                    <AnimatePresence>
                        {answers.map((ans, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <AnswerCard user={ans.user} text={ans.text} isSenior={ans.isSenior} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </motion.main>
    )
}
