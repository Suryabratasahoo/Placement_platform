"use client"

import Navbar from "@/components/ui/senior/Navbar"

export default function SeniorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen overflow-hidden antialiased bg-[#0f1113] p-4 flex flex-col gap-1 overflow-x-hidden">

      {/* Shared Senior Navbar */}
      <Navbar />

      {/* All senior pages render here */}
      {children}

    </div>
  )
}
