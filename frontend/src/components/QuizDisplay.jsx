import React, { useMemo, useState } from 'react';

export default function QuizDisplay({ data, takeMode = true }) {
  const quiz = useMemo(() => data?.quiz || [], [data?.quiz]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(() => {
    let s = 0;
    for (const [idx, q] of quiz.entries()) {
      if (answers[idx] === q.answer) s++;
    }
    return s;
  }, [answers, quiz]);

  const processedQuiz = useMemo(() => {
    if (!quiz || quiz.length === 0) return [];
    return quiz.map((q) => {
      const shuffledOptions = [...q.options];
      for (let i = shuffledOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
      }
      return { ...q, options: shuffledOptions };
    });
  }, [quiz]);

  const submitQuiz = () => setSubmitted(true);
  const resetQuiz = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const isReviewMode = !takeMode || (takeMode && submitted);

  return (
    <div className="space-y-6 text-[#5B5E7A]">
      {/* Header */}
      {isReviewMode && (
        <header className="space-y-2 p-4 bg-[#F8F9FA] rounded-lg shadow-md border border-[#C7C9E2]">
          <h2 className="text-2xl font-bold text-[#6E7DA2]">{data?.title}</h2>
          <p className="text-sm md:text-base text-[#6E7DA2]">{data?.summary}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {data?.sections?.map((s, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-[#A7BFD9]/30 text-[#6E7DA2] rounded-full text-xs font-medium"
              >
                {s}
              </span>
            ))}
          </div>
        </header>
      )}

      {/* Quiz Questions */}
      <section className="space-y-6">
        {processedQuiz.map((q, i) => (
          <article
            key={i}
            className="p-4 bg-[#F8F9FA] rounded-lg shadow-sm space-y-3 border border-[#C7C9E2]"
          >
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg md:text-xl text-[#5B5E7A]">
                Q{i + 1}. {q.question}
              </h3>
              <span className="text-xs md:text-sm px-2 py-1 bg-[#C7C9E2]/30 text-[#5B5E7A] rounded-full">
                {q.difficulty}
              </span>
            </div>

            <ul className="space-y-2">
              {q.options.map((opt, k) => (
                <li key={k}>
                  {takeMode && !submitted ? (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`q-${i}`}
                        value={opt}
                        checked={answers[i] === opt}
                        onChange={() => setAnswers((a) => ({ ...a, [i]: opt }))}
                        className="accent-[#A7BFD9]"
                      />
                      <span>{opt}</span>
                    </label>
                  ) : (
                    <div
                      className={`px-3 py-2 rounded-xl border ${
                        opt === q.answer
                          ? 'border-[#6E7DA2] bg-[#A7BFD9]/20 text-[#6E7DA2] font-medium'
                          : answers[i] === opt
                          ? 'border-[#5B5E7A] bg-[#C7C9E2]/20 text-[#5B5E7A]'
                          : 'border-[#C7C9E2]'
                      }`}
                    >
                      {opt}
                      {isReviewMode && opt === q.answer && (
                        <span className="ml-2 font-semibold">(Correct)</span>
                      )}
                      {isReviewMode && answers[i] === opt && opt !== q.answer && (
                        <span className="ml-2 font-semibold">(Your Answer)</span>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {isReviewMode && (
              <p className="text-sm text-[#5B5E7A] mt-2">
                <b>Answer:</b> {q.answer}
                <br />
                <b>Explanation:</b> {q.explanation}
              </p>
            )}
          </article>
        ))}
      </section>

      {/* Footer */}
      {takeMode && (
        <footer className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 bg-[#F8F9FA] rounded-lg shadow-inner border border-[#C7C9E2]">
          <button
            onClick={submitted ? resetQuiz : submitQuiz}
            className="px-4 py-2 bg-[#A7BFD9] text-[#5B5E7A] font-semibold rounded-lg hover:bg-[#6E7DA2] transition-colors"
          >
            {submitted ? 'Retake Quiz' : 'Submit'}
          </button>

          <div className="text-[#6E7DA2] font-medium">
            {submitted ? `Score: ${score} / ${quiz.length}` : 'Submit to see Result'}
          </div>

          {submitted ? (
            <div className="text-[#5B5E7A] font-semibold">Quiz Complete!</div>
          ) : (
            <div className="text-[#5B5E7A]/70">Select your answers above.</div>
          )}
        </footer>
      )}

      {/* Related Topics */}
      {data?.related_topics?.length && (
        <aside className="p-4 bg-[#F8F9FA] rounded-lg space-y-2 border border-[#C7C9E2]">
          <h4 className="font-semibold text-[#6E7DA2] mb-2">
            Related Wikipedia topics
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.related_topics.map((t, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-[#A7BFD9]/30 text-[#6E7DA2] rounded-full text-xs font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        </aside>
      )}
    </div>
  );
}
