"use client"

import Navbar from "@/components/ui/student/Navbar"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen overflow-hidden antialiased bg-[#0f1113] p-4 flex flex-col gap-1 overflow-x-hidden">

      {/* Shared Student Navbar */}
      <Navbar />

      {/* All student pages render here */}
      {children}

    </div>
  )
}