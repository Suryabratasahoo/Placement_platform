// /app/senior/experiences/particularExperience/page.tsx

"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft, Briefcase, Calendar, Star, ThumbsUp } from "lucide-react"
import { toast } from "react-hot-toast"
import { useUserStore } from "@/store/userStore"

export default function ParticularExperiencePage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const id = searchParams.get("id")

    const userId = useUserStore((state) => state.userId)
    
    const [experienceData, setExperienceData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!id) return

        fetch(`/api/experiences/${id}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setExperienceData(data.data)
                } else {
                    toast.error("Failed to load experience")
                }
                setLoading(false)
            })
            .catch((err) => {
                console.error("Error fetching data:", err)
                setLoading(false)
            })
    }, [id])

    // Helper to format the creation date
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
        });
    }

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center text-white min-h-[500px]">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full" />
            </div>
        )
    }

    if (!experienceData) {
        return <div className="text-white p-8">Experience not found. Return to dashboard.</div>
    }

    return (
        <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white rounded-[40px] p-4 h-[calc(100vh-100px)] overflow-hidden"
        >
            {/* ================= LEFT PANEL (Meta Data) ================= */}
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
                        {experienceData.company}
                    </p>
                    <h1 className="text-white text-3xl font-bold leading-tight mb-6">
                        {experienceData.role}
                    </h1>
                    
                    <div className="flex flex-col gap-3 text-white/80 font-semibold text-sm mb-8">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-[#FFB870]" /> 
                            {formatDate(experienceData.createdAt)}
                        </div>
                        <div className="flex items-center gap-2">
                            <Briefcase size={16} className="text-[#FFB870]" /> 
                            {experienceData.rounds} Rounds • {experienceData.difficulty}
                        </div>
                        <div className="flex items-center gap-2">
                            <Star size={16} className="text-[#FFB870]" /> 
                            {experienceData.helpfulVotes?.length || 0} found this helpful
                        </div>
                    </div>
                </div>

                <div className="mt-auto relative z-10">
                    {/* Author Badge */}
                    <div className="bg-white/5 border border-white/10 rounded-[20px] p-4 backdrop-blur-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#8b5cf6] flex items-center justify-center text-white font-bold text-lg shadow-sm">
    {experienceData.authorName ? experienceData.authorName.charAt(0).toUpperCase() : 'U'}
</div>
<div className="flex flex-col">
    <span className="text-white font-bold text-sm">
        {experienceData.authorName || "Anonymous"}
    </span>
                            <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">
                                COMMUNITY CONTRIBUTOR
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= RIGHT PANEL (The Full Story) ================= */}
            <div className="lg:col-span-8 bg-[#f5f5f5] rounded-[35px] p-8 flex flex-col overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                
                <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4 relative z-20">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-bold text-black leading-none">The Journey</h2>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            DETAILED EXPERIENCE
                        </span>
                    </div>
                </div>

                <div className="relative z-10 bg-white rounded-[24px] p-8 shadow-sm border border-gray-100">
                    {/* We split by \n so paragraphs render with proper spacing instead of a giant wall of text */}
                    {experienceData.content.split('\n').map((paragraph: string, idx: number) => (
                        <p key={idx} className="text-gray-700 text-base leading-relaxed mb-4">
                            {paragraph}
                        </p>
                    ))}
                </div>
                
            </div>
        </motion.main>
    )
}