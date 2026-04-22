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
    CheckCircle2,
    Loader2,
    Trash2, 
    Pencil, 
    X, 
    AlertTriangle, 
    Save, 
    XCircle
} from "lucide-react"
import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"

export default function AdminAnnouncementsPage() {
    const [title, setTitle] = useState("")
    const [message, setMessage] = useState("")
    const [type, setType] = useState("Drive Update")
    const [isUrgent, setIsUrgent] = useState(false)
    const [isSending, setIsSending] = useState(false)
    const [announcements, setAnnouncements] = useState<any[]>([])
    const [activeFilter, setActiveFilter] = useState("All Messages")

    // DELETE STATE
    const [announcementToDelete, setAnnouncementToDelete] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    // EDIT STATE
    const [editingAnnouncementId, setEditingAnnouncementId] = useState<string | null>(null)
    const [editTitle, setEditTitle] = useState("")
    const [editMessage, setEditMessage] = useState("")
    const [editType, setEditType] = useState("Drive Update")
    const [editIsUrgent, setEditIsUrgent] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)

    const fetchAnnouncements = async () => {
        try {
            const res = await fetch('/api/admin/announcements')
            if (!res.ok) throw new Error("Failed to fetch")
            setAnnouncements(await res.json())
        } catch(e) {
            toast.error("Failed to load broadcast history.")
        }
    }

    useEffect(() => {
        fetchAnnouncements()
    }, [])

    const handleDeleteConfirm = async () => {
        if (!announcementToDelete) return;
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/admin/announcements/${announcementToDelete}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Deletion failed");
            toast.success("Broadcast removed.");
            setAnnouncements(prev => prev.filter(a => a._id !== announcementToDelete));
            setAnnouncementToDelete(null);
        } catch {
            toast.error("Failed to delete broadcast.");
        } finally {
            setIsDeleting(false);
        }
    }

    const startEditing = (ann: any) => {
        setEditingAnnouncementId(ann._id);
        setEditTitle(ann.title);
        setEditMessage(ann.message);
        setEditType(ann.type);
        setEditIsUrgent(ann.isUrgent);
    }

    const cancelEditing = () => {
        setEditingAnnouncementId(null);
    }

    const handleUpdateAnnouncement = async () => {
        if (!editTitle.trim() || !editMessage.trim() || !editingAnnouncementId) return toast.error("Title and message are required.");
        setIsUpdating(true);
        try {
            const res = await fetch(`/api/admin/announcements/${editingAnnouncementId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: editTitle, message: editMessage, type: editType, isUrgent: editIsUrgent })
            });
            if (!res.ok) throw new Error("Update failed");
            toast.success("Broadcast updated.");
            setEditingAnnouncementId(null);
            fetchAnnouncements();
        } catch {
            toast.error("Network error updating broadcast.");
        } finally {
            setIsUpdating(false);
        }
    }

    const handleSendBroadcast = async () => {
        if (!title.trim() || !message.trim()) return toast.error("Title and message are required.");
        setIsSending(true);
        try {
            const res = await fetch('/api/admin/announcements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, message, type, isUrgent })
            });

            if (!res.ok) throw new Error("Failed to deploy");
            toast.success("Broadcast deployed!");
            setTitle("");
            setMessage("");
            setIsUrgent(false);
            fetchAnnouncements();
        } catch (error) {
            toast.error("Network error sending broadcast.");
        } finally {
            setIsSending(false);
        }
    }

    const filteredAnnouncements = announcements.filter(ann => {
        if (activeFilter === "All Messages") return true;
        if (activeFilter === "Urgent Alerts") return ann.isUrgent === true;
        if (activeFilter === "Drive Updates") return ann.type === "Drive Update";
        if (activeFilter === "General Events") return ann.type === "General Event";
        return true;
    });

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
                    
                    <div className="relative z-10 flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#26282b] rounded-full flex items-center justify-center text-[#FFA365]">
                                <Megaphone size={18} />
                            </div>
                            <h3 className="text-white font-bold text-lg">New Broadcast</h3>
                        </div>

                        {/* CAPSULES FRONTEND RADIO SELECTORS */}
                        <div className="flex gap-1 bg-[#1a1a1a] p-1.5 rounded-full border border-gray-800 shadow-inner">
                            <button 
                                onClick={() => setType('Drive Update')}
                                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${type === 'Drive Update' ? 'bg-[#FFA365] text-black shadow-md' : 'text-gray-500 hover:text-white hover:bg-gray-800'}`}
                            >
                                Drive Updates
                            </button>
                            <button 
                                onClick={() => setType('General Event')}
                                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${type === 'General Event' ? 'bg-[#FFA365] text-black shadow-md' : 'text-gray-500 hover:text-white hover:bg-gray-800'}`}
                            >
                                General Events
                            </button>
                        </div>
                    </div>

                    <div className="relative z-10 bg-[#1a1a1a] rounded-[24px] p-3 flex flex-col gap-3 border border-gray-800 focus-within:border-gray-600 transition-colors">
                        <input 
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Announcement Title..." 
                            className="bg-transparent px-2 outline-none text-white font-bold text-lg placeholder-gray-600"
                        />
                        <textarea
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            placeholder="Type your message to the batch..."
                            rows={2}
                            className="bg-transparent px-2 resize-none outline-none text-sm text-gray-300 placeholder-gray-600"
                        />
                        <div className="flex justify-between items-center pt-2 border-t border-gray-800/50 mt-2">
                            <div className="flex gap-2 px-2">
                                <button 
                                    onClick={() => setIsUrgent(!isUrgent)}
                                    className={`text-xs font-bold uppercase tracking-wider transition-colors border px-3 py-1.5 rounded-full ${isUrgent ? 'text-red-500 bg-red-500/10 border-red-500/20' : 'text-gray-400 border-transparent hover:text-[#FFA365] hover:bg-gray-800'}`}
                                >
                                    + Mark Urgent
                                </button>
                            </div>
                            <button 
                                onClick={handleSendBroadcast}
                                disabled={isSending}
                                className="h-10 px-6 bg-white rounded-full flex items-center justify-center gap-2 hover:scale-105 transition shadow-lg shadow-white/10 group/btn disabled:opacity-50"
                            >
                                {isSending ? <Loader2 size={14} className="text-black animate-spin" /> : (
                                    <>
                                        <span className="font-bold text-sm text-black">Send</span>
                                        <Send size={14} className="text-black group-hover/btn:translate-x-1 transition-transform" />
                                    </>
                                )}
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

                    {filteredAnnouncements.map((ann, i) => (
                        editingAnnouncementId === ann._id ? (
                            <motion.div
                                key={`edit-${ann._id}`}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-[#1a1a1a] rounded-[32px] p-6 shadow-2xl relative overflow-hidden shrink-0 border border-gray-800"
                            >
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
                                    <h3 className="text-white font-bold text-lg flex items-center gap-2"><Pencil size={16} className="text-[#FFA365]" /> Edit Broadcast</h3>
                                    <div className="flex gap-1 bg-[#26282b] p-1.5 rounded-full border border-gray-800 shadow-inner self-start md:self-auto">
                                        <button 
                                            onClick={() => setEditType('Drive Update')}
                                            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${editType === 'Drive Update' ? 'bg-[#FFA365] text-black shadow-md' : 'text-gray-500 hover:text-white hover:bg-gray-800'}`}
                                        >
                                            Drive Updates
                                        </button>
                                        <button 
                                            onClick={() => setEditType('General Event')}
                                            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${editType === 'General Event' ? 'bg-[#FFA365] text-black shadow-md' : 'text-gray-500 hover:text-white hover:bg-gray-800'}`}
                                        >
                                            General Events
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <input 
                                        value={editTitle}
                                        onChange={e => setEditTitle(e.target.value)}
                                        placeholder="Announcement Title..." 
                                        className="w-full bg-transparent border-b border-gray-700 px-2 py-2 outline-none text-white font-bold text-lg placeholder-gray-600 focus:border-[#FFA365] transition-colors"
                                    />
                                    <textarea
                                        value={editMessage}
                                        onChange={e => setEditMessage(e.target.value)}
                                        placeholder="Type your message to the batch..."
                                        rows={3}
                                        className="w-full bg-transparent px-2 py-3 mt-1 resize-none outline-none text-sm text-gray-300 placeholder-gray-600 border border-gray-800 rounded-[16px] focus:border-[#FFA365] transition-colors"
                                    />
                                </div>
                                <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-800/50">
                                    <button 
                                        onClick={() => setEditIsUrgent(!editIsUrgent)}
                                        className={`text-xs font-bold uppercase tracking-wider transition-colors border px-3 py-1.5 rounded-full ${editIsUrgent ? 'text-red-500 bg-red-500/10 border-red-500/20' : 'text-gray-400 border-transparent hover:text-[#FFA365] hover:bg-gray-800'}`}
                                    >
                                        + Mark Urgent
                                    </button>
                                    <div className="flex gap-2">
                                        <button onClick={cancelEditing} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white transition">Cancel</button>
                                        <button 
                                            onClick={handleUpdateAnnouncement}
                                            disabled={isUpdating}
                                            className="px-6 py-2 bg-[#FFA365] text-black font-bold text-sm rounded-full hover:scale-105 transition disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-[#FFA365]/20"
                                        >
                                            {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <><Save size={14} /> Update</>}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={ann._id || i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden shrink-0 group"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        {ann.isUrgent ? (
                                            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                                                <AlertCircle size={18} />
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-[#fce5d8] flex items-center justify-center text-[#ff802b]">
                                                <BellRing size={18} />
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="font-bold text-lg text-gray-900 leading-none mb-1">{ann.title}</h4>
                                            <p className="text-xs text-gray-400 font-semibold flex items-center gap-1">
                                                <Clock size={12} /> {new Date(ann.createdAt || Date.now()).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {ann.isUrgent && (
                                            <div className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-600">
                                                Urgent
                                            </div>
                                        )}
                                        <div className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600">
                                            {ann.type}
                                        </div>
                                    </div>
                                </div>
                                
                                <p className="text-sm text-gray-600 leading-relaxed pl-13">
                                    {ann.message}
                                </p>

                                <div className="mt-5 pl-13 flex items-center justify-between border-t border-gray-50 pt-4">
                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                        <CheckCircle2 size={14} className="text-green-500" /> 
                                        Seen by {ann.readCount || 0} students
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => startEditing(ann)}
                                            className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Pencil size={13} />
                                        </button>
                                        <button 
                                            onClick={() => setAnnouncementToDelete(ann._id)}
                                            className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )
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

            {/* DELETE CONFIRMATION MODAL */}
            <AnimatePresence>
                {announcementToDelete && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => !isDeleting && setAnnouncementToDelete(null)}
                        />
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative bg-white rounded-[30px] p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center border border-gray-100"
                        >
                            <button 
                                onClick={() => !isDeleting && setAnnouncementToDelete(null)}
                                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition"
                            >
                                <X size={18} />
                            </button>
                            
                            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6 border-4 border-red-100">
                                <AlertTriangle size={24} className="text-red-500" />
                            </div>
                            
                            <h2 className="text-2xl font-bold mb-2">Delete Broadcast?</h2>
                            <p className="text-gray-500 text-sm mb-8 px-4 leading-relaxed">
                                This action is permanent and cannot be undone. 
                            </p>
                            
                            <div className="flex gap-3 w-full">
                                <button 
                                    onClick={() => setAnnouncementToDelete(null)}
                                    disabled={isDeleting}
                                    className="flex-1 py-3.5 bg-gray-100 text-black font-bold rounded-[20px] hover:bg-gray-200 transition disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleDeleteConfirm}
                                    disabled={isDeleting}
                                    className="flex-1 py-3.5 bg-red-500 text-white font-bold rounded-[20px] hover:bg-red-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isDeleting ? <Loader2 size={16} className="animate-spin" /> : "Delete Forever"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </motion.main>
    )
}