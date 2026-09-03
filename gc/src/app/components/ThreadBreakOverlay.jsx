"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";


export default function ThreadBreakOverlay({ onComplete }) {
  const hasPlayed = useRef(false);

  useEffect(() => {
    if (hasPlayed.current) return;
    hasPlayed.current = true;
    
  }, []);

  return (
    <motion.div
      key="thread-break-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-[#0a0a0a]"
    >
      <svg viewBox="0 0 400 400" className="w-72 h-72" xmlns="http://www.w3.org/2000/svg">
        {/* Left half of thread */}
        <motion.path
          d="M 40 200 Q 120 180 200 200"
          stroke="#F4A340"
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          animate={{ x: -60, y: 40, rotate: -30, opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        />

        {/* Right half of thread */}
        <motion.path
          d="M 200 200 Q 280 220 360 200"
          stroke="#F4A340"
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          animate={{ x: 60, y: -40, rotate: 30, opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          onAnimationComplete={onComplete}
        />

        {/* Snap flash at break point */}
        <motion.circle
          cx={200}
          cy={200}
          r={4}
          fill="#F4A340"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 3, 0.5] }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </svg>
    </motion.div>
  );
}