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
import { useEffect } from "react"
import Fuse from "fuse.js"
import { toast } from "react-hot-toast"
import { useUserStore } from "@/store/userStore"
import Cookies from "js-cookie"


type Role = "student" | "senior" | null;

export default function AuthPage() {
    const router = useRouter();
    const setAuth = useUserStore((state: any) => state.setAuth);
    const [step, setStep] = useState(1);
    const [role, setRole] = useState<Role>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [placementGoal, setPlacementGoal] = useState<string>("");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [signupToken, setSignupToken] = useState("");

    // New Fields
    const [branch, setBranch] = useState("");
    const [yearOfStudy, setYearOfStudy] = useState("");
    const [receivedOffer, setReceivedOffer] = useState<"yes" | "no" | null>(null);
    const [companySearch, setCompanySearch] = useState("");
    const [selectedCompany, setSelectedCompany] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Form fields state
    const [fullName, setFullName] = useState("");
    const [universityId, setUniversityId] = useState("");
    const [cgpa, setCgpa] = useState("");
    const [gradYear, setGradYear] = useState("");
    const [domain, setDomain] = useState("");
    const [currentCompany, setCurrentCompany] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [linkedIn, setLinkedIn] = useState("");
    const [experienceText, setExperienceText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const themeColor = role === "student" ? "#d4af37" : role === "senior" ? "#bca33e" : "#d4af37";

    // === CINEMATIC, FULLY STAGGERED ANIMATIONS ===

    const skillsOptions = ["DSA", "System Design", "OS", "DBMS", "HR Prep"];
    const goalOptions = ["Dream", "Any", "Core"];

    // Dummy companies for Fuse search
    const companiesList = [
        "Google", "Microsoft", "Amazon", "Apple", "Meta",
        "Netflix", "Oracle", "IBM", "Intel", "Cisco",
        "TCS", "Infosys", "Wipro", "HCL", "Tech Mahindra",
        "Cognizant", "Accenture", "Capgemini", "Deloitte", "PwC"
    ];

    const fuse = new Fuse(companiesList, {
        threshold: 0.3,
    });

    const searchResults = companySearch ? fuse.search(companySearch).map(r => r.item) : companiesList.slice(0, 5);

    const explosiveStepVariants: Variants = {
        initial: { opacity: 0, scale: 0.85, y: 50, filter: "blur(20px)" },
        animate: {
            opacity: 1,
            scale: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                duration: 1.2,
                ease: "easeOut",
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
            transition: { ease: "easeOut", duration: 0.8 }
        }
    };

    const handleSendOtp = async () => {
        if (!email.trim()) {
            toast.error("Please enter your university email.");
            return;
        }
        try {
            setIsSendingOtp(true)
            const res = await fetch('/api/auth/send-otp', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Failed to send OTP");
            }
            setOtpSent(true)
            setTimeLeft(300); // Reset timer to 5 minutes on successful send
            toast.success("Check your mail for the OTP");
        } catch (err: any) {
            toast.error(err.message || "Failed to send OTP. Please try again.");
        } finally {
            setIsSendingOtp(false)
        }
    };

    // --- Countdown Timer Effect ---
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (otpSent && timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [otpSent, timeLeft]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleVerify = async () => {
        try {
            setIsVerifying(true);

            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    otp
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            }
            setSignupToken(data.signupToken);

            // ✅ OTP verified successfully
            setStep(3);

        } catch (error: any) {
            toast.error("Incorrect password try again");
        } finally {
            setIsVerifying(false);
        }
    };

    const handleStep3Next = () => {
        if (!fullName.trim() || !universityId.trim()) {
            toast.error("Please fill in all basic details.");
            return;
        }
        if (role === "student" && (!branch || !yearOfStudy)) {
            toast.error("Please select your branch and year of study.");
            return;
        }
        setStep(4);
    };

    const handleStep4Next = () => {
        if (role === "student") {
            if (!cgpa.trim() || !gradYear.trim() || !domain || !receivedOffer) {
                toast.error("Please fill in all academic stats.");
                return;
            }
            if (receivedOffer === "yes" && !selectedCompany.trim() && !companySearch.trim()) {
                toast.error("Please specify the company name.");
                return;
            }
        } else if (role === "senior") {
            if (!currentCompany.trim() || !jobTitle.trim() || !linkedIn.trim()) {
                toast.error("Please fill in all professional info.");
                return;
            }
        }
        setStep(5);
    };

    const handleComplete = async () => {
        if (role === "student") {
            if (selectedSkills.length === 0 || !placementGoal) {
                toast.error("Please select your skills and placement goal.");
                return;
            }
        } else if (role === "senior") {
            if (!experienceText.trim()) {
                toast.error("Please share your experience.");
                return;
            }
        }

        try {
            setIsSubmitting(true);

            // Build the payload
            const payload: any = {
                role,
                fullName,
                universityId,
            };

            if (role === "student") {
                payload.branch = branch;
                payload.yearOfStudy = parseInt(yearOfStudy);
                payload.cgpa = parseFloat(cgpa);
                payload.gradYear = parseInt(gradYear);
                payload.domain = domain;
                payload.receivedOffer = receivedOffer==="yes";
                if (receivedOffer === "yes") payload.companyName = selectedCompany || companySearch;
                payload.skills = selectedSkills;
                payload.placementGoal = placementGoal;
            } else if (role === "senior") {
                payload.currentCompany = currentCompany;
                payload.jobTitle = jobTitle;
                payload.linkedInUrl = linkedIn;
                payload.experienceText = experienceText;
            }

            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json",Authorization:`Bearer ${signupToken}` },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to complete registration");
            }

            toast.success("Profile created successfully!");

            // 1. Store in Cookies for Middleware (Edge support)
            Cookies.set("token", data.token, { expires: 7 });

            // 2. Sync with Zustand Store for Global State
            setAuth({
                userId: data.user.id,
                name: data.user.fullName,
                email: data.user.email,
                role: data.user.role,
                universityId: data.user.universityId
            });

            // 3. Fallback for legacy components
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            if (role === "student") router.push('/student');
            if (role === "senior") router.push('/senior');

        } catch (error: any) {
            toast.error(error.message || "An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const stepLabels = ["Role", "Verify", "Basic", "Details", "Prefs"];

    return (
        <main className="min-h-screen bg-[#0f1113] p-4 flex items-center justify-center font-sans text-black overflow-hidden perspective-[1000px]">

            <motion.div
                initial={{ opacity: 0, rotateX: 10, y: 100 }}
                animate={{ opacity: 1, rotateX: 0, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="w-full max-w-2xl bg-[#121212]/90 backdrop-blur-2xl rounded-[50px] p-8 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col min-h-[600px] border border-white/10"
            >
                {role && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 0.15, scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
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
                            <Link href="/" className="flex items-center gap-3 w-fit cursor-pointer">
                                <div
                                    className="w-10 h-10 bg-white/10 border border-white/20 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                                >
                                    <Sparkles className="w-5 h-5 text-[#d4af37]" />
                                </div>
                                <span className="text-xl font-serif font-black tracking-tight text-white">EduView.</span>
                            </Link>
                        </motion.div>

                        <AnimatePresence>
                            {step > 1 && (
                                <motion.button
                                    initial={{ opacity: 0, x: 20, filter: "blur(5px)" }}
                                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, x: 20, filter: "blur(5px)" }}
                                    transition={{ duration: 0.6 }}
                                    onClick={() => setStep(step - 1)}
                                    className="flex items-center gap-1 text-xs font-bold text-white/40 uppercase tracking-wider"
                                >
                                    <ChevronLeft size={16} /> Back
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Progress Bar */}
                    <motion.div variants={popInVariants} className="w-full relative pt-8">
                        <div className="w-full h-3 bg-white/5 border border-white/5 rounded-full relative overflow-visible">
                            <motion.div
                                className="absolute top-0 left-0 h-full rounded-full relative"
                                style={{ backgroundColor: themeColor }}
                                initial={{ width: "0%" }} // STARTS FROM 0 NOW!
                                animate={{ width: `${(step / 5) * 100}%` }}
                                transition={{
                                    duration: 1.5,
                                    // The "Hold and Thrust" Custom Easing Curve
                                    ease: [0.85, 0, 0.15, 1]
                                }}
                            >
                                <div className="absolute top-0 right-0 w-10 h-full bg-white opacity-40 blur-sm rounded-full" />
                                <motion.div
                                    className="absolute right-0 -top-10 translate-x-1/2 bg-white text-black text-[10px] font-bold px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.4)] whitespace-nowrap flex items-center gap-1 transition-colors duration-1000"
                                >
                                    Step {step}
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 transition-colors duration-1000" />
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
                                        className={`transition-all duration-700 ease-out origin-top ${isActive ? "scale-110" : "scale-100"
                                            } ${isPast ? "text-white" : "text-white/20"}`}
                                        style={isActive ? { color: themeColor } : {}}
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
                                    <motion.h1 variants={popInVariants} className="text-4xl font-serif font-black text-white tracking-tight">Join the Network</motion.h1>
                                    <motion.p variants={popInVariants} className="text-white/50 font-medium text-sm">Select your portal to continue.</motion.p>
                                </div>

                                <div className="grid grid-cols-1 gap-4 mt-4">
                                    <motion.button
                                        variants={popInVariants}
                                        onClick={() => { setRole("student"); setStep(2); }}
                                        className="p-6 rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-sm flex items-center gap-6 group transition-all duration-500 hover:border-[#d4af37] hover:shadow-[0_10px_30px_rgba(212,175,55,0.15)] hover:bg-[#d4af37]/5 text-left relative overflow-hidden"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#d4af37]/20 group-hover:border-[#d4af37]/50 transition-colors duration-500 z-10">
                                            <GraduationCap className="w-7 h-7 text-white/70 group-hover:text-[#d4af37] transition-colors" />
                                        </div>
                                        <div className="flex-1 z-10">
                                            <h2 className="text-xl font-bold text-white mb-1">Student</h2>
                                            <p className="text-xs text-white/50 font-medium">Apply for drives & learn from seniors.</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#d4af37] group-hover:text-black text-white/50 transition-colors duration-500 z-10">
                                            <ArrowRight size={18} />
                                        </div>
                                    </motion.button>

                                    <motion.button
                                        variants={popInVariants}
                                        onClick={() => { setRole("senior"); setStep(2); }}
                                        className="p-6 rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-sm flex items-center gap-6 group transition-all duration-500 hover:border-[#bca33e] hover:shadow-[0_10px_30px_rgba(188,163,62,0.15)] hover:bg-[#bca33e]/5 text-left"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#bca33e]/20 group-hover:border-[#bca33e]/50 transition-colors duration-500 z-10">
                                            <Briefcase className="w-7 h-7 text-white/70 group-hover:text-[#bca33e] transition-colors" />
                                        </div>
                                        <div className="flex-1 z-10">
                                            <h2 className="text-xl font-bold text-white mb-1">Senior Alumni</h2>
                                            <p className="text-xs text-white/50 font-medium">Guide juniors & share experiences.</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#bca33e] group-hover:text-black text-white/50 transition-colors duration-500 z-10">
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
                                    <motion.h2 variants={popInVariants} className="text-3xl font-serif font-black text-white">Verify your email</motion.h2>
                                    <motion.p variants={popInVariants} className="text-white/50 text-sm font-medium">We need to confirm you belong to the university network.</motion.p>
                                </div>

                                <div className="space-y-5 mt-2">
                                    <motion.div variants={popInVariants} className="space-y-2">
                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-2">University Email</label>
                                        <div className="relative flex items-center group">
                                            <Mail className="absolute left-5 text-white/30 w-5 h-5 group-focus-within:text-[#d4af37] transition-colors duration-500" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                placeholder="name.year@vitapstudent.ac.in"
                                                className="w-full bg-[#0a0a0a] border border-white/10 rounded-[24px] py-4 pl-14 pr-4 outline-none focus:border-[#d4af37] focus:shadow-[0_0_20px_rgba(212,175,55,0.1)] transition-all duration-500 text-white font-medium placeholder-white/20"
                                            />
                                        </div>
                                    </motion.div>

                                    <AnimatePresence mode="wait">
                                        {!otpSent ? (
                                            <motion.button
                                                key="send-otp"
                                                variants={popInVariants}
                                                onClick={handleSendOtp}
                                                disabled={isSendingOtp}
                                                className="w-full py-4 rounded-[20px] font-bold text-black bg-gradient-to-r from-[#d4af37] to-[#bca33e] shadow-[0_10px_30px_rgba(212,175,55,0.2)] disabled:opacity-70 flex items-center justify-center gap-2"
                                            >
                                                {isSendingOtp ? (
                                                    <>
                                                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-5 h-5 border-2 border-black border-t-transparent rounded-full" />
                                                        Sending OTP...
                                                    </>
                                                ) : (
                                                    "Send Secure OTP"
                                                )}
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
                                                    <div className="flex justify-between items-end px-2">
                                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Enter 6-Digit OTP</label>
                                                        <span className={`text-xs font-bold ${timeLeft > 0 ? "text-[#d4af37]" : "text-red-400"}`}>
                                                            {formatTime(timeLeft)}
                                                        </span>
                                                    </div>
                                                    <div className="relative flex items-center group">
                                                        <Lock className="absolute left-5 text-white/30 w-5 h-5 group-focus-within:text-[#d4af37] transition-colors duration-500" />
                                                        <input
                                                            value={otp}
                                                            onChange={e => setOtp(e.target.value)}
                                                            type="text"
                                                            maxLength={6}
                                                            placeholder="••••••"
                                                            className="w-full bg-[#0a0a0a] border border-white/10 rounded-[24px] py-4 pl-14 pr-4 outline-none focus:border-[#d4af37] focus:shadow-[0_0_20px_rgba(212,175,55,0.1)] transition-all duration-500 text-white tracking-[0.5em] font-mono text-xl font-bold placeholder-white/20 text-center"
                                                        />
                                                    </div>
                                                </motion.div>

                                                <motion.button
                                                    variants={popInVariants}
                                                    onClick={handleVerify}
                                                    disabled={isVerifying}
                                                    className="w-full py-4 rounded-[20px] font-bold text-black flex items-center justify-center gap-2 disabled:opacity-70 shadow-[0_10px_20px_rgba(0,0,0,0.1)]"
                                                    style={{ backgroundColor: themeColor }}
                                                >
                                                    {isVerifying ? (
                                                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-5 h-5 border-2 border-black border-t-transparent rounded-full" />
                                                    ) : (
                                                        <>Verify & Continue <ArrowRight size={18} /></>
                                                    )}
                                                </motion.button>

                                                {/* Resend OTP button */}
                                                <motion.p variants={popInVariants} className="text-center text-xs font-medium text-white/40">
                                                    Didn't receive the code?{" "}
                                                    <button
                                                        onClick={handleSendOtp}
                                                        disabled={timeLeft > 0 || isSendingOtp}
                                                        className="font-bold underline cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:text-white transition-colors ml-1"
                                                        style={{ color: timeLeft === 0 ? themeColor : undefined }}
                                                    >
                                                        Resend OTP
                                                    </button>
                                                </motion.p>
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
                                    <motion.h2 variants={popInVariants} className="text-3xl font-serif font-black text-white">Basic Details</motion.h2>
                                    <motion.p variants={popInVariants} className="text-white/50 text-sm font-medium">Let's set up your {role} profile.</motion.p>
                                </div>

                                <div className="space-y-5 mt-2">
                                    <motion.div variants={popInVariants} className="space-y-2">
                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-2">Full Legal Name</label>
                                        <div className="relative flex items-center group">
                                            <User className="absolute left-5 text-white/30 w-5 h-5 group-focus-within:text-[#d4af37] transition-colors duration-500" />
                                            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John" className="w-full bg-[#0a0a0a] border border-white/10 rounded-[24px] py-4 pl-14 pr-4 outline-none focus:border-[#d4af37] focus:shadow-[0_0_20px_rgba(212,175,55,0.1)] transition-all duration-500 text-white font-medium placeholder-white/20" />
                                        </div>
                                    </motion.div>

                                    <motion.div variants={popInVariants} className="space-y-2">
                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-2">University ID / Roll Number</label>
                                        <div className="relative flex items-center group">
                                            <Briefcase className="absolute left-5 text-white/30 w-5 h-5 group-focus-within:text-[#d4af37] transition-colors duration-500" />
                                            <input type="text" value={universityId} onChange={e => setUniversityId(e.target.value)} placeholder="23BCE1234" className="w-full bg-[#0a0a0a] border border-white/10 rounded-[24px] py-4 pl-14 pr-4 outline-none focus:border-[#d4af37] focus:shadow-[0_0_20px_rgba(212,175,55,0.1)] transition-all duration-500 text-white font-medium uppercase placeholder-white/20" />
                                        </div>
                                    </motion.div>

                                    {role === 'student' && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <motion.div variants={popInVariants} className="space-y-2">
                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-2">Branch</label>
                                                <div className="relative flex items-center group">
                                                    <select
                                                        value={branch}
                                                        onChange={(e) => setBranch(e.target.value)}
                                                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-[24px] py-4 px-5 outline-none focus:border-[#d4af37] focus:shadow-[0_0_20px_rgba(212,175,55,0.1)] transition-all duration-500 text-white font-medium appearance-none"
                                                    >
                                                        <option value="" disabled>Select Branch</option>
                                                        <option value="CSE">CSE</option>
                                                        <option value="ECE">ECE</option>
                                                        <option value="MECH">MECH</option>
                                                        <option value="CIVIL">CIVIL</option>
                                                        <option value="AIML">AIML</option>
                                                    </select>
                                                </div>
                                            </motion.div>

                                            <motion.div variants={popInVariants} className="space-y-2">
                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-2">Year of Study</label>
                                                <div className="relative flex items-center group">
                                                    <select
                                                        value={yearOfStudy}
                                                        onChange={(e) => setYearOfStudy(e.target.value)}
                                                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-[24px] py-4 px-5 outline-none focus:border-[#d4af37] focus:shadow-[0_0_20px_rgba(212,175,55,0.1)] transition-all duration-500 text-white font-medium appearance-none"
                                                    >
                                                        <option value="" disabled>Select Year</option>
                                                        <option value="1">1st Year</option>
                                                        <option value="2">2nd Year</option>
                                                        <option value="3">3rd Year</option>
                                                        <option value="4">4th Year</option>
                                                    </select>
                                                </div>
                                            </motion.div>
                                        </div>
                                    )}

                                    <motion.button
                                        variants={popInVariants}
                                        onClick={handleStep3Next}
                                        className="w-full py-4 rounded-[20px] font-bold text-black bg-gradient-to-r from-[#d4af37] to-[#bca33e] shadow-[0_10px_30px_rgba(212,175,55,0.2)] mt-2"
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
                                    <motion.h2 variants={popInVariants} className="text-3xl font-serif font-black text-white">{role === 'student' ? 'Academic Stats' : 'Professional Info'}</motion.h2>
                                    <motion.p variants={popInVariants} className="text-white/50 text-sm font-medium">Final step to customize your dashboard.</motion.p>
                                </div>

                                <div className="space-y-5 mt-2">
                                    {role === 'student' ? (
                                        <>
                                            <div className="grid grid-cols-2 gap-4">
                                                <motion.div variants={popInVariants} className="space-y-2">
                                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-2">Current CGPA</label>
                                                    <input type="text" value={cgpa} onChange={e => setCgpa(e.target.value)} placeholder="8.96" className="w-full bg-[#0a0a0a] border border-white/10 rounded-[24px] py-4 px-5 outline-none focus:border-[#d4af37] transition-all duration-500 text-white font-medium placeholder-white/20" />
                                                </motion.div>
                                                <motion.div variants={popInVariants} className="space-y-2">
                                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-2">Grad. Year</label>
                                                    <input type="text" value={gradYear} onChange={e => setGradYear(e.target.value)} placeholder="2026" className="w-full bg-[#0a0a0a] border border-white/10 rounded-[24px] py-4 px-5 outline-none focus:border-[#d4af37] transition-all duration-500 text-white font-medium placeholder-white/20" />
                                                </motion.div>
                                            </div>
                                            <motion.div variants={popInVariants} className="space-y-2">
                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-2">Primary Domain</label>
                                                <select value={domain} onChange={e => setDomain(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-[24px] py-4 px-5 outline-none focus:border-[#d4af37] transition-all duration-500 text-white/70 font-medium appearance-none mb-4">
                                                    <option value="" disabled>Select Domain...</option>
                                                    <option value="sde">Software Engineering (SDE)</option>
                                                    <option value="data">Data Science & ML</option>
                                                    <option value="cloud">Cloud & DevOps</option>
                                                    <option value="core">Core Engineering</option>
                                                </select>
                                            </motion.div>

                                            <motion.div variants={popInVariants} className="space-y-4">
                                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                                    <div className="space-y-2 md:w-1/3">
                                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-2">Received Offer?</label>
                                                        <div className="flex gap-3">
                                                            <button
                                                                onClick={() => { setReceivedOffer("yes"); setIsDropdownOpen(false); }}
                                                                className={`flex-1 py-3 rounded-[16px] text-sm font-bold transition-all border ${receivedOffer === "yes" ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]' : 'bg-[#0a0a0a] border-white/10 text-white/50'}`}
                                                            >
                                                                Yes
                                                            </button>
                                                            <button
                                                                onClick={() => { setReceivedOffer("no"); setCompanySearch(""); setSelectedCompany(""); }}
                                                                className={`flex-1 py-3 rounded-[16px] text-sm font-bold transition-all border ${receivedOffer === "no" ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]' : 'bg-[#0a0a0a] border-white/10 text-white/50'}`}
                                                            >
                                                                No
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {receivedOffer === "yes" && (
                                                        <motion.div
                                                            initial={{ opacity: 0, x: -20, width: 0 }}
                                                            animate={{ opacity: 1, x: 0, width: "auto", flex: 1 }}
                                                            className="relative"
                                                        >
                                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-2 mb-2 block">Company Name</label>
                                                            <div className="relative">
                                                                <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
                                                                <input
                                                                    type="text"
                                                                    placeholder="Search company..."
                                                                    value={companySearch}
                                                                    onChange={(e) => { setCompanySearch(e.target.value); setIsDropdownOpen(true); }}
                                                                    onFocus={() => setIsDropdownOpen(true)}
                                                                    onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                                                                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-[20px] py-3 pl-11 pr-4 outline-none focus:border-[#d4af37] text-white font-medium text-sm"
                                                                />

                                                                <AnimatePresence>
                                                                    {isDropdownOpen && searchResults.length > 0 && (
                                                                        <motion.div
                                                                            initial={{ opacity: 0, y: -10 }}
                                                                            animate={{ opacity: 1, y: 0 }}
                                                                            exit={{ opacity: 0, y: -10 }}
                                                                            className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-[16px] overflow-hidden z-50 shadow-xl"
                                                                        >
                                                                            {searchResults.map((company, i) => (
                                                                                <div
                                                                                    key={i}
                                                                                    onClick={() => {
                                                                                        setSelectedCompany(company);
                                                                                        setCompanySearch(company);
                                                                                        setIsDropdownOpen(false);
                                                                                    }}
                                                                                    className="px-4 py-3 text-sm text-white/80 hover:bg-[#d4af37]/20 hover:text-[#d4af37] cursor-pointer transition-colors border-b border-white/5 last:border-none"
                                                                                >
                                                                                    {company}
                                                                                </div>
                                                                            ))}
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        </>
                                    ) : (
                                        <>
                                            <motion.div variants={popInVariants} className="space-y-2">
                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-2">Current Company</label>
                                                <div className="relative flex items-center group">
                                                    <Building className="absolute left-5 text-white/30 w-5 h-5 group-focus-within:text-[#d4af37] transition-colors duration-500" />
                                                    <input type="text" value={currentCompany} onChange={e => setCurrentCompany(e.target.value)} placeholder="e.g. Google, Amazon" className="w-full bg-[#0a0a0a] border border-white/10 rounded-[24px] py-4 pl-14 pr-4 outline-none focus:border-[#d4af37] focus:shadow-[0_0_20px_rgba(212,175,55,0.1)] transition-all duration-500 text-white font-medium placeholder-white/20" />
                                                </div>
                                            </motion.div>
                                            <motion.div variants={popInVariants} className="space-y-2">
                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-2">Job Title / Role</label>
                                                <input type="text" value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="e.g. SDE 1" className="w-full bg-[#0a0a0a] border border-white/10 rounded-[24px] py-4 px-5 outline-none focus:border-[#d4af37] transition-all duration-500 text-white font-medium placeholder-white/20" />
                                            </motion.div>
                                            <motion.div variants={popInVariants} className="space-y-2">
                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-2">LinkedIn Profile URL</label>
                                                <div className="relative flex items-center group">
                                                    <LinkIcon className="absolute left-5 text-white/30 w-5 h-5 group-focus-within:text-[#d4af37] transition-colors duration-500" />
                                                    <input type="url" value={linkedIn} onChange={e => setLinkedIn(e.target.value)} placeholder="https://linkedin.com/..." className="w-full bg-[#0a0a0a] border border-white/10 rounded-[24px] py-4 pl-14 pr-4 outline-none focus:border-[#d4af37] focus:shadow-[0_0_20px_rgba(212,175,55,0.1)] transition-all duration-500 text-white font-medium placeholder-white/20" />
                                                </div>
                                            </motion.div>
                                        </>
                                    )}

                                    <motion.button
                                        variants={popInVariants}
                                        onClick={handleStep4Next}
                                        className="w-full py-4 rounded-[20px] font-bold text-black mt-4 bg-gradient-to-r from-[#d4af37] to-[#bca33e] shadow-[0_10px_30px_rgba(212,175,55,0.2)]"
                                    >
                                        Next Step
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 5: PREFERENCES & HISTORY */}
                        {step === 5 && (
                            <motion.div key="step5" variants={explosiveStepVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <motion.h2 variants={popInVariants} className="text-3xl font-serif font-black text-white">{role === 'student' ? 'Your Preferences' : 'Experience'}</motion.h2>
                                    <motion.p variants={popInVariants} className="text-white/50 text-sm font-medium">Finalizing your profile setup.</motion.p>
                                </div>

                                <div className="space-y-6 mt-2">
                                    {role === 'student' ? (
                                        <>
                                            <motion.div variants={popInVariants} className="space-y-4">
                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-2">Key Skills</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {skillsOptions.map(skill => (
                                                        <button
                                                            key={skill}
                                                            onClick={() => setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill])}
                                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${selectedSkills.includes(skill)
                                                                ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                                                                : 'bg-[#0a0a0a] border-white/10 text-white/50 hover:border-white/30'
                                                                }`}
                                                        >
                                                            {skill}
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>

                                            <motion.div variants={popInVariants} className="space-y-4 mt-6">
                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-2">Placement Goal</label>
                                                <div className="grid grid-cols-3 gap-3">
                                                    {goalOptions.map(goal => (
                                                        <button
                                                            key={goal}
                                                            onClick={() => setPlacementGoal(goal)}
                                                            className={`py-3 rounded-[16px] text-sm font-bold transition-all duration-300 border ${placementGoal === goal
                                                                ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                                                                : 'bg-[#0a0a0a] border-white/10 text-white/50 hover:border-white/30'
                                                                }`}
                                                        >
                                                            {goal}
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        </>
                                    ) : (
                                        <>
                                            <motion.div variants={popInVariants} className="space-y-2">
                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-2">Companies Participated In / Cracked</label>
                                                <div className="relative flex items-center group">
                                                    <Building className="absolute top-5 left-5 text-white/30 w-5 h-5 group-focus-within:text-[#d4af37] transition-colors duration-500" />
                                                    <textarea
                                                        value={experienceText}
                                                        onChange={e => setExperienceText(e.target.value)}
                                                        placeholder="e.g. Google, Amazon, Microsoft (Separate by commas)"
                                                        rows={4}
                                                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-[24px] py-4 pl-14 pr-4 outline-none focus:border-[#d4af37] focus:shadow-[0_0_20px_rgba(212,175,55,0.1)] transition-all duration-500 text-white font-medium placeholder-white/20 resize-none"
                                                    />
                                                </div>
                                            </motion.div>
                                        </>
                                    )}

                                    <motion.button
                                        variants={popInVariants}
                                        onClick={handleComplete}
                                        disabled={isSubmitting}
                                        className="w-full py-4 rounded-[20px] font-bold text-black mt-6 flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(0,0,0,0.1)] disabled:opacity-70"
                                        style={{ backgroundColor: themeColor }}
                                    >
                                        {isSubmitting ? (
                                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-5 h-5 border-2 border-black border-t-transparent rounded-full" />
                                        ) : (
                                            <><CheckCircle2 size={20} /> Complete Registration</>
                                        )}
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