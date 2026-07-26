'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function Gallery() {
  const router = useRouter();
  const [drawings, setDrawings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
  async function fetchDrawings() {
    const sessionId = typeof window !== 'undefined'
      ? localStorage.getItem('gc_session_id')
      : null;

    let query = supabase
      .from('drawings')
      .select('*')
      .order('created_at', { ascending: false });

    if (sessionId) {
      query = query.neq('session_id', sessionId);
    }

    const { data, error } = await query;
    if (!error) setDrawings(data);
    setLoading(false);
  }

  fetchDrawings();
}, []);

  // Split into 3 columns for masonry
  const columns = [[], [], []];
  drawings.forEach((drawing, i) => {
    columns[i % 3].push(drawing);
  });

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10">

      {/* Header */}
      <div className="w-full max-w-6xl mx-auto flex justify-between items-center mb-12">
        <button
          onClick={() => router.push('/')}
          className="text-gray-500 hover:text-white transition"
        >
          ← Back
        </button>
        <h1 className="text-sm tracking-[0.35em] text-gray-500 uppercase">
          The Gallery
        </h1>
        <div className="w-16" /> {/* spacer */}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600 tracking-widest text-sm animate-pulse">
            gathering grief...
          </p>
        </div>
      )}

      {/* Empty state */}
      {!loading && drawings.length === 0 && (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600 text-lg">
            No drawings yet. Be the first.
          </p>
        </div>
      )}

      {/* Masonry grid */}
      {!loading && drawings.length > 0 && (
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4 items-start">
          {columns.map((col, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-4">
              {col.map((drawing, i) => (
                <motion.div
                  key={drawing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 + colIndex * 0.02 }}
                  onClick={() => setSelected(drawing)}
                  className="group relative cursor-pointer rounded-xl overflow-hidden border border-gray-800 hover:border-gray-600 transition"
                >
                  <img
                    src={drawing.image_url}
                    alt={drawing.question_text}
                    className="w-full object-cover"
                  />

                  {/* Prompt overlay on hover */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white text-sm font-light leading-relaxed">
                      {drawing.question_text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox — click to expand */}
      {selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelected(null)}
          className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-[#111111] border border-gray-700 rounded-2xl overflow-hidden"
          >
            <img
              src={selected.image_url}
              alt={selected.question_text}
              className="w-full object-cover"
            />

            <div className="p-6 flex flex-col gap-2">
              <p className="text-white font-light text-lg leading-relaxed">
                {selected.question_text}
              </p>
              <p className="text-gray-600 text-xs tracking-widest uppercase mt-1">
                {new Date(selected.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black transition text-sm"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}

    </main>
  );
}