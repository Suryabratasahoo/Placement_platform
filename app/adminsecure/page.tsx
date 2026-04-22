"use client"

import { useState } from "react"
import { motion, type Variants } from "framer-motion"
import { Mail, Lock, Sparkles, LogIn } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export default function AdminSecurePage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);

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

    const handleAdminLogin = async () => {
        if (!email.trim() || !password.trim()) {
            toast.error("Please enter your admin credentials.");
            return;
        }

        try {
            setIsVerifying(true);
            const res = await fetch('/api/auth/admin-login', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Admin login failed");
            }

            toast.success("Admin authenticated securely");

            // Let Edge Middleware verify the HTTP-only cookie automatically

            router.push('/admin');

        } catch (error: any) {
            toast.error(error.message || "Invalid credentials. Unauthorized access.");
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#0f1113] p-4 flex items-center justify-center font-sans text-black overflow-hidden perspective-[1000px]">

            <motion.div
                initial={{ opacity: 0, rotateX: 10, y: 100 }}
                animate={{ opacity: 1, rotateX: 0, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="w-full max-w-xl bg-[#121212]/90 backdrop-blur-2xl rounded-[50px] p-8 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col border border-white/10"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.15, scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl pointer-events-none"
                    style={{ backgroundColor: themeColor }}
                />

                {/* === HEADER === */}
                <motion.div
                    initial="initial"
                    animate="animate"
                    variants={{
                        initial: { opacity: 0 },
                        animate: { opacity: 1, transition: { staggerChildren: 0.3, duration: 1 } }
                    }}
                    className="w-full shrink-0 mb-8 z-10"
                >
                    <div className="flex justify-between items-center">
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
                        <motion.div variants={popInVariants} className="px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                            <Lock size={12} /> Restricted Access
                        </motion.div>
                    </div>
                </motion.div>

                {/* === DYNAMIC FORM CONTENT === */}
                <div className="flex-1 relative z-10 flex flex-col justify-center">
                    <motion.div variants={explosiveStepVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <motion.h2 variants={popInVariants} className="text-3xl font-serif font-black text-white">Admin Secure</motion.h2>
                            <motion.p variants={popInVariants} className="text-white/50 text-sm font-medium">Please verify your executive credentials to continue.</motion.p>
                        </div>

                        <div className="space-y-5 mt-2">
                            <motion.div variants={popInVariants} className="space-y-2">
                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-2">Admin Email</label>
                                <div className="relative flex items-center group">
                                    <Mail className="absolute left-5 text-white/30 w-5 h-5 group-focus-within:text-[#d4af37] transition-colors duration-500" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="admin@eduview.com"
                                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-[24px] py-4 pl-14 pr-4 outline-none focus:border-[#d4af37] focus:shadow-[0_0_20px_rgba(212,175,55,0.1)] transition-all duration-500 text-white font-medium placeholder-white/20"
                                    />
                                </div>
                            </motion.div>

                            <motion.div variants={popInVariants} className="space-y-2">
                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-2">Security Key (Password)</label>
                                <div className="relative flex items-center group">
                                    <Lock className="absolute left-5 text-white/30 w-5 h-5 group-focus-within:text-[#d4af37] transition-colors duration-500" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-[24px] py-4 pl-14 pr-4 outline-none focus:border-[#d4af37] focus:shadow-[0_0_20px_rgba(212,175,55,0.1)] transition-all duration-500 text-white tracking-[0.2em] font-mono text-xl font-bold placeholder-white/20"
                                    />
                                </div>
                            </motion.div>

                            <motion.button
                                variants={popInVariants}
                                onClick={handleAdminLogin}
                                disabled={isVerifying}
                                className="w-full py-4 rounded-[20px] font-bold text-black flex items-center justify-center gap-2 disabled:opacity-70 mt-6 shadow-[0_10px_20px_rgba(0,0,0,0.1)]"
                                style={{ backgroundColor: themeColor }}
                            >
                                {isVerifying ? (
                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-5 h-5 border-2 border-black border-t-transparent rounded-full" />
                                ) : (
                                    <><LogIn size={18} /> Login to Admin Portal</>
                                )}
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </main>
    )
}
