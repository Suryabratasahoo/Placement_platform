"use client"

import React, { useEffect, useRef } from "react"
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  animate,
} from "framer-motion"
import {
  ArrowRight,
  Sparkles,
  Zap,
  Trophy,
  Clock,
  Star,
  FileText,
  Target,
  Users,
  GraduationCap,
  Briefcase,
  Shield,
  Twitter,
  Linkedin,
  Instagram
} from "lucide-react"
import Link from "next/link"
import Lenis from "@studio-freight/lenis"

const SECTIONS = [
  { id: 1, title: "Dream Career", color: "bg-[#f5f5f5]", textColor: "text-black", isHero: true },
  { id: 2, title: "Features", color: "bg-[#1783e1]", textColor: "text-white", isFeatures: true },
  { id: 3, title: "How It Works", color: "bg-[#f5f5f5]", textColor: "text-black", isHow: true },
  { id: 4, title: "Testimonials", color: "bg-[#681cf5]", textColor: "text-white", isTestimonials: true },
  { id: 5, title: "CTA Section", color: "bg-[#0c0c0c]", textColor: "text-white", isCta: true },
  { id: 6, title: "Footer", color: "bg-[#FFA365]", textColor: "text-black", isFooter: true },
]

// ── Testimonial data ──────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    reviewer: "Alex Johnson",
    role: "Software Engineer @ Google",
    avatar: "AJ",
    avatarBg: "bg-blue-500",
    stars: 5,
    quote:
      "EduView completely changed how I prepared for my interviews. The senior network gave me insights no YouTube video ever could. Landed my dream offer in 3 months.",
  },
  {
    reviewer: "Priya Sharma",
    role: "Product Manager @ Microsoft",
    avatar: "PS",
    avatarBg: "bg-pink-500",
    stars: 5,
    quote:
      "I was stuck in an endless loop of rejections. EduView connected me with seniors who had been there — their advice was brutally honest and incredibly helpful.",
  },
  {
    reviewer: "Marcus Lee",
    role: "Data Scientist @ Meta",
    avatar: "ML",
    avatarBg: "bg-green-500",
    stars: 5,
    quote:
      "The mock interview feature is insane. I practiced with someone who had done the exact same role. Nothing beats real experience sharing.",
  },
  {
    reviewer: "Sara Kim",
    role: "UX Designer @ Apple",
    avatar: "SK",
    avatarBg: "bg-orange-400",
    stars: 5,
    quote:
      "Within two weeks I had a portfolio review from a senior Apple designer and an offer shortly after. The platform is genuinely life-changing for students.",
  },
  {
    reviewer: "Rohan Verma",
    role: "ML Engineer @ OpenAI",
    avatar: "RV",
    avatarBg: "bg-purple-400",
    stars: 5,
    quote:
      "I didn't know what I was doing wrong until a senior walked me through my resume line by line. Got my first big-tech call within days of fixing it.",
  },
  {
    reviewer: "Anya Patel",
    role: "Finance Analyst @ Goldman Sachs",
    avatar: "AP",
    avatarBg: "bg-yellow-500",
    stars: 5,
    quote:
      "EduView matched me with someone who had taken the exact same career path I wanted. Having a roadmap from someone who'd done it made all the difference.",
  },
]

// Duplicate for seamless infinite loop
const ROW_1 = [...TESTIMONIALS, ...TESTIMONIALS]
const ROW_2 = [...TESTIMONIALS].reverse().concat([...TESTIMONIALS].reverse())

// ── Animated counter ──────────────────────────────────────────────────────────
const AnimatedCounter = ({ to }: { to: number }) => {
  const count = useMotionValue(0)
  const rounded = useTransform(count, Math.round)
  useEffect(() => {
    const animation = animate(count, to, { duration: 2.5, ease: [0.16, 1, 0.3, 1] })
    return animation.stop
  }, [count, to])
  return <motion.span>{rounded}</motion.span>
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.8, lerp: 0.05, smoothWheel: true })
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf) }
    requestAnimationFrame(raf)
    return () => lenis.destroy()
  }, [])

  return (
    <main className="bg-[#0f1113]">
      <div className="flex flex-col">
        {SECTIONS.map((section, index) => (
          <StackedCard key={section.id} section={section} index={index} />
        ))}
      </div>
    </main>
  )
}

