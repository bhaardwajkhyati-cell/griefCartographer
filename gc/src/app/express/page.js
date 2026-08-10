'use client';

import { useState, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { markQuestionAsUsed } from "../../lib/questionManager";
import DrawingCanvas from "../components/DrawingCanvas";
import ReflectionPrompt from "../components/Reflection";
import { saveDrawing } from '../../lib/saveDrawing';


function ExpressContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const canvasRef = useRef(null);

  const phase = searchParams.get("phase") || "fog";

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleContinue = () => {
    if (!selectedQuestion) return;
    setShowPopup(true);
  };

  const handleRelease = async () => {
    if (isSaving) return;
    setIsSaving(true);

    const result = await saveDrawing({
      canvasRef,
      phase,
      question: selectedQuestion,
    });

    if (result.success) {
      markQuestionAsUsed(selectedQuestion.id);
      setShowPopup(false);
      router.push('/gallery');
    } else {
      alert('Something went wrong saving your drawing. Please try again.');
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center px-8 py-10">

      {/* Header */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-10">
        <button
          onClick={() => router.push("/theme")}
          className="text-gray-500 hover:text-white transition"
        >
          ← Back
        </button>

        <button
          onClick={() => router.push('/gallery')}
          className="px-6 py-2.5 border border-gray-700 rounded-full text-gray-400 hover:text-white hover:border-gray-400 transition text-sm tracking-widest"
          > View gallery 
        </button>
      </div>

      {/* Reflection Question */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex justify-center"
      >
        <ReflectionPrompt
          phase={phase}
          onQuestionSelected={setSelectedQuestion}
        />
      </motion.div>

      {/* Drawing Canvas */}
      <DrawingCanvas canvasRef={canvasRef} />

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        className="mt-10 px-8 py-3 border border-gray-600 rounded-full hover:bg-white hover:text-black transition"
      >
        Continue →
      </button>

      {/* Release confirmation popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            key="popup-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              key="popup-card"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="mx-4 max-w-md w-full bg-[#111111] border border-gray-700 rounded-2xl p-8 flex flex-col items-center gap-6 text-center"
            >
              <h2 className="text-white text-xl font-light tracking-wide leading-relaxed">
                Once your drawing get Released you would not be able edit this and this drawing will be seen by everyone except you , without harming your privacy.
              </h2>

              <p className="text-gray-500 leading-relaxed" style={{ fontFamily: 'var(--font-dancing)', fontSize: '1.5rem' }}>
                just like in life we dont get anything back..
              </p>

              <div className="flex gap-3 mt-2 w-full">
                <button
                  onClick={() => setShowPopup(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-600 rounded-full text-gray-400 hover:text-white hover:border-gray-400 transition text-sm"
                >
                  Go back
                </button>
                <button
                  onClick={handleRelease}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2.5 bg-white text-black rounded-full hover:bg-gray-200 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Releasing...' : 'Release'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}

export default function Express() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
      <ExpressContent />
    </Suspense>
  );
}