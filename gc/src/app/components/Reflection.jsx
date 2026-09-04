'use client';

import { useState, useEffect } from 'react';
import { getNextQuestion } from '../../lib/questionManager';

const prompts = {
  fog: {
    title: "Fog",
    reflection: "Don't think about accuracy. Draw what comes to you first.",
  },
  isolation: {
    title: "Isolation",
    reflection: "Notice what remains outside the frame.",
  },
  immersion: {
    title: "Immersion",
    reflection: "It doesn't have to look real. Let the feeling guide the shape.",
  },
  exploration: {
    title: "Exploration",
    reflection: "Follow questions rather than answers.",
  },
  growth: {
    title: "Growth",
    reflection: "Transformation can be quiet.",
  },
};

export default function ReflectionPrompt({ phase, onQuestionSelected }) {
  const current = prompts[phase] || prompts.fog;

  // null on server, populated only after client mount — prevents hydration mismatch
  const [randomQuestion, setRandomQuestion] = useState(null);

  useEffect(() => {
    const question = getNextQuestion(phase);
    setRandomQuestion(question);

    if (question && onQuestionSelected) {
      onQuestionSelected(question);
    }
  }, [phase]);

  // Render nothing on the server / before mount
  if (!randomQuestion) {
    return (
      <div className="max-w-3xl text-center mb-10">
        <p className="text-gray-400 text-xl opacity-0">Loading...</p>
      </div>
    );
  }

  // All questions used up
  if (randomQuestion === 'exhausted') {
    return (
      <div className="max-w-3xl text-center mb-10">
        <p className="text-gray-400 text-xl">
          You've completed every reflection in this phase.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl text-center mb-10">

      <p className="uppercase tracking-[0.35em] text-gray-500 text-xs mb-4">
        {current.title}
      </p>

      <h2 className="text-4xl md:text-5xl font-light leading-relaxed text-white font-[family-name:var(--cormorant)]">
        {randomQuestion.text}
      </h2>

      <p className="mt-6 text-gray-400 leading-8 text-lg">
        {current.reflection}
      </p>

    </div>
  );
}