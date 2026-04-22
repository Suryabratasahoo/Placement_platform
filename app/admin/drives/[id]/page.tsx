"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Plus, Save, Building, Briefcase, GraduationCap, DollarSign, Calendar, Target, UploadCloud, CheckCircle, Loader2, ChevronDown, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import toast from "react-hot-toast"

interface Round {
    phaseNumber: number;
    roundName: string;
    roundDate: string;
    roundDescription?: string;
}

export default function EditDrivePage() {
    const router = useRouter();
    const params = useParams();
    const driveId = params.id as string;

    const [isLoadingInit, setIsLoadingInit] = useState(true);

    const [companyName, setCompanyName] = useState("")
    const [role, setRole] = useState("")
    const [cgpa, setCgpa] = useState("")
    const [ctc, setCtc] = useState("")
    const [lastDate, setLastDate] = useState("")
    const [placementType, setPlacementType] = useState("Dream")
    const [status, setStatus] = useState("Active")
    const [eligibleBranches, setEligibleBranches] = useState<string[]>([])
    const [portalLink, setPortalLink] = useState("")

    const standardBranches = ["CSE", "IT", "ECE", "EE", "ME", "CE", "EIE", "AI/ML", "Cyber", "Data Science"]

    const toggleBranch = (branch: string) => {
        setEligibleBranches(prev => 
            prev.includes(branch) ? prev.filter(b => b !== branch) : [...prev, branch]
        )
    }

    const selectAllBranches = () => setEligibleBranches(standardBranches)
    const clearBranches = () => setEligibleBranches([])

    // Actionable Instructions
    const [instructions, setInstructions] = useState<string[]>([])
    const [editingInstructionIdx, setEditingInstructionIdx] = useState<number | null>(null)
    const [instructionText, setInstructionText] = useState("")

    // Cloudinary URL State
    const [jdFile, setJdFile] = useState<{ url: string, fileName: string } | null>(null)
    const [isUploading, setIsUploading] = useState(false)

    // Rounds Builder Data
    const [rounds, setRounds] = useState<Round[]>([
        { phaseNumber: 1, roundName: "Initial Screening", roundDate: "", roundDescription: "" }
    ])
    const [activePhase, setActivePhase] = useState<number>(1)
    const [isSaving, setIsSaving] = useState(false)

    // Fetch initial drive data on mount
    useEffect(() => {
        const fetchDrive = async () => {
            try {
                const res = await fetch(`/api/admin/drives/${driveId}`);
                if (!res.ok) throw new Error("Missing sequence link");
                const data = await res.json();

                setCompanyName(data.companyName || "");
                setRole(Array.isArray(data.role) ? data.role.join(', ') : data.role || "");
                setCgpa(data.cgpa !== undefined ? data.cgpa.toString() : "");
                setCtc(data.ctc || "");
                setLastDate(data.lastDate || "");
                setPlacementType(data.placementType || "Dream");
                setStatus(data.status || "Active");
                setEligibleBranches(data.eligibleBranches || []);
                setPortalLink(data.portalLink || "");

                if (data.instructions && Array.isArray(data.instructions)) {
                    setInstructions(data.instructions);
                }

                if (data.jdUrl && data.jdFileName) {
                    setJdFile({ url: data.jdUrl, fileName: data.jdFileName });
                }

                if (data.rounds && data.rounds.length > 0) {
                    setRounds(data.rounds);
                }

            } catch (error) {
                toast.error("Failed to fetch designated drive block");
                router.push('/admin/drives');
            } finally {
                setIsLoadingInit(false);
            }
        };
        if (driveId) fetchDrive();
    }, [driveId, router]);


    const handleAddRound = () => {
        const newPhase = rounds.length + 1;
        setRounds([...rounds, { phaseNumber: newPhase, roundName: "New Phase", roundDate: "", roundDescription: "" }]);
        setActivePhase(newPhase);
    }

    const handleUpdateRound = (field: keyof Round, value: string) => {
        setRounds(rounds.map(r => r.phaseNumber === activePhase ? { ...r, [field]: value } : r));
    }

    const handleDeleteRound = (phaseNum: number) => {
        if (rounds.length === 1) return; // Must have at least 1 round
        const updated = rounds.filter(r => r.phaseNumber !== phaseNum).map((r, i) => ({ ...r, phaseNumber: i + 1 }));
        setRounds(updated);
        setActivePhase(Math.min(activePhase, updated.length));
    }

    const handleSaveInstruction = () => {
        if (!instructionText.trim()) return;
        if (editingInstructionIdx !== null && editingInstructionIdx >= 0) {
            const updated = [...instructions];
            updated[editingInstructionIdx] = instructionText;
            setInstructions(updated);
        } else {
            setInstructions([...instructions, instructionText]);
        }
        setInstructionText("");
        setEditingInstructionIdx(null);
    }

    const handleRemoveInstruction = () => {
        if (editingInstructionIdx !== null && editingInstructionIdx >= 0) {
            const updated = instructions.filter((_, idx) => idx !== editingInstructionIdx);
            setInstructions(updated);
            setInstructionText("");
            setEditingInstructionIdx(null);
            toast.success("Instruction removed.");
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            toast.error("Please upload a strict PDF document.");
            return;
        }

        try {
            setIsUploading(true);
            const _formData = new FormData();
            _formData.append('file', file);

            const res = await fetch('/api/upload', {
                method: "POST",
                body: _formData
            });
            const data = await res.json();

            if (data.url) {
                setJdFile({ url: data.url, fileName: file.name });
                toast.success("JD safely anchored via Cloudinary!");
            } else {
                toast.error(data.error || "Failed to route to Cloudinary.");
            }
        } catch (error: any) {
            toast.error("Network constraint: Unable to upload.");
        } finally {
            setIsUploading(false);
        }
    }

    const handleUpdateDrive = async () => {
        if (!companyName || !role || !cgpa || !ctc || !lastDate) {
            toast.error("Please fill out all standard fields");
            return;
        }

        const rolesArray = role.split(',').map(r => r.trim()).filter(Boolean);
        if (rolesArray.length === 0) {
            toast.error("Please provide at least one valid role");
            return;
        }

        const incompleteRounds = rounds.filter(r => !r.roundName || !r.roundDate);
        if (incompleteRounds.length > 0) {
            toast.error("Please provide names and dates for all rounds");
            return;
        }

        try {
            setIsSaving(true);
            const payload = {
                companyName,
                role: rolesArray,
                eligibleBranches,
                portalLink: portalLink || null,
                cgpa,
                ctc,
                placementType,
                status,
                lastDate,
                jdUrl: jdFile?.url || null,
                jdFileName: jdFile?.fileName || null,
                rounds,
                instructions
            };

            const res = await fetch(`/api/admin/drives/${driveId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to update drive");

            toast.success("Drive Successfully Updated!");
            router.push('/admin/drives');
        } catch (error: any) {
            toast.error(error.message || "An error occurred safely logging out the sequence.");
        } finally {
            setIsSaving(false);
        }
    }

    const currentRoundEditor = rounds.find(r => r.phaseNumber === activePhase);

    if (isLoadingInit) {
        return (
            <div className="flex items-center justify-center h-[100vh] bg-white rounded-[40px]">
                <Loader2 className="animate-spin text-black" size={48} />
            </div>
        )
    }

    return (
        <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col lg:grid lg:grid-cols-12 gap-4 bg-white rounded-[40px] p-4 text-black font-sans h-[100vh] overflow-hidden"
        >
            {/* ====== LEFT PANEL: STANDARD DETAILS ====== */}
            <div className="lg:col-span-4 bg-[#f5f5f5] rounded-[50px] p-8 flex flex-col gap-6 h-full overflow-y-auto pb-40">

                {/* Back Button & Title */}
                <div className="flex items-center gap-4 mb-4">
                    <Link href="/admin/drives">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition shadow-sm cursor-pointer border border-gray-100">
                            <ArrowLeft size={18} />
                        </div>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Drive</h1>
                    </div>
                </div>

                <div className="bg-white rounded-[35px] p-6 shadow-sm border border-gray-50 flex flex-col gap-5">
                    <h2 className="text-sm font-bold flex items-center gap-2 border-b border-gray-100 pb-3 uppercase tracking-wider text-gray-500">
                        <Target size={16} className="text-[#FFA365]" /> Core Parameters
                    </h2>

                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Company Name</label>
                            <div className="relative flex items-center group">
                                <Building className="absolute left-4 text-gray-400 w-5 h-5 group-focus-within:text-black transition-colors duration-300" />
                                <input
                                    type="text"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    placeholder="e.g. Google, Amazon"
                                    className="w-full bg-[#f9f9f9] border border-gray-200 rounded-[24px] py-3.5 pl-12 pr-4 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-300 text-black font-semibold placeholder-gray-300"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Designations / Roles (Comma Separated)</label>
                            <div className="relative flex items-center group">
                                <Briefcase className="absolute left-4 text-gray-400 w-5 h-5 group-focus-within:text-black transition-colors duration-300" />
                                <input
                                    type="text"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    placeholder="e.g. SDE1, AIML"
                                    className="w-full bg-[#f9f9f9] border border-gray-200 rounded-[24px] py-3.5 pl-12 pr-4 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-300 text-black font-semibold placeholder-gray-300"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Company Portal / Career Page Link (Optional)</label>
                            <div className="relative flex items-center group">
                                <Target className="absolute left-4 text-gray-400 w-5 h-5 group-focus-within:text-black transition-colors duration-300" />
                                <input
                                    type="url"
                                    value={portalLink}
                                    onChange={(e) => setPortalLink(e.target.value)}
                                    placeholder="https://careers.google.com/..."
                                    className="w-full bg-[#f9f9f9] border border-gray-200 rounded-[24px] py-3.5 pl-12 pr-4 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-300 text-black font-semibold placeholder-gray-300"
                                />
                            </div>
                        </div>

                        <div className="space-y-3 bg-[#f9f9f9] border border-gray-200 rounded-[24px] p-5">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Eligible Branches</label>
                                <div className="flex gap-2 text-xs font-bold">
                                    <button onClick={selectAllBranches} className="text-[#1783e1] hover:underline">Select All</button>
                                    <span className="text-gray-300">|</span>
                                    <button onClick={clearBranches} className="text-gray-400 hover:text-black">Clear</button>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {standardBranches.map(branch => (
                                    <button
                                        key={branch}
                                        onClick={() => toggleBranch(branch)}
                                        className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors ${
                                            eligibleBranches.includes(branch) 
                                                ? 'bg-black text-white border-black shadow-md' 
                                                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                                        }`}
                                    >
                                        {branch}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Min CGPA</label>
                                <div className="relative flex items-center group">
                                    <GraduationCap className="absolute left-4 text-gray-400 w-5 h-5 group-focus-within:text-black transition-colors" />
                                    <input
                                        type="number"
                                        value={cgpa}
                                        onChange={(e) => setCgpa(e.target.value)}
                                        placeholder="8.5"
                                        className="w-full bg-[#f9f9f9] border border-gray-200 rounded-[20px] py-3.5 pl-12 pr-3 outline-none focus:border-black transition-all text-black font-semibold placeholder-gray-300"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">CTC (LPA)</label>
                                <div className="relative flex items-center group">
                                    <DollarSign className="absolute left-4 text-gray-400 w-5 h-5 group-focus-within:text-black transition-colors" />
                                    <input
                                        type="text"
                                        value={ctc}
                                        onChange={(e) => setCtc(e.target.value)}
                                        placeholder="34"
                                        className="w-full bg-[#f9f9f9] border border-gray-200 rounded-[20px] py-3.5 pl-12 pr-3 outline-none focus:border-black transition-all text-black font-semibold placeholder-gray-300"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5 pt-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Last Date to Apply</label>
                            <div className="relative flex items-center group">
                                <Calendar className="absolute left-4 text-gray-400 w-5 h-5 group-focus-within:text-black transition-colors" />
                                <input
                                    type="date"
                                    value={lastDate}
                                    onChange={(e) => setLastDate(e.target.value)}
                                    className="w-full bg-[#f9f9f9] border border-gray-200 rounded-[24px] py-3.5 pl-12 pr-4 outline-none focus:border-black transition-all text-black font-semibold"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Placement Tier</label>
                                <div className="relative flex items-center group">
                                    <Target className="absolute left-4 text-gray-400 w-5 h-5 group-focus-within:text-black transition-colors pointer-events-none" />
                                    <select
                                        value={placementType}
                                        onChange={(e) => setPlacementType(e.target.value)}
                                        className="w-full bg-[#f9f9f9] border border-gray-200 rounded-[24px] py-3.5 pl-12 pr-12 outline-none focus:border-black hover:border-black/50 transition-all text-black font-semibold appearance-none cursor-pointer"
                                    >
                                        <option value="Dream">Dream</option>
                                        <option value="Superdream">Superdream</option>
                                        <option value="Marquee">Marquee</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 text-gray-400 w-5 h-5 pointer-events-none group-focus-within:text-black transition-colors" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Drive Status</label>
                                <div className="relative flex items-center group">
                                    <CheckCircle className="absolute left-4 text-gray-400 w-5 h-5 group-focus-within:text-black transition-colors pointer-events-none" />
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full bg-[#f9f9f9] border border-gray-200 rounded-[24px] py-3.5 pl-12 pr-12 outline-none focus:border-black hover:border-black/50 transition-all text-black font-semibold appearance-none cursor-pointer"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 text-gray-400 w-5 h-5 pointer-events-none group-focus-within:text-black transition-colors" />
                                </div>
                            </div>
                        </div>

                        {/* CLOUDINARY SECURE PDF UPLOADER */}
                        <div className="space-y-1.5 pt-4 border-t border-gray-100">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Job Description (PDF via Cloudinary)</label>

                            <div className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-[24px] transition-all duration-300
                                ${jdFile ? 'bg-green-50 border-green-200 hover:border-green-300' : 'bg-[#f9f9f9] border-gray-200 hover:border-black hover:bg-white'}
                            `}>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handleFileUpload}
                                    disabled={isUploading}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                                />

                                {isUploading ? (
                                    <div className="flex flex-col items-center gap-2 text-black">
                                        <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-black animate-spin mb-1"></div>
                                        <span className="text-xs font-bold text-center">Uploading to Cloudinary...</span>
                                    </div>
                                ) : jdFile ? (
                                    <div className="flex flex-col items-center gap-2 text-green-600">
                                        <CheckCircle size={28} />
                                        <span className="text-xs font-bold truncate max-w-[200px] text-center">{jdFile.fileName}</span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-green-600/60 mt-1 cursor-pointer hover:underline relative z-20" onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setJdFile(null);
                                        }}>Clear File</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-3 text-gray-400">
                                        <div className="w-12 h-12 bg-white rounded-full border border-gray-200 flex items-center justify-center shadow-sm">
                                            <UploadCloud size={20} className="text-black" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs font-bold text-black">Click or Drag to change JD</p>
                                            <p className="text-[10px] font-medium tracking-wide mt-1">PDF safely synced externally</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                {/* NEW ACTIONABLE INSTRUCTIONS BOX */}
                <div className="bg-white rounded-[35px] p-6 shadow-sm border border-gray-50 flex flex-col gap-5 mt-2">
                    <h2 className="text-sm font-bold flex items-center gap-2 border-b border-gray-100 pb-3 uppercase tracking-wider text-gray-500">
                        <AlertCircle size={16} className="text-[#FFA365]" /> Actionable Instructions
                    </h2>
                    
                    <div className="flex flex-wrap gap-2">
                        {instructions.map((inst, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => {
                                    setEditingInstructionIdx(idx);
                                    setInstructionText(inst);
                                }}
                                className="group relative bg-black text-white px-4 py-2 rounded-full text-xs font-bold cursor-pointer hover:bg-gray-800 transition shadow-md flex items-center gap-2"
                            >
                                <span>Instruction {idx + 1}</span>
                                {/* Tooltip for Hover */}
                                <div className="absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-black text-white text-[10px] font-medium leading-relaxed p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl text-center">
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-black"></div>
                                    {inst}
                                </div>
                            </div>
                        ))}
                    </div>

                    {editingInstructionIdx !== null ? (
                        <div className="p-4 bg-[#f9f9f9] border border-gray-200 rounded-[20px] flex flex-col gap-3">
                            <textarea
                                value={instructionText}
                                onChange={(e) => setInstructionText(e.target.value)}
                                placeholder="Write the instruction here..."
                                rows={2}
                                autoFocus
                                className="w-full bg-white border border-gray-200 rounded-[15px] py-3 px-4 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-black font-semibold placeholder-gray-300 resize-none text-sm"
                            />
                            <div className="flex justify-between items-center w-full pt-1">
                                {editingInstructionIdx !== null && editingInstructionIdx >= 0 ? (
                                    <button onClick={handleRemoveInstruction} className="px-3 py-1.5 text-red-500/80 hover:text-red-600 hover:bg-red-50 rounded-full text-[10px] font-bold uppercase tracking-wider transition">Remove Pill</button>
                                ) : <div />}
                                <div className="flex gap-2 text-xs font-bold">
                                    <button onClick={() => {setEditingInstructionIdx(null); setInstructionText("")}} className="px-4 py-2 text-gray-500 hover:text-black transition">Cancel</button>
                                    <button onClick={handleSaveInstruction} className="px-4 py-2 bg-black text-white rounded-full hover:scale-105 transition shadow-md">Save</button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <button 
                            onClick={() => setEditingInstructionIdx(-1)}
                            className="w-full py-4 border-2 border-dashed border-gray-200 rounded-[20px] text-gray-400 hover:text-black hover:border-black hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest"
                        >
                            <Plus size={14} /> Add Instruction
                        </button>
                    )}
                </div>

            </div>

            {/* ====== RIGHT PANEL: THE CHEVRON PHASE GRAPHIC BUILDER ====== */}
            <div className="lg:col-span-8 bg-white rounded-[50px] p-8 md:p-12 border border-gray-100 shadow-sm flex flex-col h-full overflow-y-auto pb-64">

                <div className="flex justify-between items-start mb-10">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight mb-2">Recruitment Pipeline</h2>
                        <p className="text-gray-400 text-sm font-semibold">Graphically edit the application phases.</p>
                    </div>

                    <button
                        onClick={handleUpdateDrive}
                        disabled={isSaving}
                        className="bg-black text-white px-8 py-3.5 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition shadow-lg disabled:opacity-50"
                    >
                        {isSaving ? <span className="animate-pulse">Updating...</span> : <><Save size={18} /> Update Drive</>}
                    </button>
                </div>

                {/* CHEVRON GRAPHIC BUILDER */}
                <div className="flex items-center flex-wrap gap-y-4 w-full relative mb-12">
                    {rounds.map((round, index) => {
                        const isFirst = index === 0;
                        return (
                            <div
                                key={round.phaseNumber}
                                onClick={() => setActivePhase(round.phaseNumber)}
                                className={`group relative h-[70px] min-w-[200px] flex items-center justify-center cursor-pointer transition-all duration-300
                                    ${index !== 0 ? '-ml-[25px]' : ''}
                                    ${activePhase === round.phaseNumber ? 'z-20 scale-[1.02]' : 'z-10 hover:z-30 hover:scale-[1.02]'}
                                `}
                                style={{
                                    clipPath: isFirst
                                        ? "polygon(calc(100% - 25px) 0, 100% 50%, calc(100% - 25px) 100%, 0 100%, 0 0)"
                                        : "polygon(calc(100% - 25px) 0, 100% 50%, calc(100% - 25px) 100%, 0 100%, 25px 50%, 0 0)",
                                }}
                            >
                                {/* Active State Background */}
                                <div className={`absolute inset-0 transition-colors duration-300
                                    ${activePhase === round.phaseNumber ? 'bg-black' : 'bg-gray-100'}
                                `} />

                                {/* Content inside Chevron */}
                                <div className={`relative z-10 flex flex-col items-center justify-center pl-4 ${isFirst ? 'pr-8' : 'pr-6 leading-tight'} ${activePhase === round.phaseNumber ? 'text-white' : 'text-gray-500'}`}>
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Phase {round.phaseNumber}</span>
                                    <span className="text-sm font-bold mt-0.5 text-center truncate max-w-[150px]">{round.roundName || "Unnamed Round"}</span>
                                </div>

                                {/* Custom Tooltip for Hover */}
                                {round.roundDescription && (
                                    <div className="absolute z-50 bottom-[80px] left-1/2 -translate-x-1/2 w-48 bg-black text-white text-[10px] font-medium leading-relaxed p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl text-center">
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-black"></div>
                                        {round.roundDescription}
                                    </div>
                                )}
                            </div>
                        )
                    })}

                    {/* BIGGER ADD BUTTON */}
                    <div
                        onClick={handleAddRound}
                        className={`relative h-[70px] min-w-[110px] -ml-[25px] flex items-center justify-center cursor-pointer z-0 hover:z-30 hover:scale-105 transition-all group`}
                        style={{ clipPath: "polygon(calc(100% - 25px) 0, 100% 50%, calc(100% - 25px) 100%, 0 100%, 25px 50%, 0 0)" }}
                    >
                        <div className="absolute inset-0 bg-gray-200 group-hover:bg-gray-300 transition-colors" />
                        <Plus className="relative z-10 text-gray-500 group-hover:text-black pl-6" size={20} />
                        <span className="relative z-10 text-[10px] font-bold uppercase tracking-wider text-gray-500 group-hover:text-black mt-0.5 ml-1.5">Add</span>
                    </div>
                </div>

                {/* PHASE CONFIGURATION PANEL */}
                <AnimatePresence mode="wait">
                    {currentRoundEditor && (
                        <motion.div
                            key={currentRoundEditor.phaseNumber}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-[#f5f5f5] rounded-[30px] p-8 border border-gray-100 mt-auto relative"
                        >
                            <div className="absolute top-0 left-0 w-2 h-full bg-black rounded-l-[30px]" />
                            <div className="flex justify-between items-center mb-6 pl-4">
                                <h3 className="text-2xl font-bold">Configure Phase {currentRoundEditor.phaseNumber}</h3>
                                {rounds.length > 1 && (
                                    <button
                                        onClick={() => handleDeleteRound(currentRoundEditor.phaseNumber)}
                                        className="text-red-500/70 hover:text-red-500 text-xs font-bold uppercase transition"
                                    >
                                        Remove Phase
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Round/Phase Title</label>
                                    <input
                                        type="text"
                                        value={currentRoundEditor.roundName}
                                        onChange={(e) => handleUpdateRound('roundName', e.target.value)}
                                        placeholder="e.g. Technical + Estimation"
                                        className="w-full bg-white border border-gray-200 rounded-[20px] py-4 px-5 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-black font-semibold placeholder-gray-300"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date / Timeframe</label>
                                    <input
                                        type="date"
                                        value={currentRoundEditor.roundDate}
                                        onChange={(e) => handleUpdateRound('roundDate', e.target.value)}
                                        className="w-full bg-white border border-gray-200 rounded-[20px] py-4 px-5 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-black font-semibold placeholder-gray-300"
                                    />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phase Description</label>
                                    <textarea
                                        value={currentRoundEditor.roundDescription || ""}
                                        onChange={(e) => handleUpdateRound('roundDescription', e.target.value)}
                                        placeholder="e.g. Candidates will face 2 DSA questions followed by CS core..."
                                        rows={3}
                                        className="w-full bg-white border border-gray-200 rounded-[20px] py-4 px-5 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-black font-semibold placeholder-gray-300 resize-none"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </motion.main>
    )
}
