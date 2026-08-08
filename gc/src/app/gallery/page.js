'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { fetchOtherDrawings } from '@/lib/saveDrawing'
import { useRouter } from "next/navigation";

const BUBBLE_SIZES = [180, 220, 150, 260, 190, 230]

function floatAnimation(index) {
  const duration = 8 + (index % 5) * 1.5
  const delay = (index % 4) * 0.6
  const drift = 12 + (index % 3) * 6
  return {
    y: [0, -drift, 0, drift * 0.6, 0],
    x: [0, drift * 0.4, 0, -drift * 0.3, 0],
    transition: {
      duration,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  }
}

export default function Gallery() {
  const [drawings, setDrawings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectDrawing, setSelectDrawing] = useState(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true
    fetchOtherDrawings().then((res) => {
      if (mounted && res.success) setDrawings(res.drawings)
      if (mounted) setLoading(false)
    })
    return () => {
      mounted = false
    }
  }, [])

  return (
          <> {selectDrawing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-8"
          onClick={() => setSelectDrawing(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.3 }}
            className="relative flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectDrawing(null)}
              className="absolute -top-12 right-0 text-gray-400 hover:text-white text-2xl transition-colors"
            >
              ×
            </button>

            {/* Expanded drawing */}
            <div className="w-[min(75vw,600px)] h-[min(75vw,600px)] rounded-full overflow-hidden border border-white/20 bg-white/[0.02] shadow-[0_0_80px_rgba(255,255,255,0.06)]">
              <img
                src={selectDrawing.image_url}
                alt=""
                className="w-full h-full object-contain"
              />
            </div>

            {/* Question */}
            {selectDrawing.question_text && (
              <p className="mt-6 text-center text-gray-400 text-sm max-w-md leading-relaxed">
                {selectDrawing.question_text}
              </p>
            )}
          </motion.div>
        </div>
      )}
    <main className="min-h-screen bg-[#0a0a0a] relative overflow-hidden py-24 px-6">
      {/* Ambient fog — same device as the landing page, second one in sage */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[400px] rounded-full bg-white opacity-[0.05] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[350px] rounded-full bg-[#7fb8a3] opacity-[0.06] blur-[110px] pointer-events-none" />
      <div className="w-full max-w-5xl flex justify-between items-center mb-10">
        <button
          onClick={() => router.push("/theme")}
          className="ml-8 text-gray-500 hover:text-white transition-colors"
        >
          ← Back
        </button>
      </div>

      <h1 className="relative z-10 text-center text-white text-3xl font-light tracking-widest mb-2">
        Others, Still Here
      </h1>
      <p className="relative z-10 text-center text-gray-500 text-xl mb-16 font-[family-name:var(--font-dancing)]">
        what they let go of
      </p>

      {loading ? (
        <p className="relative z-10 text-center text-gray-600 text-sm">
          gathering fragments…
        </p>
      ) : drawings.length === 0 ? (
        <p className="relative z-10 text-center text-gray-600 text-sm">
          nothing has drifted here yet
        </p>
      ) : (
        <div className="relative z-10 flex flex-wrap justify-center items-start gap-x-8 gap-y-16 max-w-5xl mx-auto">
          {drawings.map((d, i) => {
            const size = BUBBLE_SIZES[i % BUBBLE_SIZES.length]
            return (
              <motion.div
                key={d.id}
                animate={floatAnimation(i)}
                className="flex flex-col items-center"
                style={{ width: size }}
              >
                <div
                 onClick={() => setSelectDrawing(d)}
                  className="rounded-full overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.04)] bg-white/[0.02] backdrop-blur-sm"
                  style={{ width: size, height: size }}
                >
                  <img
                    src={d.image_url}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </div>
                {d.question_text && (
                  <p className="mt-3 text-center text-gray-500 text-xs leading-snug max-w-[85%]">
                    {d.question_text}
                  </p>
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </main>
    </>
  )
}