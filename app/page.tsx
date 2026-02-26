// app/page.tsx

"use client"

import { useEffect } from "react"
import { motion, type Variants, useMotionValue, useTransform, animate } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Shield, Award, Zap, Users, Sparkles } from "lucide-react"

// Custom Component for the Rapid Number Animation
const AnimatedCounter = ({ to }: { to: number }) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, Math.round);

    useEffect(() => {
        // Snappy custom easing curve
        const animationControls = animate(count, to, { 
            duration: 2.5, 
            ease: [0.16, 1, 0.3, 1] 
        });
        return animationControls.stop;
    }, [count, to]);

    return <motion.span>{rounded}</motion.span>;
}

export default function LandingPage() {
    // Staggered container load
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 }
        }
    }

    // Bouncy entry for elements
    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 40, scale: 0.95 },
        show: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: { type: "spring", bounce: 0.4, duration: 0.8 }
        }
    }

    // Infinite floating for widgets
    const floatVariants: Variants = {
        animate: {
            y: [0, -12, 0],
            rotate: [0, 2, -2, 0],
            transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }
    }

    return (
        <main className="h-screen bg-[#0f1113] p-4 font-sans text-black overflow-hidden">
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full"
            >
                {/* === MAIN HERO BENTO (Left) === */}
                <motion.div 
                    variants={itemVariants} 
                    className="lg:col-span-8 bg-[#f5f5f5] rounded-[50px] p-12 flex flex-col justify-between relative overflow-hidden shadow-2xl"
                >
                    
                    {/* Animated Background decorative blobs */}
                    <motion.div 
                        animate={{ 
                            x: [0, 30, 0], 
                            y: [0, -40, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#b4a9f8]/40 to-[#1783e1]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" 
                    />
                    
                    {/* Top Nav Area */}
                    <div className="flex justify-between items-center relative z-10">
                        <div className="flex items-center gap-4">
                            
                            {/* NEW SPINNING HALO LOGO ANIMATION */}
                            <div className="relative flex items-center justify-center w-12 h-12 bg-black rounded-full">
                                {/* The spinning gradient ring */}
                                <motion.div 
                                    className="absolute -inset-1 rounded-full z-0"
                                    style={{ background: "conic-gradient(from 0deg, transparent 60%, #681cf5 100%)" }}
                                    animate={{ 
                                        rotate: [0, 1080], // Spins 3 full times
                                        opacity: [0, 1, 1, 0] // Fades in, stays visible, fades out
                                    }}
                                    transition={{ 
                                        duration: 7, 
                                        ease: "easeInOut", 
                                        times: [0, 0.1, 0.9, 1] // Controls exactly when the opacity changes happen
                                    }}
                                />
                                {/* Inner mask to keep the logo background purely black */}
                                <div className="absolute inset-0 bg-black rounded-full z-10" />
                                <Sparkles className="text-white w-6 h-6 relative z-20" />
                            </div>

                            <span className="text-2xl font-black tracking-tight text-black">EduView</span>
                        </div>
                        <div className="hidden md:flex gap-2">
                            <span className="px-4 py-2 bg-white rounded-full text-sm font-bold shadow-sm border border-gray-100 hover:scale-105 transition-transform cursor-pointer">
                                VIT-AP Portal
                            </span>
                        </div>
                    </div>

                    {/* Main Copy */}
                    <div className="relative z-10 max-w-2xl mt-10">
                        <motion.div variants={itemVariants}>
                            <p className="text-[#681cf5] font-bold tracking-widest uppercase mb-4 text-sm flex items-center gap-2">
                                <Zap size={16} fill="currentColor" /> Placement Intelligence
                            </p>
                        </motion.div>
                        <motion.h1 variants={itemVariants} className="text-6xl md:text-7xl font-black leading-[1.1] tracking-tight mb-6">
                            Crack the code to your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#681cf5] to-[#1783e1]">dream career.</span>
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-xl text-gray-500 font-medium max-w-xl mb-10">
                            The all-in-one platform connecting students, seniors, and the placement cell to streamline hiring.
                        </motion.p>
                        
                        <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                            <Link href="/student">
                                <button className="px-8 py-4 bg-black text-white rounded-full font-bold text-lg flex items-center gap-3 hover:scale-105 transition-transform shadow-xl hover:shadow-black/20 group">
                                    Student Login
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>

                {/* === RIGHT SIDE COLUMN === */}
                <div className="lg:col-span-4 flex flex-col gap-4 h-full">
                    
                    {/* TOP RIGHT: Roles Bento */}
                    <motion.div 
                        variants={itemVariants} 
                        className="flex-1 bg-[#0c0c0c] rounded-[40px] p-8 relative overflow-hidden group shadow-xl flex flex-col justify-center"
                    >
                        <svg className="absolute right-0 top-0 h-full opacity-10 transition-opacity duration-500 group-hover:opacity-30" viewBox="0 0 200 200">
                            <path fill="none" stroke="white" strokeWidth="2" d="M100,20 C150,50 50,150 180,180" strokeLinecap="round" />
                        </svg>

                        <h3 className="text-white text-2xl font-bold mb-6 relative z-10">Select your portal</h3>
                        
                        <div className="space-y-4 relative z-10">
                            <Link href="/senior">
                                <motion.div whileHover={{ scale: 1.03, x: 5 }} className="w-full bg-white/10 hover:bg-white/20 border border-white/5 p-4 rounded-3xl flex items-center justify-between cursor-pointer transition-all backdrop-blur-sm group/btn">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-[#54E359] rounded-full flex items-center justify-center shadow-lg group-hover/btn:scale-110 transition-transform">
                                            <Award className="text-black w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold">Senior Contributor</h4>
                                            <p className="text-gray-400 text-xs font-semibold">Share experiences</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="text-gray-500 group-hover/btn:text-white transition-colors" />
                                </motion.div>
                            </Link>

                            <Link href="/admin">
                                <motion.div whileHover={{ scale: 1.03, x: 5 }} className="w-full bg-white/10 hover:bg-white/20 border border-white/5 p-4 rounded-3xl flex items-center justify-between cursor-pointer transition-all backdrop-blur-sm group/btn">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-[#FFA365] rounded-full flex items-center justify-center shadow-lg group-hover/btn:scale-110 transition-transform">
                                            <Shield className="text-black w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold">Placement Cell</h4>
                                            <p className="text-gray-400 text-xs font-semibold">Manage drives</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="text-gray-500 group-hover/btn:text-white transition-colors" />
                                </motion.div>
                            </Link>
                        </div>
                    </motion.div>

                    {/* BOTTOM RIGHT: Stats Bento */}
                    <motion.div 
                        variants={itemVariants} 
                        whileHover={{ scale: 0.98 }}
                        className="h-64 bg-[#1783e1] rounded-[40px] p-8 relative overflow-hidden shadow-xl flex flex-col justify-end transition-transform cursor-pointer"
                    >
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl pointer-events-none" />
                        
                        <motion.div variants={floatVariants} animate="animate" className="absolute top-8 right-8 w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
                            <Users className="text-white w-8 h-8" />
                        </motion.div>

                        <div className="relative z-10">
                            <p className="text-blue-200 font-bold uppercase tracking-widest text-xs mb-2">Live Network</p>
                            
                            {/* THE RAPID NUMBER ANIMATION */}
                            <h2 className="text-white text-5xl font-black mb-1 flex items-center">
                                <AnimatedCounter to={1402} />+
                            </h2>
                            
                            <p className="text-white/80 font-medium text-sm">Active students & alumni connected</p>
                        </div>
                    </motion.div>

                </div>
            </motion.div>
        </main>
    )
}