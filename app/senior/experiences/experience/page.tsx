"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Briefcase, Calendar, Layers, Pencil } from "lucide-react"
import { useState } from "react"

const rounds = [
  {
    title: "Online Assessment",
    format: "MCQ + Coding",
    difficulty: "Medium",
    questions: ["Sliding window", "Array manipulation"],
    tips: "Practice timed problems – speed is key."
  },
  {
    title: "Technical Interview",
    format: "Coding + Discussion",
    difficulty: "Hard",
    questions: ["Reverse linked list", "System design basics"],
    tips: "Strong fundamentals impressed interviewer."
  },
  {
    title: "Manager Round",
    format: "Project deep dive",
    difficulty: "Medium",
    questions: ["Architecture", "Decision making"],
    tips: "Explain tradeoffs clearly."
  },
  {
    title: "HR Round",
    format: "Behavioral",
    difficulty: "Easy",
    questions: ["Why company?", "Long term goals"],
    tips: "Be honest and structured."
  }
]

export default function ExperienceDetailPage() {

  const [openRound, setOpenRound] = useState<number | null>(0)

  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white rounded-[40px] p-4 h-screen overflow-hidden text-black"
    >

      {/* LEFT COMPANY CARD */}
      <div className="lg:col-span-3 bg-[#0c0c0c] rounded-[40px] p-6 text-white flex flex-col shadow-xl">

        <button className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100 mb-6">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="space-y-4">
          <p className="text-orange-300 text-xs font-bold tracking-[0.18em] uppercase">Company</p>
          <h2 className="text-3xl font-bold">Google</h2>

          <div className="space-y-2 text-sm opacity-80">
            <p className="flex items-center gap-2"><Briefcase size={14}/> Software Engineer Intern</p>
            <p className="flex items-center gap-2"><Calendar size={14}/> March 2024</p>
            <p className="flex items-center gap-2"><Layers size={14}/> 4 Interview Rounds</p>
          </div>
        </div>

        <div className="mt-8 rounded-[28px] bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] p-6 text-center border border-white/5">
          <h3 className="text-lg font-bold mb-1">Real Experience</h3>
          <p className="text-gray-400 text-xs">Shared by seniors who cracked the process.</p>
        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div className="lg:col-span-9 bg-[#f5f5f5] rounded-[50px] p-10 flex flex-col overflow-hidden">

        <h2 className="text-3xl font-bold mb-8">Interview Rounds</h2>

        <div className="flex-1 space-y-6 overflow-y-auto pr-2
          [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

          {rounds.map((r, i) => (
            <div key={i} className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">

              <div className="flex items-center justify-between p-6 hover:bg-gray-50 transition">

                <button
                  onClick={() => setOpenRound(openRound === i ? null : i)}
                  className="flex items-center gap-4 font-bold flex-1 text-left"
                >
                  {r.title}
                  <motion.span
                    animate={{ rotate: openRound === i ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-400 ml-auto"
                  >
                    ▼
                  </motion.span>
                </button>

                <button className="ml-4 px-4 py-1.5 rounded-full text-xs font-semibold bg-gray-100 hover:bg-black hover:text-white transition flex items-center gap-1">
                  <Pencil size={12}/> Edit
                </button>
              </div>

              <AnimatePresence>
                {openRound === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 space-y-4 text-sm text-gray-700">

                      <div className="flex gap-3">
                        <span className="bg-gray-100 px-3 py-1 rounded-full">📋 {r.format}</span>
                        <span className="bg-orange-100 px-3 py-1 rounded-full font-semibold">⚡ {r.difficulty}</span>
                      </div>

                      <div>
                        <p className="font-semibold mb-1">Questions</p>
                        <ul className="list-disc pl-5 space-y-1">
                          {r.questions.map((q, qi) => <li key={qi}>{q}</li>)}
                        </ul>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 italic">
                        "{r.tips}"
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          ))}

          {/* COLOR VERDICT CARD */}
          <div className="relative rounded-[40px] p-10 bg-[#1783e1] text-white shadow-xl mt-8 overflow-hidden">
            <h2 className="text-3xl font-bold mb-2">Final Verdict 🎉</h2>
            <p className="opacity-80 mb-6">Candidate cleared all rounds successfully</p>

            <div className="flex flex-wrap gap-10 font-semibold">
              <div><p className="opacity-70 text-sm">Hardest</p><p className="text-xl">Technical</p></div>
              <div><p className="opacity-70 text-sm">Topic</p><p className="text-xl">Linked Lists</p></div>
              <div><p className="opacity-70 text-sm">Prep</p><p className="text-xl">2 Months</p></div>
            </div>
          </div>

          {/* COLORFUL RESOURCES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

            {[
              { name: "DSA Notes", color: "bg-[#ffd6a5]" },
              { name: "YouTube Playlist", color: "bg-[#bdb2ff]" },
              { name: "SQL Cheatsheet", color: "bg-[#caffbf]" }
            ].map((r, i) => (
              <div key={i}
                className={`${r.color} rounded-[32px] p-6 shadow-md hover:scale-105 transition cursor-pointer`}
              >
                <p className="font-bold mb-2">{r.name}</p>
                <button className="bg-black text-white rounded-full py-2 w-full">
                  💾 Save
                </button>
              </div>
            ))}

          </div>

        </div>
      </div>

    </motion.main>
  )
}
