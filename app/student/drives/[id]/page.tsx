"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
    ArrowLeft,
    Briefcase,
    MapPin,
    IndianRupee,
    ExternalLink,
    Calendar,
    GraduationCap,
    Target,
    FileText,
    Download,
    AlertCircle,
    Building
} from "lucide-react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"
import { useUserStore } from "@/store/userStore"
import { CheckCircle2 } from "lucide-react"

interface Round {
    phaseNumber: number;
    roundName: string;
    roundDate: string;
    roundDescription?: string;
}

export default function StudentDriveDetailPage() {
    const params = useParams();
    const router = useRouter();
    const driveId = params.id as string;
    const { userId } = useUserStore();

    const [drive, setDrive] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [activePhase, setActivePhase] = useState<number>(1)
    
    // Application tracking states
    const [isApplying, setIsApplying] = useState(false)
    const [hasApplied, setHasApplied] = useState(false)

    const scrollToPhase = (phaseNumber: number) => {
        const element = document.getElementById(`phase-${phaseNumber}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    const formatPortalLink = (link: string) => {
        if (!link) return "#";
        if (link.startsWith("http://") || link.startsWith("https://")) return link;
        return `https://${link}`;
    }

    useEffect(() => {
        const fetchDrive = async () => {
            try {
                const res = await fetch(`/api/student/drives/${driveId}`)
                if (!res.ok) throw new Error("Drive details missing")
                const data = await res.json()
                setDrive(data)
                
                // Track Application state
                if (userId && data.applicants?.includes(userId)) {
                    setHasApplied(true);
                }

                if (data.rounds && data.rounds.length > 0) {
                    setActivePhase(data.rounds[0].phaseNumber)
                }
            } catch (error) {
                toast.error("Failed to fetch drive details.")
                router.push('/student/drives')
            } finally {
                setIsLoading(false)
            }
        }
        if (driveId) fetchDrive()
    }, [driveId, router, userId])

    const handleApply = async () => {
        if (!userId) return toast.error("Please login to apply");
        setIsApplying(true);
        try {
            const res = await fetch(`/api/student/drives/${driveId}/apply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });

            if (res.ok) {
                toast.success("Successfully applied! Track your status on your dashboard.");
                setHasApplied(true);
            } else {
                const err = await res.json();
                toast.error(err.message || "Failed to process application");
            }
        } catch (error) {
            toast.error("Application error.");
        } finally {
            setIsApplying(false);
        }
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center bg-white rounded-[40px]">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-10 h-10 border-4 border-black border-t-transparent rounded-full"
                />
            </div>
        )
    }

    if (!drive) return null;

    const currentRound = drive.rounds?.find((r: Round) => r.phaseNumber === activePhase);

    return (
        <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white rounded-[40px] p-4 h-full overflow-hidden text-black"
        >
            {/* ================= LEFT SIDEBAR (Overview) ================= */}
            <div className="lg:col-span-3 bg-[#0c0c0c] rounded-[40px] text-white flex flex-col shadow-xl overflow-hidden h-full">
                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <Link href="/student/drives">
                        <button className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100 mb-8 transition-opacity">
                            <ArrowLeft size={16} /> Back to Drives
                        </button>
                    </Link>

                    <div className="space-y-5">
                        <div className="flex flex-wrap gap-2">
                            {drive.role?.map((rl: string, i: number) => (
                                <span key={i} className="text-[#FFA365] text-[10px] font-black tracking-[0.18em] uppercase bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">{rl}</span>
                            ))}
                        </div>

                        <h2 className="text-3xl font-bold leading-tight">{drive.companyName}</h2>

                        <div className="pt-2 space-y-3">
                            <div className="flex items-center gap-3 text-sm font-semibold opacity-90">
                                <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10"><Target size={14} className="text-[#FFA365]" /></span>
                                <span>{drive.placementType} Opportunity</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm font-semibold opacity-90">
                                <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10"><IndianRupee size={14} className="text-[#FFA365]" /></span>
                                <span className="text-green-400">{drive.ctc} LPA</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm font-semibold opacity-90">
                                <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10"><Calendar size={14} className="text-[#FFA365]" /></span>
                                <span>Deadline: {new Date(drive.lastDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/10 space-y-4">
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest pl-1">Eligibility Criteria</p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-xs font-bold bg-white/5 p-3 rounded-2xl border border-white/5">
                                    <GraduationCap size={14} className="text-[#b4a9f8]" />
                                    <span>{drive.cgpa}+ CGPA Required</span>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {drive.eligibleBranches?.map((br: string) => (
                                        <span key={br} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold text-gray-300">{br}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fixed Footer for Portal Link */}
                <div className="p-6 bg-[#0c0c0c] border-t border-white/5">
                    <div className="relative rounded-[32px] overflow-hidden bg-[#FFA365] p-5 text-center shadow-lg group">
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-black/10 group-hover:bg-transparent transition-colors" />
                        <h2 className="text-lg font-black text-black mb-0.5 relative z-10">Application Ready?</h2>
                        <p className="text-black/60 text-[10px] font-bold uppercase tracking-wider mb-4 relative z-10">Apply to start tracking process</p>
                        
                        <div className="flex flex-col gap-2 relative z-20">
                            <button
                                onClick={handleApply}
                                disabled={hasApplied || isApplying}
                                className={`px-6 py-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all w-full 
                                    ${hasApplied 
                                        ? 'bg-black/10 text-black/60 shadow-none cursor-not-allowed' 
                                        : 'bg-black text-white hover:scale-105 shadow-xl cursor-pointer'
                                    }
                                `}
                            >
                                {isApplying ? 'Processing...' : hasApplied ? <span className="flex items-center gap-1.5"><CheckCircle2 size={16} /> Applied for Job</span> : 'Apply for Job'}
                            </button>

                            <a
                                href={formatPortalLink(drive.portalLink)}
                                target={drive.portalLink ? "_blank" : "_self"}
                                rel="noopener noreferrer"
                                onClick={(e) => {
                                    if (!drive.portalLink) {
                                        e.preventDefault();
                                        toast.error("Company portal link not provided.");
                                    }
                                }}
                                className={`bg-transparent border border-black/20 text-black px-6 py-2.5 rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-black/5 transition-colors w-full ${!drive.portalLink ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                Portal Link <ExternalLink size={12} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= RIGHT MAIN CONTENT ================= */}
            <div className="lg:col-span-9 bg-[#f9fafb] rounded-[50px] p-6 md:p-10 flex flex-col overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden border border-gray-100">

                {/* INSTRUCTIONS BOX */}
                <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 mb-8 shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />

                    <div className="flex justify-between items-start mb-6">
                        <h3 className="font-bold text-xl text-gray-900 flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#fef3eb] rounded-full flex items-center justify-center text-[#FFA365] border border-[#fef3eb]">
                                <AlertCircle size={20} />
                            </div>
                            Placement Instructions & JD
                        </h3>
                        {drive.jdUrl && (
                            <a
                                href={drive.jdUrl}
                                download={drive.jdFileName}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-black text-white px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-[#b4a9f8] hover:text-black transition-all shadow-md group"
                            >
                                <Download size={14} className="group-hover:translate-y-0.5 transition-transform" /> Download JD
                            </a>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {drive.instructions && drive.instructions.map((inst: string, i: number) => (
                            <div key={i} className="flex gap-3 bg-gray-50/50 p-4 rounded-3xl border border-gray-100">
                                <span className="w-6 h-6 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[10px] font-black shrink-0 text-[#FFA365]">{i + 1}</span>
                                <p className="text-sm text-gray-600 font-medium leading-relaxed">{inst}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-6 shrink-0 flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Recruitment Pipeline</h2>
                    <div className="h-[1px] flex-1 bg-gray-100" />
                </div>

                {/* CHEVRON READ-ONLY PIPELINE */}
                <div className="flex items-center flex-wrap gap-y-4 w-full relative mb-10 shrink-0">
                    {drive.rounds?.map((round: Round, index: number) => {
                        const isFirst = index === 0;
                        const isActive = activePhase === round.phaseNumber;
                        return (
                            <div
                                key={round.phaseNumber}
                                onClick={() => {
                                    setActivePhase(round.phaseNumber);
                                    scrollToPhase(round.phaseNumber);
                                }}
                                className={`group relative h-[65px] min-w-[200px] flex items-center justify-center cursor-pointer transition-all duration-300
                                    ${index !== 0 ? '-ml-[25px]' : ''}
                                    ${isActive ? 'z-20 scale-[1.05]' : 'z-10 hover:z-30 hover:scale-[1.02]'}
                                `}
                                style={{
                                    clipPath: isFirst
                                        ? "polygon(calc(100% - 25px) 0, 100% 50%, calc(100% - 25px) 100%, 0 100%, 0 0)"
                                        : "polygon(calc(100% - 25px) 0, 100% 50%, calc(100% - 25px) 100%, 0 100%, 25px 50%, 0 0)",
                                }}
                            >
                                <div className={`absolute inset-0 transition-colors duration-300
                                    ${isActive ? 'bg-[#b4a9f8]' : 'bg-white border border-gray-100'}
                                `} />

                                <div className={`relative z-10 flex flex-col items-center justify-center pl-6 ${isFirst ? 'pr-10' : 'pr-8'} ${isActive ? 'text-black' : 'text-gray-400'}`}>
                                    <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Phase {round.phaseNumber}</span>
                                    <span className="text-xs font-bold truncate max-w-[140px]">{round.roundName}</span>
                                </div>

                                {/* Custom Tooltip for Hover (Matches Admin Style) */}
                                {round.roundDescription && (
                                    <div className="absolute z-50 bottom-[75px] left-1/2 -translate-x-1/2 w-56 bg-black text-white text-[10px] font-medium leading-relaxed p-4 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl text-center border border-white/10">
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-black"></div>
                                        {round.roundDescription}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* ALL PHASES LIST VIEW */}
                <div className="space-y-8 pb-32">
                    {drive.rounds?.map((round: Round) => (
                        <motion.div
                            key={round.phaseNumber}
                            id={`phase-${round.phaseNumber}`}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5 }}
                            className={`bg-white rounded-[40px] p-10 border transition-all duration-500 relative overflow-hidden shadow-sm
                                ${activePhase === round.phaseNumber ? 'border-[#b4a9f8] shadow-md ring-1 ring-[#b4a9f8]/20' : 'border-gray-100'}
                            `}
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Building size={120} />
                            </div>
                            <div className="relative z-10">
                                <div className="flex flex-wrap items-center gap-4 mb-6">
                                    <h3 className="text-3xl font-black tracking-tight">{round.roundName}</h3>
                                    <span className={`px-4 py-1.5 text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-full transition-colors duration-300
                                        ${activePhase === round.phaseNumber ? 'bg-[#b4a9f8]' : 'bg-gray-100'}
                                    `}>
                                        Phase {round.phaseNumber}
                                    </span>
                                </div>
                                
                                <div className="flex items-center gap-2 text-sm font-bold text-[#FFA365] mb-8 bg-[#fef3eb] w-fit px-4 py-2 rounded-2xl border border-[#fef3eb]/50">
                                    <Calendar size={16} /> Scheduled: {new Date(round.roundDate).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>

                                <div className="p-6 bg-gray-50/50 rounded-3xl border border-dotted border-gray-200">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Round Details & Strategy</p>
                                    <p className="text-gray-700 text-sm md:text-base leading-loose font-semibold whitespace-pre-wrap">
                                        {round.roundDescription || "Detailed instructions and preparation strategies for this recruitment round will be updated by the placement cell shortly."}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="h-20 shrink-0" />
            </div>
        </motion.main>
    )
}
