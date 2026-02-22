"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Home, Briefcase, FileText, CheckSquare, Settings, X, Zap, Bell } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Updated menu items for Student context
const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/student' },
  { id: 'drives', label: 'Drives', icon: Briefcase, path: '/student/drives' },
  { id: 'applications', label: 'Applications', icon: CheckSquare, path: '/student/applications' },
  { id: 'resources', label: 'Resources', icon: FileText, path: '/student/resources' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/student/settings' },
];

const ModernHamburger = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="flex flex-col gap-1.5 p-2 group active:scale-90 transition-transform">
    <div className="w-6 h-1 bg-white rounded-full group-hover:bg-[#b4a9f8] transition-colors" />
    <div className="w-9 h-1 bg-white rounded-full group-hover:bg-[#b4a9f8] transition-colors" />
    <div className="w-5 h-1 bg-white rounded-full group-hover:bg-[#b4a9f8] transition-colors" />
  </button>
);

export default function StudentNavbar() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const currentItem = menuItems.find(item => item.path === pathname);
    if (currentItem) setActiveTab(currentItem.id);
  }, [pathname]);

  const sidebarVariants: Variants = {
    open: {
      x: 0,
      transition: { type: "tween", ease: "circOut", duration: 0.3, staggerChildren: 0.05, delayChildren: 0.1 }
    },
    closed: {
      x: "100%",
      transition: { type: "tween", ease: "circIn", duration: 0.25 }
    }
  };

  const itemVariants: Variants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: 20 }
  };

  return (
    <div className="bg-[#0f1113] text-white">
      <nav className="sticky top-4 flex items-center justify-between w-full h-20 px-6 bg-[#23262b]/90 backdrop-blur-xl border border-white/5 rounded-full z-50 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        
        {/* Left: Branding */}
        <Link href="/student" className="flex items-center gap-3 shrink-0 cursor-pointer">
          <div className="w-10 h-10 bg-[#b4a9f8] rounded-full flex items-center justify-center shadow-lg">
            <div className="border-2 border-black w-4 h-4 rounded-sm" />
          </div>
          <span className="text-xl font-bold tracking-tight">PlacementOS</span>
        </Link>

        {/* Middle: Desktop Nav Pill */}
        <div className="hidden lg:flex items-center gap-2 bg-[#1a1c20]/50 p-1 rounded-full border border-white/5">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.path}
              className={`relative flex items-center h-10 px-4 rounded-full transition-colors ${activeTab === item.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {activeTab === item.id && (
                <motion.div 
                  layoutId="tabBG" 
                  className="absolute inset-0 bg-black rounded-full" 
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} 
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <item.icon size={18} className={activeTab === item.id ? 'text-[#b4a9f8]' : ''} />
                {activeTab === item.id && <span className="text-sm font-semibold">{item.label}</span>}
              </span>
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-5">
            <div className="flex flex-col items-end">
              <h2 className="text-sm font-bold leading-none mb-1">Hello, Shubhayu</h2>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                <Zap size={10} className="text-[#b4a9f8] fill-[#b4a9f8]" />
                <span>CGPA 8.96</span>
              </div>
            </div>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-11 h-11 rounded-full border-2 border-[#b4a9f8] p-0.5 bg-[#d9d4fc] cursor-pointer"
            >
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Shubhayu" 
                className="rounded-full w-full h-full object-cover" 
                alt="User Avatar" 
              />
            </motion.div>

            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <Bell size={20} className="text-gray-300" />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#23262b] animate-pulse" />
            </motion.button>
          </div>

          <div className="lg:hidden">
            <ModernHamburger onClick={() => setIsSidebarOpen(true)} />
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.aside
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 h-full w-70 bg-[#1a1c20] z-[70] border-l border-white/10 p-8 shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center mb-12">
                <span className="text-xl font-bold tracking-tight">Menu</span>
                <button 
                  onClick={() => setIsSidebarOpen(false)} 
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={24} className="text-[#b4a9f8]" />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {menuItems.map((item) => (
                  <Link key={item.id} href={item.path} onClick={() => setIsSidebarOpen(false)}>
                    <motion.div
                      variants={itemVariants}
                      className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                        activeTab === item.id 
                          ? 'bg-[#b4a9f8] text-black font-bold scale-[1.02]' 
                          : 'bg-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      <item.icon size={20} />
                      <span className="text-lg">{item.label}</span>
                    </motion.div>
                  </Link>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-white/5">
                <div className="flex items-center gap-4 bg-black/20 p-4 rounded-2xl">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Shubhayu" className="w-10 h-10 rounded-full bg-[#d9d4fc]" alt="User" />
                    <div>
                        <p className="font-bold text-sm">Shubhayu</p>
                        <p className="text-[10px] text-[#b4a9f8] uppercase font-bold">CGPA 8.96</p>
                    </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}