// app/admin/announcements/page.tsx

"use client"

import { motion } from "framer-motion"
import {
    Megaphone,
    Send,
    Filter,
    BellRing,
    Clock,
    AlertCircle,
    CheckCircle2
} from "lucide-react"
import { useState } from "react"

export default function AdminAnnouncementsPage() {
    const [inputText, setInputText] = useState("")
    const [activeFilter, setActiveFilter] = useState("All")

    const announcements = [
        {
            title: "Google OA Link Active",
            message: "The Online Assessment link for Google SDE Intern has been mailed. Deadline is 11:59 PM tonight. Ensure stable internet.",
            time: "2 hours ago",
            type: "Urgent",
            readCount: 342
        },
        {
            title: "Amazon Pre-Placement Talk",
            message: "Mandatory PPT for all shortlisted students tomorrow at 10:00 AM in the Main Auditorium. Formals are strictly required.",
            time: "Yesterday",
            type: "Event",
            readCount: 415
        },
        {
            title: "TCS Ninja Results Declared",
            message: "Check your emails for the TCS Ninja selection status. Shortlisted candidates must update their portal by tomorrow.",
            time: "2 days ago",
            type: "Update",
            readCount: 489
        }
    ]

    return (
        <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white rounded-[40px] p-4 h-full overflow-hidden text-black"
        >

            {/* ================= LEFT (BROADCAST & FEED) ================= */}
            <div className="lg:col-span-9 bg-[#f5f5f5] rounded-[50px] p-8 flex flex-col overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

                <h2 className="text-3xl font-bold mb-8 shrink-0">Broadcast Announcements</h2>

                {/* COMPOSER CARD - Added shrink-0 right here! */}
                <div className="bg-[#0c0c0c] rounded-[40px] p-6 shadow-xl mb-10 relative overflow-hidden group shrink-0">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFA365] opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
                    
                    <div className="relative z-10 flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-[#26282b] rounded-full flex items-center justify-center text-[#FFA365]">
                            <Megaphone size={18} />
                        </div>
                        <h3 className="text-white font-bold text-lg">New Broadcast</h3>
                    </div>

                    <div className="relative z-10 bg-[#1a1a1a] rounded-[24px] p-3 flex flex-col gap-3 border border-gray-800 focus-within:border-gray-600 transition-colors">
                        <input 
                            placeholder="Announcement Title..." 
                            className="bg-transparent px-2 outline-none text-white font-bold text-lg placeholder-gray-500"
                        />
                        <textarea
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            placeholder="Type your message to the batch..."
                            rows={2}
                            className="bg-transparent px-2 resize-none outline-none text-sm text-gray-300 placeholder-gray-600"
                        />
                        <div className="flex justify-between items-center pt-2 border-t border-gray-800/50 mt-2">
                            <div className="flex gap-2 px-2">
                                <button className="text-xs font-bold text-gray-400 hover:text-[#FFA365] uppercase tracking-wider transition-colors">
                                    + Mark Urgent
                                </button>
                            </div>
                            <button className="h-10 px-6 bg-white rounded-full flex items-center justify-center gap-2 hover:scale-105 transition shadow-lg shadow-white/10 group/btn">
                                <span className="font-bold text-sm">Send</span>
                                <Send size={14} className="text-black group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ANNOUNCEMENTS FEED */}
                <div className="space-y-4 pb-10">
                    <div className="flex items-center justify-between mb-2 px-2 shrink-0">
                        <h3 className="font-bold text-gray-800">Recent Broadcasts</h3>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">History</span>
                    </div>

                    {announcements.map((ann, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden shrink-0"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    {ann.type === 'Urgent' ? (
                                        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                                            <AlertCircle size={18} />
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                            <BellRing size={18} />
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="font-bold text-lg text-gray-900 leading-none mb-1">{ann.title}</h4>
                                        <p className="text-xs text-gray-400 font-semibold flex items-center gap-1">
                                            <Clock size={12} /> {ann.time}
                                        </p>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider 
                                    ${ann.type === 'Urgent' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                                    {ann.type}
                                </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 leading-relaxed pl-13">
                                {ann.message}
                            </p>

                            <div className="mt-4 pl-13 flex items-center gap-2 text-xs font-bold text-gray-400">
                                <CheckCircle2 size={14} className="text-green-500" /> 
                                Seen by {ann.readCount} students
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* ================= RIGHT PANEL ================= */}
            <div className="lg:col-span-3 flex flex-col gap-4 h-full max-h-screen overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-8">

                {/* ===== SMART FILTERS ===== */}
                <div className="bg-white rounded-[40px] p-6 shadow-sm border border-gray-50 space-y-5 flex-shrink-0">
                    <h3 className="font-bold flex items-center gap-2">
                        <Filter size={16} /> Filter Feed
                    </h3>

                    <div className="flex flex-col gap-2">
                        {["All Messages", "Urgent Alerts", "Drive Updates", "General Events"].map((filter, idx) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`text-left px-4 py-3 rounded-2xl text-sm font-semibold transition 
                                    ${activeFilter === filter ? "bg-black text-white" : "text-gray-500 hover:bg-gray-50"}`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* STATS WIDGET */}
                <div className="bg-[#FFA365] rounded-[40px] p-6 shadow-xl relative overflow-hidden flex-shrink-0 text-black mt-auto">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
                    
                    <h3 className="relative z-10 text-lg font-bold mb-1">Batch Reach</h3>
                    <p className="relative z-10 text-xs font-semibold opacity-70 mb-4 uppercase tracking-wider">Average Read Rate</p>
                    
                    <div className="relative z-10 flex items-end gap-2">
                        <span className="text-5xl font-black tracking-tighter">84</span>
                        <span className="text-xl font-bold mb-1">%</span>
                    </div>
                </div>

            </div>
        </motion.main>
    )
}