// app/senior/experiences/new/page.tsx

"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Briefcase } from "lucide-react"
import { toast } from "react-hot-toast"
import { useUserStore } from "@/store/userStore"

export default function AddExperiencePage() {
    const router = useRouter()
    
    const userId = useUserStore((state) => state.userId)
    const name = useUserStore((state) => state.name)

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        company: "",
        role: "",
        difficulty: "Medium",
        rounds: 3,
        content: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!userId) {
            toast.error("You must be logged in to post.")
            return
        }

        if (!formData.company || !formData.role || !formData.content) {
            toast.error("Please fill out all fields.")
            return
        }

        setIsSubmitting(true)

        try {
            const payload = {
                ...formData,
                authorId: userId,
                authorName: name || "Senior Alumni"
            }

            const res = await fetch("/api/experiences", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            const data = await res.json()

            if (data.success) {
                toast.success("Experience published successfully!")
                router.push("/senior/experiences") // Send them back to the feed
            } else {
                throw new Error(data.error)
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to publish experience")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white rounded-[40px] p-4 h-[calc(100vh-100px)] overflow-hidden"
        >
            {/* LEFT PANEL (Context) */}
            <div className="lg:col-span-4 bg-[#0c0c0c] rounded-[35px] p-8 flex flex-col relative overflow-hidden shadow-2xl">
                <svg className="absolute right-0 top-10 h-3/4 opacity-20 pointer-events-none" viewBox="0 0 200 200">
                    <path fill="none" stroke="white" strokeWidth="1.5" d="M100,20 C150,50 50,150 180,180" strokeLinecap="round" />
                </svg>

                <button 
                    onClick={() => router.back()} 
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors w-fit text-sm font-semibold mb-8 relative z-10"
                >
                    <ArrowLeft size={16} /> Back
                </button>

                <div className="relative z-10 mt-10">
                    <div className="w-16 h-16 bg-[#26282b] rounded-full border border-gray-600 flex items-center justify-center text-[#FFB870] mb-6">
                        <Briefcase size={28} />
                    </div>
                    <h1 className="text-white text-4xl font-bold leading-tight mb-4">
                        Share Your <br/> Journey
                    </h1>
                    <p className="text-white/60 text-sm leading-relaxed">
                        Your interview experience is a goldmine for juniors. Break down the rounds, share the questions, and guide the next generation.
                    </p>
                </div>
            </div>

            {/* RIGHT PANEL (The Form) */}
            <div className="lg:col-span-8 bg-[#f5f5f5] rounded-[35px] p-8 flex flex-col overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
                    <h2 className="text-2xl font-bold text-black">New Experience</h2>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-grow">
                    
                    <div className="grid grid-cols-2 gap-6">
                        {/* Company */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Company</label>
                            <input 
                                type="text" name="company" value={formData.company} onChange={handleChange}
                                placeholder="e.g., Google, Amazon" required
                                className="bg-white border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition-colors"
                            />
                        </div>
                        {/* Role */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Role</label>
                            <input 
                                type="text" name="role" value={formData.role} onChange={handleChange}
                                placeholder="e.g., SDE Intern" required
                                className="bg-white border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Difficulty */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Difficulty</label>
                            <select 
                                name="difficulty" value={formData.difficulty} onChange={handleChange}
                                className="bg-white border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition-colors cursor-pointer appearance-none"
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>
                        {/* Rounds */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Total Rounds</label>
                            <input 
                                type="number" name="rounds" min="1" max="10" value={formData.rounds} onChange={handleChange}
                                className="bg-white border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition-colors"
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-2 flex-grow">
                        <label className="text-xs font-bold text-gray-500 uppercase">Detailed Experience</label>
                        <textarea 
                            name="content" value={formData.content} onChange={handleChange}
                            placeholder="Round 1: Online Assessment...&#10;Round 2: Technical Interview..." required
                            className="bg-white border border-gray-200 rounded-3xl px-6 py-5 outline-none focus:border-black transition-colors resize-none flex-grow min-h-[250px]"
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <button 
                            type="submit" disabled={isSubmitting}
                            className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {isSubmitting ? "Publishing..." : <><Save size={18} /> Publish Experience</>}
                        </button>
                    </div>
                </form>
            </div>
        </motion.main>
    )
}