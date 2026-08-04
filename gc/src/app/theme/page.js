'use client'
import { useRouter } from "next/navigation";
import { motion } from 'framer-motion'
import StarParticles from '../components/StarParticles'
import Botanical from '../components/Botanical'

const phases = [
  {
    id: 'fog',
    name: 'Fog',
    description: 'Nothing feels clear. Even ordinary things seem unfamiliar.',
    icon: '◌',
  },
  {
    id: 'isolation',
    name: 'Isolation',
    description: 'Some grief is carried quietly, where no one else can reach.',
    icon: '□',
  },
  {
    id: 'immersion',
    name: 'Immersion',
    description: 'Memories return again and again, asking to be felt.',
    icon: '≈',
  },
  {
    id: 'exploration',
    name: 'Exploration',
    description: 'Questions appear where answers once seemed certain.',
    icon: '◇',
  },
  {
    id: 'growth',
    name: 'Growth',
    description: 'Grief remains, but it has begun to change its shape.',
    icon: '⟰',
  },
]

export default function Theme() {
  const router = useRouter();
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center relative overflow-hidden px-8 pt-16">

      {/* Floating particles */}
      <StarParticles />

      {/* Background glow */}
      <div className="absolute w-[700px] h-[400px] rounded-full bg-white opacity-[0.04] blur-[100px] z-0" />

      <div className="relative z-10 flex flex-col items-center max-w-7xl">

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="text-white text-4xl font-cursive tracking-wide mb-16 text-center"
        >
          Where does your grief wish to begin?
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.3 }}
          className="text-gray-400 text-center max-w-2xl leading-7 mb-24"
        >
          Reflection begins in different places. Choose the space that feels
          closest to you today. There is no correct place to begin.
        </motion.p>

        {/* Phase cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-10 justify-items-center">
      {phases.map((phase, index) => (
        <motion.div
          key={phase.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: index * 0.2 }}
          onClick={() => router.push(`/express?phase=${phase.id}`)}
          className={`border border-gray-700 rounded-xl p-6 w-full flex flex-col items-center text-center cursor-pointer transition-all duration-500 hover:border-gray-300 hover:bg-[#161616] hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]
          ${index === 4 ? 'col-span-2 lg:col-span-1' : ''}
        `}
        >
          <span className="text-5xl text-gray-300 mb-6">{phase.icon}</span>
          <h2 className="text-white text-xl tracking-wide mb-4">{phase.name}</h2>
          <p className="text-gray-400 text-sm leading-6">{phase.description}</p>
        </motion.div>
      ))}
    </div>
      {/* Gallery button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1.2 }}
          className="mt-8"
        >
          <button
            onClick={() => router.push('/gallery')}
            className="px-6 py-2.5 border border-gray-700 rounded-full text-gray-400 hover:text-white hover:border-gray-400 transition text-sm tracking-widest"
          >
            View Gallery
          </button>
        </motion.div>
        {/* Bottom line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1.5 }}
          className="mt-16 text-gray-400 text-xl font-[family-name:var(--font-dancing)]"
        >
          Begin where your heart finds itself today.
        </motion.p>

        <Botanical />

      </div>
    </main>
  )
}