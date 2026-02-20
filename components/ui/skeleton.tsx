"use client"
import { motion } from "framer-motion"

interface SkeletonProps {
  className?: string
  variant?: "rect" | "circle" | "rounded"
}

export default function Skeleton({ className, variant = "rect" }: SkeletonProps) {
  // Define base shapes
  const variantClasses = {
    rect: "",
    circle: "rounded-full",
    rounded: "rounded-[20px]",
  }

  return (
    <div className={`relative overflow-hidden bg-gray-300 ${variantClasses[variant]} ${className}`}>
      {/* The Shimmer Effect */}
      <motion.div
        className="absolute inset-0"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          repeat: Infinity,
          duration: 1.6,
          ease: "linear",
        }}
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
        }}
      />
    </div>
  )
}