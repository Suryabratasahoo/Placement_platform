// app/admin/layout.tsx

"use client"

import Navbar from "@/components/ui/admin/Navbar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen overflow-hidden antialiased bg-[#0f1113] p-4 flex flex-col gap-1 overflow-x-hidden">

      {/* Shared Admin Navbar */}
      <Navbar />

      {/* All admin pages render here */}
      {children}

    </div>
  )
}