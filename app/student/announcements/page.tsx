// app/student/announcements/page.tsx

"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
    Megaphone,
    Filter,
    BellRing,
    Clock,
    AlertCircle,
    CheckCircle2,
    Loader2,
    Calendar,
    ArrowRight,
    Search
} from "lucide-react"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"

export default function StudentAnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<any[]>([])
    const [filteredAnnouncements, setFilteredAnnouncements] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [activeFilter, setActiveFilter] = useState("All Messages")
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const res = await fetch('/api/student/announcements')
                if (!res.ok) throw new Error("Failed to fetch")
                const data = await res.json()
                setAnnouncements(data)
                setFilteredAnnouncements(data)
            } catch(e) {
                toast.error("Failed to load announcements.")
            } finally {
                setIsLoading(false)
            }
        }
        fetchAnnouncements()
    }, [])

    useEffect(() => {
        const filtered = announcements.filter(ann => {
            const matchesFilter = activeFilter === "All Messages" ||
                                (activeFilter === "Urgent Alerts" && ann.isUrgent) ||
                                (activeFilter === "Drive Updates" && ann.type === "Drive Update") ||
                                (activeFilter === "General Events" && ann.type === "General Event");
            
            const matchesSearch = ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 ann.message.toLowerCase().includes(searchQuery.toLowerCase());
            
            return matchesFilter && matchesSearch;
        });
        setFilteredAnnouncements(filtered);
    }, [activeFilter, searchQuery, announcements]);

    return (
        <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white rounded-[40px] p-4 text-black font-sans h-full overflow-hidden"
        >

            {/* ================= LEFT (BROADCAST FEED) ================= */}
            <div className="lg:col-span-9 bg-[#f5f5f5] rounded-[50px] p-8 flex flex-col overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 shrink-0">
                    <div>
                        <h2 className="text-4xl font-black tracking-tight mb-1">Announcements</h2>
                        <p className="text-gray-400 text-xs font-bold flex items-center gap-2 uppercase tracking-[0.2em]">
                            <Megaphone size={12} className="text-[#b4a9f8]" /> Latest Broadcasts from TPO
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative group md:w-80">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                        <input 
                            type="text"
                            placeholder="Search broadcasts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-full py-4 pl-14 pr-6 outline-none focus:border-black/10 transition-all font-semibold text-sm placeholder-gray-300 shadow-sm"
                        />
                    </div>
                </div>

                {/* FEED */}
                <div className="space-y-6 pb-20">
                    {isLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4 text-gray-400">
                             <Loader2 size={32} className="animate-spin text-[#b4a9f8]" />
                             <span className="text-[10px] font-black uppercase tracking-[0.3em]">Syncing Feed...</span>
                        </div>
                    ) : filteredAnnouncements.length > 0 ? (
                        filteredAnnouncements.map((ann, i) => (
                            <motion.div
                                key={ann._id || i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white rounded-[40px] p-8 border border-gray-100 hover:border-gray-200 transition-all relative overflow-hidden group cursor-default shadow-sm"
                            >
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                                    <div className="flex items-center gap-5">
                                        {ann.isUrgent ? (
                                            <div className="w-16 h-16 rounded-3xl bg-red-50 flex items-center justify-center text-red-500 border border-red-100 shadow-sm">
                                                <AlertCircle size={28} />
                                            </div>
                                        ) : (
                                            <div className="w-16 h-16 rounded-3xl bg-[#f5f3ff] flex items-center justify-center text-[#b4a9f8] border border-[#e2e0f7] shadow-sm">
                                                <BellRing size={28} />
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="font-bold text-2xl text-gray-900 tracking-tight leading-tight mb-2">{ann.title}</h4>
                                            <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(ann.createdAt).toLocaleDateString()}</span>
                                                <span className="w-1 h-1 bg-gray-200 rounded-full" />
                                                <span className="flex items-center gap-1.5"><Clock size={12} /> {new Date(ann.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        {ann.isUrgent && (
                                            <div className="px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest bg-red-500 text-white shadow-lg shadow-red-200">
                                                Urgent
                                            </div>
                                        )}
                                        <div className="px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest bg-gray-50 text-gray-400 border border-gray-100">
                                            {ann.type}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="md:pl-21">
                                    <p className="text-gray-600 text-lg leading-relaxed font-semibold">
                                        {ann.message}
                                    </p>
                                    
                                    <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-green-500 uppercase tracking-[0.2em]">
                                            <CheckCircle2 size={14} /> Verified Broadcast
                                        </div>
                                        <div className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">
                                            Official Placement Channel
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="py-32 flex flex-col items-center justify-center text-center px-6">
                            <div className="w-24 h-24 bg-white rounded-[40px] flex items-center justify-center mb-8 border border-gray-100 shadow-sm">
                                <Megaphone className="text-gray-200" size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Active Broadcasts</h3>
                            <p className="text-gray-400 text-sm font-medium max-w-sm">All placement cell alerts and drive updates will be displayed here in chronological order.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ================= RIGHT PANEL ================= */}
            <div className="lg:col-span-3 flex flex-col gap-4 h-full max-h-screen overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-8">

                 {/* FILTER CARD */}
                <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-50 flex-shrink-0">
                    <h3 className="text-sm font-bold flex items-center gap-3 mb-8 uppercase tracking-widest text-gray-400">
                        <Filter size={16} /> Filter Feed
                    </h3>

                    <div className="space-y-3">
                        {["All Messages", "Urgent Alerts", "Drive Updates", "General Events"].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`w-full text-left px-6 py-4 rounded-[24px] text-xs font-black transition-all flex items-center justify-between uppercase tracking-widest
                                    ${activeFilter === filter 
                                        ? "bg-black text-white shadow-xl scale-[1.02]" 
                                        : "text-gray-400 hover:text-black hover:bg-gray-50 border border-transparent"}`}
                            >
                                <span>{filter}</span>
                                {activeFilter === filter && <ArrowRight size={14} />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* HELP CARD */}
                <div className="bg-[#0c0c0c] rounded-[40px] p-8 shadow-xl mt-auto relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-white/10 transition-all" />
                    <AlertCircle className="text-[#FFA365] mb-6" size={28} />
                    <h4 className="text-white text-xl font-bold mb-2 leading-tight">Need Support?</h4>
                    <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest leading-relaxed mb-8">Contact the TPO office for urgent inquiries.</p>
                    <button className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-[20px] hover:scale-[1.02] transition shadow-lg text-[10px]">Help Center</button>
                </div>

            </div>
        </motion.main>
    )
}
