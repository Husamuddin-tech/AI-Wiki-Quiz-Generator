import { useState } from 'react';
import { generateQuiz } from '../services/api';
import QuizDisplay from '../components/QuizDisplay';

export default function GenerateQuizTab() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [takeMode, setTakeMode] = useState(true);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!/^https?:\/\/.+/.test(url)) {
      setError('Please enter a valid URL starting with http(s)');
      return;
    }
    setLoading(true);
    try {
      const res = await generateQuiz(url);
      setData(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={onSubmit} className="bg-[#C7C9E2] p-6 rounded-lg shadow-md flex flex-col gap-4">
        <label className="text-[#5B5E7A] font-semibold">Wikipedia URL</label>
        <input
          className="p-3 rounded-md border border-[#6E7DA2] focus:outline-none focus:ring-2 focus:ring-[#A7BFD9] bg-[#F8F9FA] text-[#5B5E7A]"
          placeholder="https://en.wikipedia.org/wiki/India"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <div className="flex items-center justify-between gap-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-md font-medium text-white transition-colors ${
              loading ? 'bg-[#6E7DA2]/70 cursor-not-allowed' : 'bg-[#A7BFD9] hover:bg-[#6E7DA2]'
            }`}
          >
            {loading ? 'Generating…' : 'Generate Quiz'}
          </button>
          <label className="flex items-center gap-2 text-[#5B5E7A] font-medium">
            <input
              type="checkbox"
              checked={takeMode}
              onChange={(e) => setTakeMode(e.target.checked)}
              className="w-4 h-4 accent-[#A7BFD9]"
            />
            Take Quiz mode
          </label>
        </div>
        {error && <div className="text-red-600 font-medium">{error}</div>}
      </form>

      <div className="bg-[#F8F9FA] rounded-lg p-6 shadow-inner min-h-[150px]">
        {data ? (
          <QuizDisplay data={data} takeMode={takeMode} />
        ) : (
          <div className="text-[#6E7DA2] font-medium">
            Enter a Wikipedia URL above to generate a quiz.
          </div>
        )}
      </div>
    </div>
  );
}
