"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { Mail, Lock, ChevronLeft, Sparkles } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

import { useUserStore } from "@/store/userStore"
import Cookies from "js-cookie"

export default function SignInPage() {
    const router = useRouter();
    const setAuth = useUserStore((state: any) => state.setAuth);
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

    const themeColor = "#d4af37";

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
                ease: "easeOut",
                staggerChildren: 0.15,
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
            setOtpSent(true);
            setTimeLeft(300); // 5 minutes layout
            setStep(2);
            toast.success("Check your mail for the OTP");
        } catch (err: any) {
            toast.error(err.message || "Failed to send OTP. Please try again.");
        } finally {
            setIsSendingOtp(false)
        }
    };

    const handleVerifySignin = async () => {
        if (!otp.trim() || otp.length !== 6) {
            toast.error("Please enter the 6-digit OTP.");
            return;
        }

        try {
            setIsVerifying(true);
            const res = await fetch('/api/auth/verify-signin', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Sign in failed");
            }

            toast.success("Signed in successfully!");

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

            if (data.user.role === "student") {
                router.push('/student');
            } else if (data.user.role === "senior") {
                router.push('/senior');
            } else if (data.user.role === "admin") {
                router.push('/admin');
            } else {
                router.push('/dashboard');
            }

        } catch (error: any) {
            toast.error(error.message || "Verification failed. Please try again.");
        } finally {
            setIsVerifying(false);
        }
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (otpSent && timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [otpSent, timeLeft]);

    const stepLabels = ["Email", "Verify"];

    return (
        <main className="min-h-screen bg-[#0f1113] p-4 flex items-center justify-center font-sans text-black overflow-hidden perspective-[1000px]">

            <motion.div
                initial={{ opacity: 0, rotateX: 10, y: 100 }}
                animate={{ opacity: 1, rotateX: 0, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="w-full max-w-2xl bg-[#121212]/90 backdrop-blur-2xl rounded-[50px] p-8 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col min-h-[500px] border border-white/10"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.15, scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl pointer-events-none"
                    style={{ backgroundColor: themeColor }}
                />

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

                        <AnimatePresence mode="wait">
                            {step > 1 ? (
                                <motion.button
                                    key="back"
                                    initial={{ opacity: 0, x: 20, filter: "blur(5px)" }}
                                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, x: 20, filter: "blur(5px)" }}
                                    transition={{ duration: 0.6 }}
                                    onClick={() => setStep(step - 1)}
                                    className="flex items-center gap-1 text-xs font-bold text-white/40 uppercase tracking-wider"
                                >
                                    <ChevronLeft size={16} /> Back
                                </motion.button>
                            ) : (
                                <motion.div
                                    key="register"
                                    initial={{ opacity: 0, x: 20, filter: "blur(5px)" }}
                                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, x: 20, filter: "blur(5px)" }}
                                    transition={{ duration: 0.6 }}
                                    className="text-xs font-medium text-white/50"
                                >
                                    Don't have an account?{' '}
                                    <Link href="/auth" className="text-[#d4af37] font-bold transition-colors">
                                        Register
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Progress Bar */}
                    <motion.div variants={popInVariants} className="w-full relative pt-8">
                        <div className="w-full h-3 bg-white/5 border border-white/5 rounded-full relative overflow-visible">
                            <motion.div
                                className="absolute top-0 left-0 h-full rounded-full relative"
                                style={{ backgroundColor: themeColor }}
                                initial={{ width: "0%" }}
                                animate={{ width: `${(step / 2) * 100}%` }}
                                transition={{ duration: 1.5, ease: [0.85, 0, 0.15, 1] }}
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

                        {/* STEP 1: EMAIL */}
                        {step === 1 && (
                            <motion.div key="step1" variants={explosiveStepVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <motion.h2 variants={popInVariants} className="text-3xl font-serif font-black text-white">Welcome Back</motion.h2>
                                    <motion.p variants={popInVariants} className="text-white/50 text-sm font-medium">Enter your university email to securely sign in.</motion.p>
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

                                    <motion.button
                                        variants={popInVariants}
                                        onClick={handleSendOtp}
                                        disabled={isSendingOtp}
                                        className="w-full py-4 rounded-[20px] font-bold text-black flex items-center justify-center gap-2 disabled:opacity-70 bg-gradient-to-r from-[#d4af37] to-[#bca33e] shadow-[0_10px_30px_rgba(212,175,55,0.2)]"
                                    >
                                        {isSendingOtp ? (
                                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-5 h-5 border-2 border-black border-t-transparent rounded-full" />
                                        ) : (
                                            "Send Secure OTP"
                                        )}
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}


                        {/* STEP 2: OTP VERIFICATION */}
                        {step === 2 && (
                            <motion.div key="step2" variants={explosiveStepVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <motion.h2 variants={popInVariants} className="text-3xl font-serif font-black text-white">Verify Identity</motion.h2>
                                    <motion.p variants={popInVariants} className="text-white/50 text-sm font-medium">
                                        We sent a code to <span className="text-white">{email || "your email"}</span>
                                    </motion.p>
                                </div>
                                <motion.div variants={popInVariants} className="space-y-5 mt-2">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center pr-2">
                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-2">Enter 6-Digit OTP</label>
                                            {timeLeft > 0 && <span className="text-[10px] font-bold text-[#d4af37]">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>}
                                        </div>
                                        <div className="relative flex items-center group">
                                            <Lock className="absolute left-5 text-white/30 w-5 h-5 group-focus-within:text-[#d4af37] transition-colors duration-500" />
                                            <input
                                                type="text"
                                                maxLength={6}
                                                value={otp}
                                                onChange={e => setOtp(e.target.value)}
                                                placeholder="••••••"
                                                className="w-full bg-[#0a0a0a] border border-white/10 rounded-[24px] py-4 pl-14 pr-4 outline-none focus:border-[#d4af37] focus:shadow-[0_0_20px_rgba(212,175,55,0.1)] transition-all duration-500 text-white tracking-[0.5em] font-mono text-xl font-bold placeholder-white/20 text-center"
                                            />
                                        </div>
                                    </div>

                                    <motion.button
                                        variants={popInVariants}
                                        onClick={handleVerifySignin}
                                        disabled={isVerifying}
                                        className="w-full py-4 rounded-[20px] font-bold text-black flex items-center justify-center gap-2 disabled:opacity-70 shadow-[0_10px_20px_rgba(0,0,0,0.1)]"
                                        style={{ backgroundColor: themeColor }}
                                    >
                                        {isVerifying ? (
                                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-5 h-5 border-2 border-black border-t-transparent rounded-full" />
                                        ) : (
                                            "Verify & Sign In"
                                        )}
                                    </motion.button>

                                    {timeLeft === 0 && (
                                        <button onClick={handleSendOtp} className="w-full text-center text-xs text-white/40 hover:text-white transition-colors mt-4">
                                            Didn't receive code? Resend
                                        </button>
                                    )}
                                </motion.div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </motion.div>
        </main>
    )
}