// ── Stacked card ──────────────────────────────────────────────────────────────
function StackedCard({ section, index }: { section: any; index: number }) {
  const container = useRef(null)
  const isTall = section.isFeatures
  const isSuperTall = section.isHow
  const { scrollYProgress } = useScroll({ target: container, offset: ["start start", "end start"] })
  const scale = useTransform(scrollYProgress, isTall || isSuperTall ? [0.8, 1] : [0, 1], [1, 0.92])

  return (
    <div
      ref={container}
      className={`relative w-full ${isSuperTall ? 'h-[250vh]' : isTall ? 'h-[200vh]' : 'h-screen'}`}
      style={{ zIndex: index + 1 }}
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center px-4">
        <motion.div
          style={{ scale }}
          className={`relative w-full h-[95vh] rounded-[50px] shadow-2xl overflow-hidden ${section.color} ${section.textColor} p-10 md:p-16`}
        >
          {section.isHero && <HeroContent />}
          {section.isFeatures && <FeaturesContent progress={scrollYProgress} />}
          {section.isHow && <HowItWorksAnimated progress={scrollYProgress} />}
          {section.isTestimonials && <TestimonialsContent />}
          {section.isCta && <CTAContent />}
          {section.isFooter && <FooterContent />}
          {!section.isHero && !section.isFeatures && !section.isHow && !section.isTestimonials && !section.isCta && !section.isFooter && (
            <div className="h-full flex items-center justify-center">
              <h2 className="text-6xl font-black">{section.title}</h2>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function HeroContent() {
  return (
    <div className="h-full flex flex-col justify-between relative overflow-visible">

      {/* Top Navbar Area */}
      <div className="flex items-center justify-between relative z-20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-lg">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter">EduView</span>
        </div>
        <div className="hidden md:flex gap-6 items-center">
          <Link href="/adminsecure"><span className="text-sm font-bold text-gray-500 hover:text-black transition">For Admins</span></Link>
          <Link href="/senior"><span className="text-sm font-bold text-gray-500 hover:text-black transition">For Seniors</span></Link>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="flex flex-col lg:flex-row h-full items-center mt-6 lg:mt-0 relative z-10">

        {/* Left Text / CTA */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center h-full pr-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-black/5 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-black/60">Platform Live</span>
            </div>

            <h1 className="text-6xl md:text-[88px] font-black mb-6 leading-[0.95] tracking-tight">
              Crack the <br /> code to your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#681cf5] via-[#1783e1] to-[#681cf5] animate-gradient bg-[length:200%_auto]">
                future.
              </span>
            </h1>

            <p className="text-xl text-gray-500 mb-10 max-w-md leading-relaxed font-medium">
              Join thousands of students landing their dream tech offers through 1-on-1 mentorship and mock interviews.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Link href="/student">
                <button className="px-8 py-5 bg-black text-white rounded-full font-bold flex items-center gap-3 hover:scale-105 transition duration-300 shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
                  Start Your Journey <ArrowRight size={20} />
                </button>
              </Link>

              <div className="flex items-center gap-4 opacity-80 hover:opacity-100 transition">
                <div className="flex -space-x-3">
                  {['bg-blue-500', 'bg-pink-500', 'bg-purple-500', 'bg-orange-500'].map((color, i) => (
                    <div key={i} className={`w-10 h-10 rounded-full border-2 border-[#f5f5f5] ${color} shadow-sm z-[${4 - i}]`}></div>
                  ))}
                </div>
                <div className="text-sm font-bold flex flex-col">
                  <span className="text-black">400+ Seniors</span>
                  <span className="text-gray-500">Online right now</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Abstract Visuals */}
        <div className="hidden lg:flex w-[45%] h-full items-center justify-center relative overflow-hidden">
          {/* Ambient Classy Glow */}
          <motion.div
            animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            className="w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#d4af37]/10 via-transparent to-transparent blur-[100px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          />

          <div
            className="relative h-[80%] my-auto w-full flex justify-center py-10"
            style={{
              WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
              maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
            }}
          >
            <motion.div
              className="flex flex-col gap-8 w-64 items-center"
              animate={{ y: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            >
              {[
                { name: "Google", desc: "Software Engineer", color: "from-[#1a1a1a] to-[#222]" },
                { name: "Meta", desc: "Product Manager", color: "from-[#1a1a1a] to-[#222]" },
                { name: "Zomato", desc: "Data Scientist", color: "from-[#1a1a1a] to-[#222]" },
                { name: "Goldman Sachs", desc: "Quant Analyst", color: "from-[#1a1a1a] to-[#222]" },
                { name: "Microsoft", desc: "Cloud Architect", color: "from-[#1a1a1a] to-[#222]" },
                { name: "Amazon", desc: "SDE II", color: "from-[#1a1a1a] to-[#222]" },
                // Duplicate for seamless loop
                { name: "Google", desc: "Software Engineer", color: "from-[#1a1a1a] to-[#222]" },
                { name: "Meta", desc: "Product Manager", color: "from-[#1a1a1a] to-[#222]" },
                { name: "Zomato", desc: "Data Scientist", color: "from-[#1a1a1a] to-[#222]" },
                { name: "Goldman Sachs", desc: "Quant Analyst", color: "from-[#1a1a1a] to-[#222]" },
                { name: "Microsoft", desc: "Cloud Architect", color: "from-[#1a1a1a] to-[#222]" },
                { name: "Amazon", desc: "SDE II", color: "from-[#1a1a1a] to-[#222]" },
              ].map((comp, i) => (
                <div
                  key={i}
                  className={`w-full bg-gradient-to-br ${comp.color} backdrop-blur-xl p-8 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] border border-white/5 flex flex-col items-center justify-center text-center`}
                >
                  <p className="font-serif text-2xl font-black text-white tracking-widest uppercase mb-2">
                    {comp.name}
                  </p>
                  <div className="h-px w-12 bg-[#d4af37]/50 mb-3 block"></div>
                  <p className="text-xs text-white/50 font-medium tracking-wide">
                    {comp.desc}
                  </p>
                  <div className="mt-4 px-3 py-1 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-full inline-block">
                    <span className="text-[10px] text-[#d4af37] font-bold tracking-widest uppercase">Secured</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="flex gap-12 mt-auto pb-2 relative z-10 border-t border-black/5 pt-8 w-fit">
        <div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Live Network</p>
          <h2 className="text-4xl font-black text-black tracking-tighter"><AnimatedCounter to={1402} />+</h2>
        </div>
        <div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Offers Grabbed</p>
          <h2 className="text-4xl font-black text-[#681cf5] tracking-tighter"><AnimatedCounter to={850} />+</h2>
        </div>
      </div>
    </div>
  )
}

// ── Features ──────────────────────────────────────────────────────────────────
function FeaturesContent({ progress }: { progress: any }) {
  const features = [
    {
      icon: Zap,
      title: "Mock Interviews",
      desc: "Live 1v1 practice with industry experts to perfect your interviewing technique.",
      cols: "md:col-span-7",
      bg: "bg-white",
      text: "text-black",
      iconBg: "bg-[#1783e1]/10 text-[#1783e1]",
    },
    {
      icon: FileText,
      title: "Resume Teardowns",
      desc: "Get ruthless feedback to ensure your resume beats ATS tools.",
      cols: "md:col-span-5",
      bg: "bg-black",
      text: "text-white",
      iconBg: "bg-white/10 text-white",
    },
    {
      icon: Target,
      title: "Career Pathing",
      desc: "Personalized roadmaps so you always know what to learn next.",
      cols: "md:col-span-5",
      bg: "bg-[#681cf5]",
      text: "text-white",
      iconBg: "bg-white/10 text-white",
    },
    {
      icon: Users,
      title: "Direct Referrals",
      desc: "Build genuine connections that could lead to your next huge offer.",
      cols: "md:col-span-7",
      bg: "bg-[#FFA365]",
      text: "text-black",
      iconBg: "bg-black/10 text-black",
    },
  ]

  const y = useTransform(progress, [0, 0.8], ["0vh", "-60vh"])

  return (
    <motion.div style={{ y }} className="relative flex flex-col pt-[5vh] pb-[20vh] max-w-7xl mx-auto w-full">
      <div className="mb-10">
        <p className="text-white/60 font-bold uppercase tracking-[0.2em] mb-3 text-sm">
          Why Choose EduView
        </p>
        <h2 className="text-5xl md:text-6xl font-black leading-tight text-white">
          Everything you need <br />
          <span className="text-white/60">to break into tech.</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ scale: 0.98 }}
            className={`rounded-[32px] p-8 md:p-10 shadow-2xl flex flex-col justify-between ${f.cols} ${f.bg} ${f.text} group cursor-pointer overflow-hidden relative min-h-[280px]`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${f.iconBg} relative z-10`}>
              <f.icon className="w-7 h-7" />
            </div>

            <div className="relative z-10 mt-10">
              <h3 className="text-3xl font-black mb-3">{f.title}</h3>
              <p className="opacity-80 text-lg font-medium leading-relaxed max-w-sm">{f.desc}</p>
            </div>

            <motion.div
              className={`absolute -bottom-10 -right-10 opacity-10 ${f.text} transition-transform duration-700 group-hover:scale-[1.3] group-hover:rotate-12 group-hover:opacity-20 pointer-events-none`}
            >
              <f.icon className="w-64 h-64" />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ── Testimonials section ──────────────────────────────────────────────────────
function TestimonialsContent() {
  return (
    <div className="h-full flex flex-col justify-center gap-8 overflow-hidden">

      {/* Heading */}
      <div className="text-center flex-shrink-0">
        <p className="text-white/50 text-xs font-bold tracking-[0.25em] uppercase mb-3">
          What students say
        </p>
        <h2 className="text-5xl md:text-6xl font-black text-white leading-tight">
          Testimonials
        </h2>
      </div>

      {/* Belt 1 — left */}
      <MarqueeBelt items={ROW_1} direction="left" duration={50} />

      {/* Belt 2 — right */}
      <MarqueeBelt items={ROW_2} direction="right" duration={44} />

    </div>
  )
}

// ── Marquee belt ──────────────────────────────────────────────────────────────
function MarqueeBelt({
  items,
  direction,
  duration,
}: {
  items: typeof ROW_1
  direction: "left" | "right"
  duration: number
}) {
  return (
    <div
      className="relative overflow-hidden flex-shrink-0"
      style={{
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
        maskImage:
          "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
      }}
    >
      <motion.div
        className="flex gap-4 w-max"
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
      >
        {items.map((t, i) => (
          <TestimonialCard key={i} testimonial={t} />
        ))}
      </motion.div>
    </div>
  )
}

// ── Testimonial card ──────────────────────────────────────────────────────────
function TestimonialCard({ testimonial }: { testimonial: (typeof TESTIMONIALS)[0] }) {
  const [company, name] = testimonial.role.includes("@")
    ? [testimonial.role.split("@")[1].trim(), testimonial.role.split("@")[0].trim()]
    : [testimonial.role, ""]

  return (
    /*
      Card structure mirrors the reference image:
      ┌─────────────────────────────────┐
      │ [Dark tab top-left]  [Avatar ↗] │  ← overlapping avatar top-right
      │  NAME                           │
      │  review ★★★★★                   │
      ├─────────────────────────────────┤
      │  ROLE TITLE                     │  ← white body
      │  @ Company                      │
      │                                 │
      │  "Quote text…"                  │
      └─────────────────────────────────┘
    */
    <div className="relative w-[320px] flex-shrink-0 mt-6">

      {/* ── Dark accent tab — top-left ── */}
      <div className="absolute top-0 left-0 z-10 bg-[#3d1269] rounded-tl-[22px] rounded-br-[22px] px-5 py-4 shadow-xl">
        <p className="text-white font-black text-sm uppercase tracking-wide leading-tight">
          {testimonial.reviewer}
        </p>
        <p className="text-white/50 text-xs mt-0.5">review</p>
        <div className="flex gap-0.5 mt-2">
          {Array.from({ length: testimonial.stars }).map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
      </div>

      {/* ── Avatar — top-right, overlapping ── */}
      <div className="absolute -top-4 right-5 z-20 w-[62px] h-[62px] rounded-full border-[3px] border-white shadow-lg overflow-hidden">
        <div className={`w-full h-full ${testimonial.avatarBg} flex items-center justify-center`}>
          <span className="text-white font-black text-base">{testimonial.avatar}</span>
        </div>
      </div>

      {/* ── White body card ── */}
      <div className="bg-white rounded-[22px] pt-[72px] pb-6 px-6 shadow-2xl mt-4">
        <p className="text-[#681cf5] font-black text-xs tracking-[0.2em] uppercase">
          {name}
        </p>
        <p className="text-black/40 text-xs font-semibold mb-4 uppercase tracking-wider">
          {company}
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          "{testimonial.quote}"
        </p>
      </div>

    </div>
  )
}

// ── How It Works ──────────────────────────────────────────────────────────────
import { Search, PenTool, Rocket } from "lucide-react"

function HowItWorksAnimated({ progress }: { progress: any }) {
  // Map progress to finish drawing the line much earlier
  const pathLength = useTransform(progress, [0, 0.6], [0, 1])

  // Trigger steps spaced out over the new mapped scroll distance
  const step1 = useTransform(progress, (v: number) => (v > 0.05 ? 1 : 0))
  const step2 = useTransform(progress, (v: number) => (v > 0.25 ? 1 : 0))
  const step3 = useTransform(progress, (v: number) => (v > 0.45 ? 1 : 0))

  // Move the entire section upward slightly as the user leaves the section
  const y = useTransform(progress, [0.6, 1], ["0px", "-150px"])

  const steps = [
    { title: "Explore", desc: "Find the right path from verified seniors.", pos: "left-0 md:left-4 lg:left-12 top-[120px]", active: step1, icon: Search, color: "text-[#1783e1]", glow: "shadow-[#1783e1]/30" },
    { title: "Prepare", desc: "Refine your resume & crush mock interviews.", pos: "left-1/2 -translate-x-1/2 top-0", active: step2, icon: PenTool, color: "text-[#681cf5]", glow: "shadow-[#681cf5]/30" },
    { title: "Crack", desc: "Convert your efforts into top-tier offers.", pos: "right-0 md:right-4 lg:right-12 top-[120px]", active: step3, icon: Rocket, color: "text-[#FFA365]", glow: "shadow-[#FFA365]/30" },
  ]

  return (
    <motion.div style={{ y }} className="relative h-full flex flex-col justify-center items-center w-full px-2 sm:px-4 md:px-10 max-w-[1400px] mx-auto overflow-visible">
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(circle at top, rgba(104,28,245,0.08) 0%, transparent 60%)"
      }} />

      <div className="text-center mb-10 md:mb-16 z-20">
        <p className="text-black/40 font-bold uppercase tracking-[0.2em] mb-2 text-sm">
          The Process
        </p>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 tracking-tight">How It Works</h2>
        <p className="text-lg md:text-xl text-gray-500 font-medium">Scroll down to follow the journey.</p>
      </div>

      <div className="relative w-full h-[350px] md:h-[400px]">
        {/* Connection Path */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block" viewBox="0 0 1400 400" fill="none" preserveAspectRatio="none">
          <path d="M 150 180 C 400 280, 450 60, 700 60 C 950 60, 1000 280, 1250 180" stroke="url(#gradientGradient)" strokeWidth="6" strokeLinecap="round" strokeDasharray="16 16" className="opacity-30" />
          <motion.path d="M 150 180 C 400 280, 450 60, 700 60 C 950 60, 1000 280, 1250 180" stroke="url(#gradientGradient)" strokeWidth="8" strokeLinecap="round" style={{ pathLength }} />
          <defs>
            <linearGradient id="gradientGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1783e1" />
              <stop offset="50%" stopColor="#681cf5" />
              <stop offset="100%" stopColor="#FFA365" />
            </linearGradient>
          </defs>
        </svg>

        {/* Scaled down SVG for smaller screens */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none block md:hidden" viewBox="0 0 800 350" fill="none" preserveAspectRatio="none">
          <path d="M 100 160 C 250 250, 300 50, 400 50 C 500 50, 550 250, 700 160" stroke="url(#gradientGradient2)" strokeWidth="4" strokeLinecap="round" strokeDasharray="12 12" className="opacity-30" />
          <motion.path d="M 100 160 C 250 250, 300 50, 400 50 C 500 50, 550 250, 700 160" stroke="url(#gradientGradient2)" strokeWidth="5" strokeLinecap="round" style={{ pathLength }} />
          <defs>
            <linearGradient id="gradientGradient2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1783e1" />
              <stop offset="50%" stopColor="#681cf5" />
              <stop offset="100%" stopColor="#FFA365" />
            </linearGradient>
          </defs>
        </svg>

        {/* Step Cards */}
        {steps.map((step, i) => (
          <div key={i} className={`absolute ${step.pos} w-[260px] md:w-[320px] lg:w-[340px] z-10`}>
            {/* Pulsing background effect when active */}
            <motion.div
              className={`absolute inset-0 rounded-[32px] md:rounded-[40px] bg-white opacity-0 blur-xl md:blur-2xl ${step.glow}`}
              style={{ opacity: step.active }}
            />

            <div className="relative bg-white/70 backdrop-blur-2xl border border-white rounded-[32px] md:rounded-[40px] p-6 shadow-[0_10px_40px_rgb(0,0,0,0.06)] transition-all duration-500 hover:scale-[1.03] hover:bg-white hover:shadow-2xl">
              <motion.div
                className="absolute inset-0 rounded-[32px] md:rounded-[40px] border-2 border-black/10 pointer-events-none"
                style={{ opacity: step.active }}
                transition={{ duration: 0.5 }}
              />

              <div className="flex items-center justify-between mb-4 md:mb-6 relative z-10">
                <p className="text-black/30 text-xs md:text-sm font-black uppercase tracking-widest hidden sm:block">Step 0{i + 1}</p>
                <motion.div
                  className={`w-10 h-10 md:w-14 md:h-14 rounded-full bg-white shadow-lg flex items-center justify-center ${step.color}`}
                  style={{ opacity: step.active, scale: step.active }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  <step.icon strokeWidth={2.5} className="w-5 h-5 md:w-6 md:h-6" />
                </motion.div>
              </div>

              <h3 className="text-xl md:text-3xl font-black mb-2 md:mb-3 relative z-10 text-black tracking-tight">{step.title}</h3>
              <p className="text-gray-500 text-sm md:text-base relative z-10 font-medium leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ── CTA Section ───────────────────────────────────────────────────────────────
function CTAContent() {
  return (
    <div className="h-full flex flex-col md:flex-row items-center justify-between gap-10">
      <div className="md:w-1/2 flex flex-col justify-center gap-8 z-10">
        <h2 className="text-5xl md:text-7xl font-black leading-tight">
          Ready to start your journey?
        </h2>
        <p className="text-xl text-gray-400">
          Join the platform that is accelerating careers worldwide.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Link href="/admin">
            <button className="px-8 py-4 bg-white text-black rounded-full font-bold flex items-center justify-center gap-3 hover:scale-105 transition w-full sm:w-auto shadow-xl">
              Signup as Admin <ArrowRight size={18} />
            </button>
          </Link>
          <Link href="/senior">
            <button className="px-8 py-4 bg-[#681cf5] text-white rounded-full font-bold flex items-center justify-center gap-3 hover:scale-105 transition w-full sm:w-auto shadow-xl">
              Signup as Senior <ArrowRight size={18} />
            </button>
          </Link>
        </div>
      </div>

      <div className="md:w-1/2 h-full relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0 pointer-events-none" style={{
          background: "radial-gradient(circle at center, rgba(104,28,245,0.15) 0%, transparent 70%)"
        }} />
        <div className="flex flex-col gap-6 w-[150%] rotate-[-5deg] origin-center translate-x-[10%]">
          <CompanyMarquee direction="left" duration={35} />
          <CompanyMarquee direction="right" duration={40} />
          <CompanyMarquee direction="left" duration={45} />
        </div>
      </div>
    </div>
  )
}

const COMPANY_NAMES = [
  "Google", "Microsoft", "Meta", "Amazon", "Apple", "Netflix",
  "Stripe", "Uber", "Airbnb", "Tesla", "Spotify", "Twitter",
  "Goldman Sachs", "JPMorgan", "Bloomberg", "Salesforce"
]

function CompanyMarquee({ direction, duration }: { direction: "left" | "right", duration: number }) {
  const items = [...COMPANY_NAMES].sort(() => Math.random() - 0.5) // Shuffle for variety
  const rowItems = [...items, ...items] // Duplicate for seamless loop

  return (
    <div
      className="relative overflow-hidden flex-shrink-0 flex translate-x-0 w-full"
      style={{
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
        maskImage: "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
      }}
    >
      <motion.div
        className="flex gap-4 w-max"
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
      >
        {rowItems.map((company, i) => (
          <div key={i} className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl flex flex-shrink-0 items-center justify-center shadow-lg hover:bg-white/10 transition-colors">
            <span className="text-white/80 font-bold text-xl tracking-wide">{company}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────
function FooterContent() {
  return (
    <div className="h-full flex flex-col justify-between pt-4 pb-4 relative overflow-hidden w-full">
      {/* Top Footer Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end z-10 gap-10 mt-4 md:mt-10">
        <div className="max-w-md">
          <h3 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Ready to rewrite your career trajectory?
          </h3>
          <p className="text-black/60 font-medium text-lg mb-8">
            Join the exclusive network of students and mentors shaping the future of tech.
          </p>
          <div className="flex gap-4">
            <Link href="/student" className="px-6 py-3 bg-black text-white rounded-full font-bold hover:scale-105 transition">
              Get Started
            </Link>
            <Link href="/about" className="px-6 py-3 bg-white/50 backdrop-blur-md border border-black/10 text-black rounded-full font-bold hover:bg-white transition hidden sm:block">
              Our Story
            </Link>
          </div>
        </div>

        <div className="flex gap-16 text-right md:text-left">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-black uppercase tracking-widest text-black/40 mb-2">Platform</p>
            <Link href="/student" className="group font-bold text-lg hover:tracking-wide transition-all flex items-center justify-end md:justify-start gap-2">
              <GraduationCap size={20} className="text-black/50 group-hover:text-black transition-colors" />
              <span>Students</span>
            </Link>
            <Link href="/senior" className="group font-bold text-lg hover:tracking-wide transition-all flex items-center justify-end md:justify-start gap-2">
              <Briefcase size={20} className="text-black/50 group-hover:text-black transition-colors" />
              <span>Seniors</span>
            </Link>
            <Link href="/admin" className="group font-bold text-lg hover:tracking-wide transition-all flex items-center justify-end md:justify-start gap-2">
              <Shield size={20} className="text-black/50 group-hover:text-black transition-colors" />
              <span>Admins</span>
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-black uppercase tracking-widest text-black/40 mb-2">Socials</p>
            <a href="#" className="group font-bold text-lg hover:tracking-wide transition-all flex items-center justify-end md:justify-start gap-2">
              <Twitter size={20} className="text-black/50 group-hover:text-black transition-colors" />
              <span>X (Twitter)</span>
            </a>
            <a href="#" className="group font-bold text-lg hover:tracking-wide transition-all flex items-center justify-end md:justify-start gap-2">
              <Linkedin size={20} className="text-black/50 group-hover:text-black transition-colors" />
              <span>LinkedIn</span>
            </a>
            <a href="#" className="group font-bold text-lg hover:tracking-wide transition-all flex items-center justify-end md:justify-start gap-2">
              <Instagram size={20} className="text-black/50 group-hover:text-black transition-colors" />
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </div>

      {/* Massive Typography bottom */}
      <div className="mt-auto relative z-10 w-full flex flex-col items-center justify-end flex-grow">
        <motion.h1
          className="text-[17vw] leading-[0.8] font-black text-black tracking-tighter w-full text-center hover:text-white transition-colors duration-500 cursor-default"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          EDUVIEW.
        </motion.h1>

        <div className="flex flex-col sm:flex-row justify-between w-full text-xs font-bold uppercase tracking-widest text-black/50 mt-6 border-t border-black/10 pt-6">
          <p>© {new Date().getFullYear()} EduView Inc.</p>
          <p className="hidden md:block">Designed to crack the code.</p>
          <p>All Rights Reserved.</p>
        </div>
      </div>

      {/* Background decoration glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/20 blur-[100px] rounded-full pointer-events-none" />
    </div>
  )
}