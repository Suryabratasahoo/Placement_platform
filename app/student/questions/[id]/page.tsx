// app/student/questions/[id]/page.tsx

"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, MessageCircle, ThumbsUp, Send, ThumbsDown, GraduationCap, Loader2, X, Pencil, Trash2 } from "lucide-react"
import { useState, useEffect, FormEvent } from "react"
import Link from "next/link"
import toast from "react-hot-toast"
import { useUserStore } from "@/store/userStore"

// Floating Emoji Component
const FloatingEmoji = ({ emoji, onClear }: { emoji: string; onClear: () => void }) => {
    return (
        <motion.span
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -80, scale: 1.5, x: Math.random() * 40 - 20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            onAnimationComplete={onClear}
            className="absolute pointer-events-none text-2xl z-50 font-bold"
        >
            {emoji}
        </motion.span>
    )
}

// Individual Answer Card Component
const AnswerCard = ({ 
    answer, 
    currentUserId, 
    onEdit, 
    onDelete 
}: { 
    answer: any; 
    currentUserId: string; 
    onEdit: (ans: any) => void;
    onDelete: (ans: any) => void;
}) => {
    // Make sure to handle legacy embedded answers which might not have likes/userId
    const initialLikes = answer.likes || [];
    const initialDislikes = answer.dislikes || [];
    
    const [likesArray, setLikesArray] = useState<string[]>(initialLikes);
    const [dislikesArray, setDislikesArray] = useState<string[]>(initialDislikes);
    const [reactions, setReactions] = useState<{ id: number; emoji: string }[]>([]);

    useEffect(() => {
        setLikesArray(answer.likes || []);
        setDislikesArray(answer.dislikes || []);
    }, [answer.likes, answer.dislikes]);

    const userHasLiked = currentUserId ? likesArray.includes(currentUserId) : false;
    const userHasDisliked = currentUserId ? dislikesArray.includes(currentUserId) : false;
    const isOwner = currentUserId && (answer.userId === currentUserId);

    const spawnReaction = (emoji: string) => {
        const id = Date.now() + Math.random();
        setReactions(prev => [...prev, { id, emoji }]);
    };

    const removeReaction = (id: number) => {
        setReactions(prev => prev.filter(r => r.id !== id));
    };

    const handleReaction = async (type: 'like' | 'dislike') => {
        if (!currentUserId) return toast.error("Please login to vote");
        // For legacy embedded answers that don't have an _id in the Answer collection
        if (!answer._id || !answer.userId) return toast.error("Legacy comments cannot be voted on.");
        
        spawnReaction(type === 'like' ? '👍' : '👎');

        // Optimistic UI update
        if (type === 'like') {
            if (userHasLiked) {
                setLikesArray(p => p.filter(id => id !== currentUserId));
            } else {
                setLikesArray(p => [...p, currentUserId]);
                setDislikesArray(p => p.filter(id => id !== currentUserId));
            }
        } else {
            if (userHasDisliked) {
                setDislikesArray(p => p.filter(id => id !== currentUserId));
            } else {
                setDislikesArray(p => [...p, currentUserId]);
                setLikesArray(p => p.filter(id => id !== currentUserId));
            }
        }

        try {
            await fetch(`/api/student/answers/${answer._id}/react`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUserId, type })
            });
        } catch (error) {
            console.error("Failed to sync reaction");
        }
    };

    return (
        <div className="group relative bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-[2px]">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-1000 ease-out pointer-events-none" />
            <div className="relative z-10 flex flex-col gap-6">
                
                {answer.userId && (
                    <div className="absolute top-0 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {isOwner && (
                            <>
                                <button onClick={() => onEdit(answer)} className="w-8 h-8 rounded-full bg-gray-50 hover:bg-black hover:text-white flex items-center justify-center text-gray-400 transition-colors">
                                    <Pencil size={14} />
                                </button>
                                <button onClick={() => onDelete(answer)} className="w-8 h-8 rounded-full bg-gray-50 hover:bg-red-500 hover:text-white flex items-center justify-center text-gray-400 transition-colors">
                                    <Trash2 size={14} />
                                </button>
                            </>
                        )}
                    </div>
                )}

                <p className="text-gray-700 text-lg leading-relaxed font-medium italic">"{answer.content}"</p>
                <div className="flex items-end justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full ${answer.isSenior ? 'bg-black text-white' : 'bg-gradient-to-br from-indigo-400 to-purple-500 text-white'} flex items-center justify-center font-bold shadow-sm`}>
                            {answer.isSenior ? <GraduationCap size={20} /> : (answer.authorName || 'S').charAt(0)}
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 text-sm">{answer.authorName || 'Student'}</p>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-tight">
                                {answer.isSenior ? 'Verified Senior' : answer.universityId || 'Community Contributor'}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-1 bg-gray-50/80 rounded-2xl p-1.5 border border-gray-100 select-none">
                        <button onClick={() => handleReaction('like')} className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white hover:shadow-sm transition-all active:scale-90 relative cursor-pointer group/btn">
                            <ThumbsUp size={18} className={`transition-colors ${userHasLiked ? 'text-green-500 fill-green-500' : 'text-gray-400 group-hover/btn:text-green-500'}`} />
                            <AnimatePresence>
                                {reactions.map(r => r.emoji === "👍" && <FloatingEmoji key={r.id} emoji="👍" onClear={() => removeReaction(r.id)} />)}
                            </AnimatePresence>
                        </button>
                        <span className="text-[10px] font-black text-gray-500 min-w-[20px] text-center tracking-tighter">
                            {likesArray.length > 0 ? Object.keys(likesArray).length : 0}
                        </span>
                        <div className="w-6 h-[1px] bg-gray-200 my-0.5"></div>
                        <button onClick={() => handleReaction('dislike')} className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white hover:shadow-sm transition-all active:scale-90 relative cursor-pointer group/btn">
                            <ThumbsDown size={18} className={`transition-colors ${userHasDisliked ? 'text-red-400 fill-red-400' : 'text-gray-400 group-hover/btn:text-red-400'}`} />
                            <AnimatePresence>
                                {reactions.map(r => r.emoji === "👎" && <FloatingEmoji key={r.id} emoji="👎" onClear={() => removeReaction(r.id)} />)}
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main Page Component
export default function QuestionDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { userId, name, universityId } = useUserStore()
    const [question, setQuestion] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [liked, setLiked] = useState(false)
    const [inputText, setInputText] = useState("")
    const [isReplying, setIsReplying] = useState(false)
    const [id, setId] = useState<string>("")
    
    // Reply Edit & Delete States
    const [editingAnswer, setEditingAnswer] = useState<any>(null)
    const [editAnswerText, setEditAnswerText] = useState("")
    const [isUpdatingAnswer, setIsUpdatingAnswer] = useState(false)

    const [deletingAnswer, setDeletingAnswer] = useState<any>(null)
    const [isDeletingAnswer, setIsDeletingAnswer] = useState(false)

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

    const fetchDetails = async (qid: string) => {
        try {
            setIsLoading(true)
            const res = await fetch(`/api/student/questions/${qid}`)
            if (res.ok) {
                const data = await res.json()
                setQuestion(data)
                if (userId && data.upvotedBy?.includes(userId)) {
                    setLiked(true);
                } else {
                    setLiked(false);
                }
            } else {
                toast.error("Question not found.")
            }
        } catch (error) {
            toast.error("Database connection error.")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const resolveId = async () => {
            const resolved = await params
            setId(resolved.id)
        }
        resolveId()
    }, [params])

    useEffect(() => {
        if (id) {
            fetchDetails(id)
        }
    }, [id])

    const handleReply = async () => {
        if (!userId) return toast.error("Please login to reply.");
        if (question.author === userId) return toast.error("You cannot reply to your own question.");
        if (!inputText.trim()) return toast.error("Answer cannot be empty.");
        
        setIsReplying(true)
        try {
            const res = await fetch(`/api/student/questions/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    authorName: name || "Student",
                    universityId: universityId || "Unknown",
                    content: inputText,
                    isSenior: false
                })
            })
            if (res.ok) {
                toast.success("Perspective shared!")
                setInputText("")
                fetchDetails(id)
            } else {
                const err = await res.json();
                toast.error(err.message || "Failed to post.");
            }
        } catch (error) {
            toast.error("API error.")
        } finally {
            setIsReplying(false)
        }
    }

    const handleUpdateAnswer = async () => {
        if (!editingAnswer || !editAnswerText.trim() || !userId) return;
        
        setIsUpdatingAnswer(true);
        try {
            const res = await fetch(`/api/student/answers/${editingAnswer._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: editAnswerText, userId })
            });

            if (res.ok) {
                toast.success("Reply updated!");
                setEditingAnswer(null);
                fetchDetails(id);
            } else {
                toast.error("Failed to update.");
            }
        } catch (error) {
            toast.error("Error occurred.");
        } finally {
            setIsUpdatingAnswer(false);
        }
    };

    const handleDeleteAnswer = async () => {
        if (!deletingAnswer || !userId) return;

        setIsDeletingAnswer(true);
        try {
            const res = await fetch(`/api/student/answers/${deletingAnswer._id}?userId=${userId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                toast.success("Reply deleted.");
                setDeletingAnswer(null);
                fetchDetails(id);
            } else {
                toast.error("Failed to delete.");
            }
        } catch (error) {
            toast.error("Error occurred.");
        } finally {
            setIsDeletingAnswer(false);
        }
    };

    const toggleLike = async () => {
        if (!userId) return toast.error("Please login to upvote");
        
        // Optimistic UI update
        const isCurrentlyLiked = liked;
        setLiked(!isCurrentlyLiked);
        setQuestion((prev: any) => ({
            ...prev,
            upvotes: isCurrentlyLiked ? Math.max(0, prev.upvotes - 1) : prev.upvotes + 1
        }));

        try {
            await fetch(`/api/student/questions/${id}/upvote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });
        } catch (error) {
            console.error("Failed to sync upvote.");
        }
    }

    if (isLoading) {
        return (
            <div className="h-full flex flex-col items-center justify-center gap-6 bg-white rounded-[40px]">
                <Loader2 className="animate-spin text-[#681cf5]" size={48} />
                <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Querying Database...</p>
            </div>
        )
    }

    if (!question) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center">
                 <h2 className="text-3xl font-black mb-8">404: Not Found</h2>
                 <Link href="/student/questions">
                    <button className="px-10 py-5 bg-black text-white font-black uppercase tracking-widest rounded-3xl cursor-pointer">Back to Feed</button>
                 </Link>
            </div>
        )
    }

    return (
        <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white rounded-[40px] p-4 h-full overflow-hidden text-black relative"
        >
            {/* LEFT SIDEBAR - Matches Image 3 & Senior Reference Exactly */}
            <div className="lg:col-span-3 bg-[#0c0c0c] rounded-[40px] p-6 text-white flex flex-col shadow-xl h-full overflow-hidden">
                
                <Link href="/student/questions">
                    <button className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100 mb-6 transition-opacity cursor-pointer">
                        <ArrowLeft size={16} /> Back
                    </button>
                </Link>

                <div className="space-y-4">
                    <p className="text-orange-300 text-xs font-bold tracking-[0.18em] uppercase">
                        {formatTag(question.title)}
                    </p>
                    <h2 className="text-xl font-bold leading-snug">
                        {question.description}
                    </h2>
                    
                    <div className="flex gap-5 text-sm font-semibold pt-2">
                        <button onClick={toggleLike} className={`flex items-center gap-1 transition ${liked ? "text-orange-400" : "text-white cursor-pointer hover:opacity-80"}`}>
                            <ThumbsUp size={16} fill={liked ? "currentColor" : "none"} />
                            {question.upvotes || 0}
                        </button>
                        <span className="flex items-center gap-1 opacity-80">
                            <MessageCircle size={16} /> {question.answers?.length || 0}
                        </span>
                    </div>
                </div>

                {/* Help Your Juniors CTA Card - Exact Match */}
                <div className="mt-8 relative h-40 rounded-[28px] overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center border border-white/5">
                    <h2 className="text-lg font-bold text-white mb-2">Help Your Juniors</h2>
                    <p className="text-gray-400 text-xs leading-relaxed">Your guidance today builds the leaders of tomorrow.</p>
                </div>

                {/* Input Area - Hidden if owner */}
                <div className="mt-auto pt-6">
                    {question.author !== userId ? (
                        <div className="bg-[#1a1a1a] rounded-[24px] p-2 flex items-center gap-2 border border-gray-700 focus-within:border-gray-500 transition-colors">
                            <textarea
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                placeholder="Share your thoughts..."
                                rows={1}
                                className="flex-1 bg-transparent px-2 py-1 resize-none outline-none text-sm text-white placeholder-gray-400 scrollbar-none"
                            />
                            <button 
                                onClick={handleReply}
                                disabled={isReplying}
                                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition shadow-lg shadow-white/10 cursor-pointer disabled:opacity-50"
                            >
                                <Send size={16} className="text-black" />
                            </button>
                        </div>
                    ) : (
                        <div className="bg-[#1a1a1a]/50 rounded-[24px] p-4 text-center border border-gray-800">
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">You cannot reply to your own post</p>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT MAIN CONTENT (Discussion Pool) */}
            <div className="lg:col-span-9 bg-[#f9fafb] rounded-[40px] p-8 flex flex-col overflow-hidden border border-gray-100 shadow-inner">
                <div className="flex items-center justify-between mb-8 shrink-0">
                    <h2 className="text-2xl font-bold text-gray-900">Answers</h2>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        {question.answers?.length || 0} Responses
                    </span>
                </div>
                
                <div className="flex-1 overflow-y-auto scrollbar-none space-y-6 pr-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-20">
                    <AnimatePresence>
                        {question.answers && question.answers.length > 0 ? (
                            question.answers.map((ans: any, i: number) => (
                                <motion.div
                                    key={ans._id || i}
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <AnswerCard 
                                        answer={ans}
                                        currentUserId={userId || ''}
                                        onEdit={(a) => {
                                            setEditingAnswer(a);
                                            setEditAnswerText(a.content);
                                        }}
                                        onDelete={(a) => setDeletingAnswer(a)}
                                    />
                                </motion.div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-20 py-20 grayscale">
                                <Loader2 className="animate-pulse mb-8" size={64} />
                                <h3 className="text-2xl font-black uppercase tracking-[0.4em]">Be the first to share</h3>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* EDIT ANSWER MODAL */}
            <AnimatePresence>
                {editingAnswer && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingAnswer(null)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 40 }} className="relative bg-white rounded-[50px] p-12 max-w-2xl w-full shadow-2xl border border-white/10">
                            <h2 className="text-3xl font-black mb-8 text-black">Edit Reply</h2>
                            <div className="space-y-6">
                                <textarea value={editAnswerText} onChange={e => setEditAnswerText(e.target.value)} rows={4} className="w-full bg-gray-100 rounded-3xl px-8 py-6 border-none outline-none font-semibold resize-none text-black" />
                                <div className="flex gap-4">
                                    <button onClick={() => setEditingAnswer(null)} className="flex-1 py-5 bg-gray-100 text-gray-500 font-black uppercase rounded-[24px]">Cancel</button>
                                    <button onClick={handleUpdateAnswer} disabled={isUpdatingAnswer} className="flex-[2] py-5 bg-black text-white font-black uppercase rounded-[24px] disabled:opacity-50">
                                        {isUpdatingAnswer ? 'Updating...' : 'Update Reply'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* DELETE ANSWER MODAL */}
            <AnimatePresence>
                {deletingAnswer && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeletingAnswer(null)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 40 }} className="relative bg-white rounded-[50px] p-12 max-w-md w-full shadow-2xl text-center">
                            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Trash2 size={40} />
                            </div>
                            <h2 className="text-2xl font-black mb-4 text-black">Delete Reply?</h2>
                            <p className="text-gray-500 mb-8 font-medium">This will permanently remove your contribution to the discussion.</p>
                            <div className="flex gap-4">
                                <button onClick={() => setDeletingAnswer(null)} className="flex-1 py-4 bg-gray-100 text-gray-500 font-bold rounded-2xl">Cancel</button>
                                <button onClick={handleDeleteAnswer} disabled={isDeletingAnswer} className="flex-1 py-4 bg-red-600 text-white font-bold rounded-2xl disabled:opacity-50">
                                    {isDeletingAnswer ? 'Deleting...' : 'Yes, Delete'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.main>
    )
}
