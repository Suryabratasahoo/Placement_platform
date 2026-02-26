// app/student/drives/particularDrive/page.tsx

"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, MessageCircle, ThumbsUp, Send, ThumbsDown, Briefcase, MapPin, IndianRupee, ExternalLink } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

// 1. Dedicated Floating Emoji Component (Unchanged)
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

// 2. Updated Individual Card Component (Unchanged)
const CommentCard = ({ user, text, role }: { user: string; text: string, role: string }) => {
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
        <div className="group relative bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-[2px]">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-1000 ease-out pointer-events-none" />

            <div className="relative z-10 flex flex-col gap-6">
                <p className="text-gray-700 text-lg leading-relaxed font-medium italic">
                    "{text}"
                </p>

                <div className="flex items-end justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-[#b4a9f8] flex items-center justify-center text-white font-bold shadow-sm">
                            {user.charAt(0)}
                        </div>

                        <div>
                            <p className="font-bold text-gray-900 text-sm">{user}</p>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-tight">{role}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 bg-gray-50/80 rounded-2xl p-1.5 border border-gray-100">
                        <button onClick={() => spawnReaction("👍")} className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white hover:shadow-sm transition-all active:scale-90 relative">
                            <ThumbsUp size={18} className="text-gray-400 group-hover:text-green-500 transition-colors" />
                            <AnimatePresence>
                                {reactions.map(r => r.emoji === "👍" && (
                                    <FloatingEmoji key={r.id} emoji="👍" onClear={() => removeReaction(r.id)} />
                                ))}
                            </AnimatePresence>
                        </button>

                        <span className="text-xs font-bold text-gray-500 min-w-[20px] text-center">{votes}</span>

                        <button onClick={() => spawnReaction("👎")} className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white hover:shadow-sm transition-all active:scale-90 relative">
                            <ThumbsDown size={18} className="text-gray-400 group-hover:text-red-400 transition-colors" />
                            <AnimatePresence>
                                {reactions.map(r => r.emoji === "👎" && (
                                    <FloatingEmoji key={r.id} emoji="👎" onClear={() => removeReaction(r.id)} />
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
export default function DriveDetailPage() {
    const [inputText, setInputText] = useState("")

    const comments = [
        { user: "Jacob S.", role: "Placed Senior", text: "Focus heavily on Graphs and DP for the OA. They asked two hard questions last year, both heavily reliant on optimizing time complexity." },
        { user: "Aisha R.", role: "Student Candidate", text: "Does anyone know if the resume shortlisting is automated (ATS) or manual for this drive?" },
        { user: "Dev Master", role: "Alumni", text: "It's usually an ATS pass first. Make sure you include the exact keywords from the job description, especially around React and Node.js." }
    ]

    return (
        <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white rounded-[40px] p-4 h-full overflow-hidden text-black"
        >
            {/* ================= LEFT SIDEBAR (Overview) ================= */}
            <div className="lg:col-span-3 bg-[#0c0c0c] rounded-[40px] p-6 text-white flex flex-col shadow-xl h-full overflow-hidden">
                <Link href="/student/drives">
                    <button className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100 mb-6 transition-opacity">
                        <ArrowLeft size={16} /> Back to Drives
                    </button>
                </Link>

                <div className="space-y-4">
                    <p className="text-[#b4a9f8] text-xs font-bold tracking-[0.18em] uppercase">Software Engineering</p>
                    <h2 className="text-3xl font-bold leading-snug">Google SDE Intern</h2>
                    
                    <div className="flex flex-wrap gap-2 pt-2">
                        <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold flex items-center gap-1"><MapPin size={12}/> Bangalore</span>
                        <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold flex items-center gap-1"><IndianRupee size={12}/> 1.2L / mo</span>
                    </div>
                </div>

                <div className="mt-8 relative rounded-[28px] overflow-hidden bg-gradient-to-br from-[#b4a9f8] to-[#681cf5] flex flex-col items-center justify-center p-6 text-center border border-white/10 shadow-lg group">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                    <h2 className="text-2xl font-black text-white mb-1 relative z-10">Apply Now</h2>
                    <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-4 relative z-10">Deadline: Oct 15</p>
                    <button className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 hover:scale-105 transition-transform relative z-10 shadow-xl">
                        Portal Link <ExternalLink size={14} />
                    </button>
                </div>

                <div className="mt-auto pt-6">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-3 pl-2">Ask a Question</p>
                    <div className="bg-[#1a1a1a] rounded-[24px] p-2 flex items-center gap-2 border border-gray-700 focus-within:border-[#b4a9f8] transition-colors">
                        <textarea
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            placeholder="Type your query..."
                            rows={1}
                            className="flex-1 bg-transparent px-2 py-1 resize-none outline-none text-sm text-white placeholder-gray-500 scrollbar-none"
                        />
                        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition shadow-lg shadow-white/10">
                            <Send size={16} className="text-black" />
                        </button>
                    </div>
                </div>
            </div>

            {/* ================= RIGHT MAIN CONTENT ================= */}
            <div className="lg:col-span-9 bg-[#f9fafb] rounded-[50px] p-8 flex flex-col overflow-hidden border border-gray-100">
                
                {/* Drive Description Box */}
                <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 mb-8 shrink-0">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                        <Briefcase size={18} className="text-[#b4a9f8]" /> Description & Eligibility
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                        Google is hiring Software Engineering Interns for the Summer 2026 batch. You will work on core products and services alongside experienced engineers. The selection process involves an initial resume screening, followed by an Online Assessment (OA) focused on Data Structures and Algorithms, and 2 Technical Interview rounds.
                    </p>
                    <div className="flex gap-4">
                        <span className="text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">B.Tech CSE/ECE only</span>
                        <span className="text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">No active backlogs</span>
                        <span className="text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">CGPA 8.0+</span>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-6 shrink-0">
                    <h2 className="text-2xl font-bold text-gray-900">Discussions & Tips</h2>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{comments.length} Threads</span>
                </div>
                
                {/* Comments Scrollable Area */}
                <div className="flex-1 overflow-y-auto scrollbar-none space-y-4 pr-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-10">
                    {comments.map((c, i) => (
                        <CommentCard key={i} user={c.user} text={c.text} role={c.role} />
                    ))}
                </div>

            </div>
        </motion.main>
    )
}