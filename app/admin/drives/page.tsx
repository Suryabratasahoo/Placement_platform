// app/admin/drives/page.tsx

"use client"

import { motion } from "framer-motion"
import {
    ArrowRight,
    Briefcase,
    Calendar,
    Users,
    SlidersHorizontal,
    Plus,
    CheckCircle,
    Clock,
    Zap,
    Loader2,
    Trash2,
    AlertTriangle,
    X
} from "lucide-react"

import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import Link from "next/link"
import toast from "react-hot-toast"

export default function AdminDrivesPage() {

    const [activeStatus, setActiveStatus] = useState("All")
    const [drives, setDrives] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadDrives = async () => {
            try {
                const res = await fetch('/api/admin/drives');
                if (!res.ok) throw new Error("Network latency failed sequence");
                const data = await res.json();
                setDrives(data);
            } catch (error) {
                toast.error("Failed syncing Live DB Drives.");
            } finally {
                setIsLoading(false);
            }
        }
        loadDrives();
    }, [])

    const [driveToDelete, setDriveToDelete] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDeleteConfirm = async () => {
        if (!driveToDelete) return;
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/admin/drives/${driveToDelete}`, {
                method: "DELETE"
            });
            if (!res.ok) throw new Error("Failed to delete drive");
            
            toast.success("Drive permanently deleted.");
            setDrives(drives.filter(d => d._id !== driveToDelete));
            setDriveToDelete(null);
        } catch (error) {
            toast.error("Network constraint: Unable to delete drive.");
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white rounded-[40px] p-4 h-[100vh] overflow-hidden text-black"
        >

            {/* ================= LEFT (DRIVES MANAGEMENT) ================= */}
            <div className="lg:col-span-9 bg-[#f5f5f5] rounded-[50px] p-8 overflow-y-auto pb-40 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

                {/* Header Row */}
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-bold">Manage Drives</h2>

                    <Link href="/admin/postdrive">
                        <button className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition shadow-lg">
                            <Plus size={16} />
                            Post New Drive
                        </button>
                    </Link>
                </div>

                {/* GRID */}
                {isLoading ? (
                    <div className="w-full h-64 flex flex-col items-center justify-center text-gray-400 gap-4 mt-12">
                        <Loader2 className="animate-spin text-black" size={32} />
                        <span className="font-bold uppercase tracking-widest text-xs">Syncing DB Parameters...</span>
                    </div>
                ) : drives.length === 0 ? (
                    <div className="w-full h-64 flex flex-col items-center justify-center text-gray-400 gap-4 mt-12 bg-white rounded-[30px] border border-gray-100 shadow-sm">
                        <Briefcase size={32} />
                        <span className="font-bold uppercase tracking-widest text-xs text-black">No Active Drives Deployed</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                        {drives.map((drive, i) => {
                            // Dynamic Variables directly mapping native DB
                            const applicantsCount = Array.isArray(drive.applicants) ? drive.applicants.length : 0;
                            // Natively map DB status manually updated by Admin
                            const derivedStatus = drive.status || "Active";

                            // Optional filter logic
                            if (activeStatus !== "All" && activeStatus !== derivedStatus) return null;

                            return (
                                <motion.div
                                    key={drive._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="relative h-64 bg-[#0c0c0c] rounded-[40px] p-6 overflow-hidden shadow-xl group"
                                >

                                    {/* Decorative Scribble */}
                                    <svg className="absolute right-0 top-0 h-full opacity-20 transition-opacity group-hover:opacity-40" viewBox="0 0 200 200">
                                        <path
                                            fill="none"
                                            stroke="white"
                                            strokeWidth="1.5"
                                            d="M100,20 C150,50 50,150 180,180"
                                            strokeLinecap="round"
                                        />
                                    </svg>

                                    {/* Top Status */}
                                    <div className="flex justify-between relative z-10">
                                        <div className="w-10 h-10 bg-[#26282b] rounded-full border border-gray-600 flex items-center justify-center text-white">
                                            <Briefcase size={16} />
                                        </div>

                                        {/* Status Badge */}
                                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 h-fit
                                            ${derivedStatus === 'Active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                                'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}
                                        >
                                            {derivedStatus === 'Active' && <Zap size={10} />}
                                            {derivedStatus === 'Completed' && <CheckCircle size={10} />}
                                            {derivedStatus}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="relative z-10 mt-4 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <p className="text-orange-300 text-[10px] font-bold tracking-[0.18em] uppercase truncate">
                                                {drive.companyName}
                                            </p>
                                            {drive.placementType && (
                                                <span className="bg-[#FFA365]/20 text-[#FFA365] px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider">
                                                    {drive.placementType}
                                                </span>
                                            )}
                                        </div>

                                        <h2 className="text-white text-lg font-bold leading-snug truncate pr-4">
                                            {drive.role}
                                        </h2>

                                        <div className="text-white text-sm opacity-80 space-y-1 pt-1">
                                            <p className="flex items-center gap-1">
                                                <Calendar size={14} className="text-[#FFA365]" /> {drive.lastDate}
                                            </p>
                                            <p className="flex items-center gap-1">
                                                <Users size={14} className="text-[#FFA365]" /> {applicantsCount} Applicants
                                            </p>
                                        </div>
                                    </div>

                                    {/* Bottom CTA Action Layer */}
                                    <div className="flex gap-3 justify-end items-end relative z-10 mt-auto">
                                        
                                        {/* Delete Action (Red Match) */}
                                        <div 
                                            className="relative w-12 h-12 flex items-center justify-center group/del cursor-pointer z-20"
                                            onClick={(e) => { e.stopPropagation(); setDriveToDelete(drive._id); }}
                                        >
                                            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                                                <circle cx="50" cy="50" r="46" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" className="stroke-dasharray-[289] stroke-dashoffset-[289] transition-all duration-700 group-hover/del:stroke-dashoffset-0" />
                                            </svg>
                                            <button className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center transition group-hover/del:scale-105 group-hover/del:bg-red-500">
                                                <Trash2 className="w-4 h-4 text-red-500 group-hover/del:text-white transition-colors" />
                                            </button>
                                        </div>

                                        {/* Edit Action (Orange Match) */}
                                        <Link href={`/admin/drives/${drive._id}`} className="z-20">
                                            <div className="relative w-12 h-12 flex items-center justify-center group/btn cursor-pointer">
                                                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                                                    <circle cx="50" cy="50" r="46" fill="none" stroke="#FFA365" strokeWidth="3" strokeLinecap="round" className="stroke-dasharray-[289] stroke-dashoffset-[289] transition-all duration-700 group-hover/btn:stroke-dashoffset-0" />
                                                </svg>
                                                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center transition group-hover/btn:scale-105">
                                                    <ArrowRight className="w-4 h-4 text-black cursor-pointer" />
                                                </button>
                                            </div>
                                        </Link>
                                    </div>

                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </div>


            {/* ================= RIGHT PANEL ================= */}
            <div className="lg:col-span-3 flex flex-col gap-4 h-full overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-10">

                {/* Smart Filters */}
                <div className="bg-white rounded-[40px] p-6 shadow-sm border border-gray-50 space-y-5">
                    <h3 className="font-bold flex items-center gap-2">
                        <SlidersHorizontal size={16} /> Filters
                    </h3>

                    {/* Status Filter */}
                    <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase mb-2">Drive Status</p>
                        <div className="flex flex-wrap gap-2">
                            {["All", "Active", "Completed"].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setActiveStatus(s)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition
                                    ${activeStatus === s
                                            ? "bg-black text-white"
                                            : "bg-gray-100 hover:bg-black hover:text-white"
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="pt-4 border-t border-gray-100 space-y-3">
                        <p className="text-xs text-gray-400 font-semibold uppercase mb-2">Quick Stats</p>
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-gray-500">Total Drives</span>
                            <span>{drives.length}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-gray-500">Active</span>
                            <span className="text-green-500">{drives.filter(d => d.status === "Active").length}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-gray-500">Total Applicants</span>
                            <span>{drives.reduce((acc, obj) => acc + (Array.isArray(obj.applicants) ? obj.applicants.length : 0), 0)}</span>
                        </div>
                    </div>
                </div>

                {/* ===== MINI ANALYTICS GRAPH (Orange Style) ===== */}
                <div className="bg-[#FFA365] rounded-[45px] p-8 shadow-xl relative shrink-0 mt-auto">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#ffb988] rounded-full opacity-40 blur-2xl" />
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#ffd3b0] rounded-full opacity-40 blur-2xl" />

                    <h3 className="relative z-10 text-xl font-bold mb-8">
                        Weekly Apps
                    </h3>

                    <div className="relative z-10 flex items-end justify-between h-32 px-1">
                        {[
                            { day: 'Mon', h: 'h-16', val: 120 },
                            { day: 'Tue', h: 'h-8', val: 40 },
                            { day: 'Wed', h: 'h-24', val: 210, active: true },
                            { day: 'Thu', h: 'h-12', val: 80 },
                            { day: 'Fri', h: 'h-16', val: 142 }
                        ].map((bar) => (
                            <div key={bar.day} className="flex flex-col items-center gap-2">
                                <div
                                    className={`w-10 ${bar.h} rounded-full relative transition-all duration-300
                                    ${bar.active
                                            ? "bg-black text-white scale-110 shadow-xl"
                                            : "bg-[#dc7c0f] text-white opacity-90"
                                        }`}
                                >
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-tighter text-black mt-1">
                                    {bar.day}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* DELETE CONFIRMATION MODAL */}
            <AnimatePresence>
                {driveToDelete && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => !isDeleting && setDriveToDelete(null)}
                        />
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative bg-white rounded-[30px] p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center border border-gray-100"
                        >
                            <button 
                                onClick={() => !isDeleting && setDriveToDelete(null)}
                                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition"
                            >
                                <X size={18} />
                            </button>
                            
                            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6 border-4 border-red-100">
                                <AlertTriangle size={24} className="text-red-500" />
                            </div>
                            
                            <h2 className="text-2xl font-bold mb-2">Delete Drive?</h2>
                            <p className="text-gray-500 text-sm mb-8 px-4 leading-relaxed">
                                This action is permanent and cannot be undone. All data containing phase mappings and instruction pipelines will be immediately severed from the database.
                            </p>
                            
                            <div className="flex gap-3 w-full">
                                <button 
                                    onClick={() => setDriveToDelete(null)}
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