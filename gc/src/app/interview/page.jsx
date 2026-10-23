'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { createClient } from '@/lib/supabaseBrowser'

const SLIDES = [
  {
    id: 'q1',
    question: 'What is your age group?',
    type: 'choice',
    options: ['Under 18', '18–21', '22–25', '26–30', '31+'],
  },
  {
    id: 'q2',
    question: 'What is your area of profession / field of study?',
    type: 'text',
    placeholder: 'e.g., Computer Science, Fine Arts, Psychology, Engineering',
  },
  {
    id: 'q3',
    question: 'Do you consider yourself a self-aware or well-reflected person?',
    type: 'choice',
    options: ['Strongly agree', 'Somewhat agree', 'Neutral', 'Somewhat disagree', 'Strongly disagree'],
  },
  {
    id: 'q4',
    question: 'Have you ever faced a personal setback or loss that you feel significantly impacted your life?',
    type: 'choice',
    options: ['Yes', 'No', 'Prefer not to say'],
  },
  {
    id: 'q5',
    question: 'Do you feel that modern digital platforms allow you to express yourself authentically?',
    type: 'choice',
    options: ['Always', 'Frequently', 'Rarely', 'Never'],
  },
  {
    id: 'q6',
    question: 'Do you feel that mainstream apps provide a safe environment for expressing personal vulnerabilities?',
    type: 'choice',
    options: ['Strongly agree', 'Somewhat agree', 'Neutral', 'Somewhat disagree', 'Strongly disagree'],
  },
  {
    id: 'q7',
    question: 'What do you think about the concept of likes and comments on modern platforms?',
    type: 'textarea',
    placeholder: 'Share your thoughts on engagement metrics and social validation.',
  },
  {
    id: 'q8',
    question: 'Do you think people would express their vulnerability if proper anonymity is given?',
    type: 'choice',
    options: ['Yes, absolutely', 'Maybe, to some extent', 'No, not really', 'Not sure'],
  },
  {
    id: 'q9',
    question: 'Do you feel safe writing your emotions down on physical paper compared to screens?',
    type: 'choice',
    options: ['Much safer on paper', 'Somewhat safer on paper', 'No difference between paper and screens', 'Safer on screens'],
  },
  {
    id: 'q10',
    question: 'How would you rate modern tech overall when it comes to supporting the self-expression of human vulnerabilities?',
    type: 'choice',
    options: [
      '1 (Extremely Poor — purely metric-driven)',
      '2 (Poor)',
      '3 (Neutral)',
      '4 (Good)',
      '5 (Excellent — deeply supportive)',
    ],
  },
]

export default function InterviewPage() {
  const router = useRouter()
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const current = SLIDES[index]
  const isLast = index === SLIDES.length - 1
  const answer = answers[current.id] || ''

  const setAnswer = (value) => {
    setAnswers((prev) => ({ ...prev, [current.id]: value }))
  }

  const goNext = () => {
    if (!isLast) setIndex(index + 1)
  }

  const goBack = () => {
    if (index > 0) setIndex(index - 1)
  }

  const finish = async () => {
    if (isSaving) return

    setIsSaving(true)
    setSaveError('')
    const supabase = createClient()

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      if (!user) throw new Error('Please sign in again before submitting your answers.')

      const { error: answersError } = await supabase
        .from('interview_responses')
        .upsert(
          { user_id: user.id, answers, submitted_at: new Date().toISOString() },
          { onConflict: 'user_id' }
        )
      if (answersError) throw answersError

      const { error } = await supabase.auth.updateUser({
        data: { interview_completed: true },
      })
      if (error) {
        throw new Error(`Your answers were saved, but interview completion could not be updated: ${error.message}`)
      }

      const requestedNext = new URLSearchParams(window.location.search).get('next')
      const nextUrl = requestedNext?.startsWith('/') && !requestedNext.startsWith('//') && !requestedNext.startsWith('/\\')
        ? new URL(requestedNext, window.location.origin)
        : new URL('/theme', window.location.origin)
      router.replace(`${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`)
    } catch (error) {
      console.error('Failed to save interview responses:', error)
      setSaveError(error.message || 'Something went wrong while saving your answers. Please try again.')
      setIsSaving(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#111111] px-6 pb-12 pt-24 text-[#ededed]"
    >
      <section className="w-full max-w-2xl rounded-md border border-white/10 bg-[#191919] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <p className="text-sm text-gray-400">Question {index + 1} of {SLIDES.length}</p>
          <div className="flex gap-1" aria-label={`${index + 1} of ${SLIDES.length} questions`}>
            {SLIDES.map((slide, slideIndex) => (
              <span
                key={slide.id}
                className={`h-1 w-4 rounded-full ${slideIndex <= index ? 'bg-gray-200' : 'bg-white/15'}`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.2 }}
          >
            <h1 className="mb-8 min-h-16 text-2xl font-light leading-relaxed text-white">
              {current.question}
            </h1>

            {current.type === 'choice' ? (
              <div className="space-y-3">
                {current.options.map((option) => {
                  const isChecked = answer === option
                  return (
                    <label
                      key={option}
                      className={`flex cursor-pointer items-center gap-3 rounded border px-4 py-3 transition-colors ${isChecked ? 'border-white/40 bg-white/10' : 'border-white/10 bg-white/[0.02] hover:border-white/25'}`}
                    >
                      <input
                        type="radio"
                        name={current.id}
                        value={option}
                        checked={isChecked}
                        onChange={() => setAnswer(option)}
                        className="h-4 w-4 accent-white"
                      />
                      <span className="text-base font-light text-gray-200">{option}</span>
                    </label>
                  )
                })}
              </div>
            ) : current.type === 'text' ? (
              <input
                type="text"
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder={current.placeholder}
                className="w-full rounded border border-white/15 bg-white/[0.02] px-4 py-3 text-base font-light text-white placeholder:text-gray-500 focus:border-white/40 focus:outline-none"
              />
            ) : (
              <textarea
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder={current.placeholder}
                rows={5}
                className="w-full resize-y rounded border border-white/15 bg-white/[0.02] px-4 py-3 text-base font-light text-white placeholder:text-gray-500 focus:border-white/40 focus:outline-none"
              />
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex justify-between">
          <button
            onClick={goBack}
            disabled={index === 0}
            className="text-sm text-gray-400 transition-opacity hover:text-white disabled:opacity-20"
          >
            ← Back
          </button>

          {!isLast ? (
            <button
              onClick={goNext}
              className="rounded border border-white/25 px-6 py-2 text-sm transition-colors hover:bg-white hover:text-black"
            >
              Next
            </button>
          ) : (
            <button
              onClick={finish}
              disabled={isSaving}
              className="rounded border border-white/25 px-6 py-2 text-sm transition-colors hover:bg-white hover:text-black disabled:cursor-wait disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Finish'}
            </button>
          )}
        </div>
        {saveError && (
          <p role="alert" className="mt-4 text-sm text-red-300">
            {saveError}
          </p>
        )}
      </section>
    </div>
  )
}