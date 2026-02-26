// app/auth/page.tsx

"use client"

import { useState } from "react"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { 
    Mail, Lock, User, Briefcase, GraduationCap, 
    ArrowRight, CheckCircle2, ChevronLeft, Sparkles, Building, Link as LinkIcon
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

type Role = "student" | "senior" | null;

export default function AuthPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [role, setRole] = useState<Role>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    const themeColor = role === "student" ? "#b4a9f8" : role === "senior" ? "#54E359" : "#0c0c0c";
    
    // === CINEMATIC, FULLY STAGGERED ANIMATIONS ===

    const explosiveStepVariants: Variants = {
        initial: { opacity: 0, scale: 0.85, y: 50, filter: "blur(20px)" },
        animate: { 
            opacity: 1, 
            scale: 1, 
            y: 0, 
            filter: "blur(0px)",
            transition: { 
                duration: 1.2, 
                type: "spring", 
                bounce: 0.35, 
                staggerChildren: 0.15, // Cascades every single child component individually!
                delayChildren: 0.2
            } 
        },
        exit: { 
            opacity: 0, 
            scale: 1.1, 
            filter: "blur(15px)",
            transition: { duration: 0.6, ease: "easeInOut" } 
        }
    };

    const popInVariants: Variants = {
        initial: { opacity: 0, y: 30, scale: 0.9 },
        animate: { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            transition: { type: "spring", bounce: 0.4, duration: 0.8 } 
        }
    };

    const handleVerify = () => {
        setIsVerifying(true);
        setTimeout(() => {
            setIsVerifying(false);
            setStep(3);
        }, 2000); 
    };

    const handleComplete = () => {
        if (role === "student") router.push('/student');
        if (role === "senior") router.push('/senior');
    };

    const stepLabels = ["Role", "Verify", "Basic", "Details"];

    return (
        <main className="min-h-screen bg-[#0f1113] p-4 flex items-center justify-center font-sans text-black overflow-hidden perspective-[1000px]">
            
            <motion.div 
                initial={{ opacity: 0, rotateX: 10, y: 100 }}
                animate={{ opacity: 1, rotateX: 0, y: 0 }}
                transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
                className="w-full max-w-2xl bg-white rounded-[50px] p-8 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative overflow-hidden flex flex-col min-h-[600px] border border-white/10"
            >
                {role && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 0.15, scale: 1 }}
                        transition={{ duration: 1.5, type: "spring" }}
                        className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl pointer-events-none"
                        style={{ backgroundColor: themeColor }}
                    />
                )}

                {/* === HEADER & PROGRESS BAR === */}
                <motion.div 
                    initial="initial"
                    animate="animate"
                    variants={{
                        initial: { opacity: 0 },
                        animate: { opacity: 1, transition: { staggerChildren: 0.3, duration: 1 } }
                    }}
                    className="w-full shrink-0 mb-10 z-10"
                >
                    <div className="flex justify-between items-center mb-12">
                        <motion.div variants={popInVariants}>
                            <Link href="/" className="flex items-center gap-3 w-fit cursor-pointer group">
                                <motion.div 
                                    whileHover={{ rotate: 180, scale: 1.1 }}
                                    transition={{ type: "spring", bounce: 0.5, duration: 1 }}
                                    className="w-10 h-10 bg-[#f5f5f5] rounded-full flex items-center justify-center shadow-inner"
                                >
                                    <Sparkles className="w-5 h-5 transition-colors duration-1000" style={{ color: themeColor }} />
                                </motion.div>
                                <span className="text-xl font-black tracking-tight">EduView</span>
                            </Link>
                        </motion.div>

                        <AnimatePresence>
                            {step > 1 && (
                                <motion.button 
                                    initial={{ opacity: 0, x: 20, filter: "blur(5px)" }}
                                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, x: 20, filter: "blur(5px)" }}
                                    transition={{ duration: 0.6 }}
                                    whileHover={{ x: -3 }}
                                    onClick={() => setStep(step - 1)} 
                                    className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-black uppercase tracking-wider transition-colors"
                                >
                                    <ChevronLeft size={16} /> Back
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Progress Bar */}
                    <motion.div variants={popInVariants} className="w-full relative pt-8">
                        <div className="w-full h-3 bg-[#f5f5f5] rounded-full relative overflow-visible shadow-inner">
                            <motion.div 
                                className="absolute top-0 left-0 h-full rounded-full relative"
                                style={{ backgroundColor: themeColor }}
                                initial={{ width: "0%" }} // STARTS FROM 0 NOW!
                                animate={{ width: `${(step / 4) * 100}%` }}
                                transition={{ 
                                    duration: 1.5, 
                                    // The "Hold and Thrust" Custom Easing Curve
                                    ease: [0.85, 0, 0.15, 1] 
                                }}
                            >
                                <div className="absolute top-0 right-0 w-10 h-full bg-white opacity-40 blur-sm rounded-full" />
                                <motion.div 
                                    className="absolute right-0 -top-10 translate-x-1/2 bg-black text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-xl whitespace-nowrap flex items-center gap-1 transition-colors duration-1000"
                                >
                                    Step {step}
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45 transition-colors duration-1000" />
                                </motion.div>
                            </motion.div>
                        </div>
                        
                        {/* === HIGHLIGHTED STEP LABELS === */}
                        <div className="flex justify-between mt-5 text-[10px] font-bold uppercase tracking-widest px-1">
                            {stepLabels.map((label, index) => {
                                const stepNumber = index + 1;
                                const isActive = step === stepNumber;
                                const isPast = step > stepNumber;
                                
                                return (
                                    <span 
                                        key={label}
                                        className={`transition-all duration-700 ease-out origin-top ${
                                            isActive ? "scale-110" : "scale-100"
                                        } ${isPast ? "text-gray-800" : "text-gray-300"}`}
                                        style={isActive ? { color: step === 1 ? '#0c0c0c' : themeColor } : {}}
                                    >
                                        {label}
                                    </span>
                                )
                            })}
                        </div>
                    </motion.div>
                </motion.div>

                {/* === DYNAMIC FORM CONTENT === */}
                <div className="flex-1 relative z-10 flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                        
                        {/* STEP 1: ROLE SELECTION */}
                        {step === 1 && (
                            <motion.div key="step1" variants={explosiveStepVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col gap-6">
                                
                                {/* Separated Title and Subtitle for Individual Pop-in */}
                                <div className="flex flex-col gap-2">
                                    <motion.h1 variants={popInVariants} className="text-4xl font-black text-gray-900">Join the Network</motion.h1>
                                    <motion.p variants={popInVariants} className="text-gray-500 font-medium text-sm">Select your portal to continue.</motion.p>
                                </div>

                                <div className="grid grid-cols-1 gap-4 mt-4">
                                    <motion.button 
                                        variants={popInVariants}
                                        whileHover={{ scale: 1.03, rotateZ: -1 }}
                                        whileTap={{ scale: 0.95, rotateZ: 0 }}
                                        onClick={() => { setRole("student"); setStep(2); }}
                                        className="p-6 rounded-[32px] border-2 border-gray-100 bg-white shadow-sm flex items-center gap-6 group transition-colors duration-500 hover:border-[#b4a9f8] hover:shadow-2xl text-left relative overflow-hidden"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-[#f9f8ff] flex items-center justify-center group-hover:bg-[#b4a9f8]/20 transition-colors duration-500 z-10">
                                            <GraduationCap className="w-7 h-7 text-[#b4a9f8]" />
                                        </div>
                                        <div className="flex-1 z-10">
                                            <h2 className="text-xl font-bold text-gray-900 mb-1">Student</h2>
                                            <p className="text-xs text-gray-500 font-semibold">Apply for drives & learn from seniors.</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-500 z-10">
                                            <ArrowRight size={18} />
                                        </div>
                                    </motion.button>

                                    <motion.button 
                                        variants={popInVariants}
                                        whileHover={{ scale: 1.03, rotateZ: 1 }}
                                        whileTap={{ scale: 0.95, rotateZ: 0 }}
                                        onClick={() => { setRole("senior"); setStep(2); }}
                                        className="p-6 rounded-[32px] border-2 border-gray-100 bg-white shadow-sm flex items-center gap-6 group transition-colors duration-500 hover:border-[#54E359] hover:shadow-2xl text-left"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-[#f4fdf4] flex items-center justify-center group-hover:bg-[#54E359]/20 transition-colors duration-500 z-10">
                                            <Briefcase className="w-7 h-7 text-[#54E359]" />
                                        </div>
                                        <div className="flex-1 z-10">
                                            <h2 className="text-xl font-bold text-gray-900 mb-1">Senior Alumni</h2>
                                            <p className="text-xs text-gray-500 font-semibold">Guide juniors & share experiences.</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-500 z-10">
                                            <ArrowRight size={18} />
                                        </div>
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 2: EMAIL & OTP */}
                        {step === 2 && (
                            <motion.div key="step2" variants={explosiveStepVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <motion.h2 variants={popInVariants} className="text-3xl font-black text-gray-900">Verify your email</motion.h2>
                                    <motion.p variants={popInVariants} className="text-gray-500 text-sm font-medium">We need to confirm you belong to the university network.</motion.p>
                                </div>

                                <div className="space-y-5 mt-2">
                                    <motion.div variants={popInVariants} className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">University Email</label>
                                        <div className="relative flex items-center group">
                                            <Mail className="absolute left-5 text-gray-400 w-5 h-5 group-focus-within:text-black transition-colors duration-500" />
                                            <input 
                                                type="email" 
                                                placeholder="name.year@vitapstudent.ac.in" 
                                                className="w-full bg-[#f9fafb] border-2 border-gray-100 rounded-[24px] py-4 pl-14 pr-4 outline-none focus:border-black focus:bg-white focus:shadow-lg transition-all duration-500 text-black font-semibold placeholder-gray-300"
                                            />
                                        </div>
                                    </motion.div>

                                    <AnimatePresence mode="wait">
                                        {!otpSent ? (
                                            <motion.button 
                                                key="send-otp"
                                                variants={popInVariants}
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.97 }}
                                                onClick={() => setOtpSent(true)}
                                                className="w-full py-4 rounded-[20px] font-bold text-white bg-black shadow-[0_10px_20px_rgba(0,0,0,0.2)] transition-transform duration-500"
                                            >
                                                Send Secure OTP
                                            </motion.button>
                                        ) : (
                                            <motion.div 
                                                key="verify-otp"
                                                variants={explosiveStepVariants}
                                                initial="initial"
                                                animate="animate"
                                                className="space-y-5 pt-2"
                                            >
                                                <motion.div variants={popInVariants} className="space-y-2">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Enter 6-Digit OTP</label>
                                                    <div className="relative flex items-center group">
                                                        <Lock className="absolute left-5 text-gray-400 w-5 h-5 group-focus-within:text-black transition-colors duration-500" />
                                                        <input 
                                                            type="text" 
                                                            maxLength={6}
                                                            placeholder="••••••" 
                                                            className="w-full bg-[#f9fafb] border-2 border-gray-100 rounded-[24px] py-4 pl-14 pr-4 outline-none focus:border-black focus:bg-white focus:shadow-lg transition-all duration-500 text-black tracking-[0.5em] font-mono text-xl font-bold"
                                                        />
                                                    </div>
                                                </motion.div>
                                                
                                                <motion.button 
                                                    variants={popInVariants}
                                                    whileHover={{ scale: 1.03 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    onClick={handleVerify}
                                                    disabled={isVerifying}
                                                    className="w-full py-4 rounded-[20px] font-bold text-black flex items-center justify-center gap-2 disabled:opacity-70 shadow-[0_10px_20px_rgba(0,0,0,0.1)] transition-all duration-500"
                                                    style={{ backgroundColor: themeColor }}
                                                >
                                                    {isVerifying ? (
                                                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-5 h-5 border-2 border-black border-t-transparent rounded-full" />
                                                    ) : (
                                                        <>Verify & Continue <ArrowRight size={18} /></>
                                                    )}
                                                </motion.button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: BASIC PROFILE */}
                        {step === 3 && (
                            <motion.div key="step3" variants={explosiveStepVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <motion.h2 variants={popInVariants} className="text-3xl font-black text-gray-900">Basic Details</motion.h2>
                                    <motion.p variants={popInVariants} className="text-gray-500 text-sm font-medium">Let's set up your {role} profile.</motion.p>
                                </div>

                                <div className="space-y-5 mt-2">
                                    <motion.div variants={popInVariants} className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Full Legal Name</label>
                                        <div className="relative flex items-center group">
                                            <User className="absolute left-5 text-gray-400 w-5 h-5 group-focus-within:text-black transition-colors duration-500" />
                                            <input type="text" placeholder="John" className="w-full bg-[#f9fafb] border-2 border-gray-100 rounded-[24px] py-4 pl-14 pr-4 outline-none focus:border-black focus:bg-white focus:shadow-lg transition-all duration-500 text-black font-semibold placeholder-gray-300" />
                                        </div>
                                    </motion.div>

                                    <motion.div variants={popInVariants} className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">University ID / Roll Number</label>
                                        <div className="relative flex items-center group">
                                            <Briefcase className="absolute left-5 text-gray-400 w-5 h-5 group-focus-within:text-black transition-colors duration-500" />
                                            <input type="text" placeholder="23BCE1234" className="w-full bg-[#f9fafb] border-2 border-gray-100 rounded-[24px] py-4 pl-14 pr-4 outline-none focus:border-black focus:bg-white focus:shadow-lg transition-all duration-500 text-black font-semibold uppercase placeholder-gray-300" />
                                        </div>
                                    </motion.div>

                                    <motion.button 
                                        variants={popInVariants}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => setStep(4)}
                                        className="w-full py-4 rounded-[20px] font-bold text-white bg-black mt-2 shadow-[0_10px_20px_rgba(0,0,0,0.2)] transition-transform duration-500"
                                    >
                                        Next Step
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 4: ROLE SPECIFIC DETAILS */}
                        {step === 4 && (
                            <motion.div key="step4" variants={explosiveStepVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <motion.h2 variants={popInVariants} className="text-3xl font-black text-gray-900">{role === 'student' ? 'Academic Stats' : 'Professional Info'}</motion.h2>
                                    <motion.p variants={popInVariants} className="text-gray-500 text-sm font-medium">Final step to customize your dashboard.</motion.p>
                                </div>

                                <div className="space-y-5 mt-2">
                                    {role === 'student' ? (
                                        <>
                                            <div className="grid grid-cols-2 gap-4">
                                                <motion.div variants={popInVariants} className="space-y-2">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Current CGPA</label>
                                                    <input type="text" placeholder="8.96" className="w-full bg-[#f9fafb] border-2 border-gray-100 rounded-[24px] py-4 px-5 outline-none focus:border-black focus:bg-white focus:shadow-lg transition-all duration-500 text-black font-semibold placeholder-gray-300" />
                                                </motion.div>
                                                <motion.div variants={popInVariants} className="space-y-2">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Graduation Year</label>
                                                    <input type="text" placeholder="2026" className="w-full bg-[#f9fafb] border-2 border-gray-100 rounded-[24px] py-4 px-5 outline-none focus:border-black focus:bg-white focus:shadow-lg transition-all duration-500 text-black font-semibold placeholder-gray-300" />
                                                </motion.div>
                                            </div>
                                            <motion.div variants={popInVariants} className="space-y-2">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Primary Domain</label>
                                                <select defaultValue="" className="w-full bg-[#f9fafb] border-2 border-gray-100 rounded-[24px] py-4 px-5 outline-none focus:border-black focus:bg-white focus:shadow-lg transition-all duration-500 text-black font-semibold appearance-none">
                                                    <option value="" disabled>Select Domain...</option>
                                                    <option value="sde">Software Engineering (SDE)</option>
                                                    <option value="data">Data Science & ML</option>
                                                    <option value="cloud">Cloud & DevOps</option>
                                                    <option value="core">Core Engineering</option>
                                                </select>
                                            </motion.div>
                                        </>
                                    ) : (
                                        <>
                                            <motion.div variants={popInVariants} className="space-y-2">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Current Company</label>
                                                <div className="relative flex items-center group">
                                                    <Building className="absolute left-5 text-gray-400 w-5 h-5 group-focus-within:text-black transition-colors duration-500" />
                                                    <input type="text" placeholder="e.g. Google, Amazon" className="w-full bg-[#f9fafb] border-2 border-gray-100 rounded-[24px] py-4 pl-14 pr-4 outline-none focus:border-black focus:bg-white focus:shadow-lg transition-all duration-500 text-black font-semibold placeholder-gray-300" />
                                                </div>
                                            </motion.div>
                                            <motion.div variants={popInVariants} className="space-y-2">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Job Title / Role</label>
                                                <input type="text" placeholder="e.g. SDE 1" className="w-full bg-[#f9fafb] border-2 border-gray-100 rounded-[24px] py-4 px-5 outline-none focus:border-black focus:bg-white focus:shadow-lg transition-all duration-500 text-black font-semibold placeholder-gray-300" />
                                            </motion.div>
                                            <motion.div variants={popInVariants} className="space-y-2">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">LinkedIn Profile URL</label>
                                                <div className="relative flex items-center group">
                                                    <LinkIcon className="absolute left-5 text-gray-400 w-5 h-5 group-focus-within:text-black transition-colors duration-500" />
                                                    <input type="url" placeholder="https://linkedin.com/in/..." className="w-full bg-[#f9fafb] border-2 border-gray-100 rounded-[24px] py-4 pl-14 pr-4 outline-none focus:border-black focus:bg-white focus:shadow-lg transition-all duration-500 text-black font-semibold placeholder-gray-300" />
                                                </div>
                                            </motion.div>
                                        </>
                                    )}

                                    <motion.button 
                                        variants={popInVariants}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={handleComplete}
                                        className="w-full py-4 rounded-[20px] font-bold text-black mt-4 flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(0,0,0,0.1)] transition-transform duration-500"
                                        style={{ backgroundColor: themeColor }}
                                    >
                                        <CheckCircle2 size={20} /> Complete Registration
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </motion.div>
        </main>
    )
}