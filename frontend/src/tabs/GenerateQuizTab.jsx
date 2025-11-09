import { useState } from 'react';
import { IconBrandWikipedia } from '@tabler/icons-react';
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
    <div className="space-y-6 relative">

      {/* Form */}
      <form
        onSubmit={onSubmit}
        className="flex flex-col sm:flex-row items-start sm:items-end gap-4 bg-[#C7C9E2]/30 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-500 animate-fade-in relative"
      >
        {/* URL Input */}
        <div className="flex-1 w-full">
          <label className=" mb-2 font-medium text-[#5B5E7A] flex items-center gap-2">
            <IconBrandWikipedia size={20} /> Wikipedia URL
          </label>
          <input
            type="url"
            className="w-full p-2 rounded-md border border-[#6E7DA2] focus:outline-none focus:ring-2 focus:ring-[#A7BFD9] focus:shadow-md transition-all duration-300"
            placeholder="https://en.wikipedia.org/wiki/India"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        {/* Buttons & Toggle */}
        <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">

          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 bg-[#A7BFD9] text-white font-semibold rounded-lg w-full sm:w-auto 
              hover:bg-[#6E7DA2]/80 hover:scale-105 transition-all duration-300 shadow-md
              ${loading ? 'cursor-not-allowed opacity-70 animate-pulse' : ''}
            `}
          >
            {loading ? 'Generating…' : 'Generate Quiz'}
          </button>

          {/* Toggle Switch */}
          <div className="flex items-center gap-2">
            <span className="text-[#5B5E7A] font-medium select-none">Take Quiz mode</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={takeMode}
                onChange={(e) => setTakeMode(e.target.checked)}
              />
              <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#A7BFD9] rounded-full peer peer-checked:bg-[#A7BFD9] transition-colors duration-300"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 peer-checked:translate-x-6"></div>
            </label>
          </div>
        </div>

        {error && <div className="text-red-600 mt-2">{error}</div>}
      </form>

      {/* Quiz Display */}
      <div className={`transition-opacity duration-500 ${data ? 'opacity-100 animate-fade-in' : 'opacity-0'}`}>
        {data ? (
          <QuizDisplay data={data} takeMode={takeMode} />
        ) : (
          <div className="text-[#5B5E7A]/70 mt-6 text-center">
            Enter a Wikipedia URL above to generate a quiz.
          </div>
        )}
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease forwards;
        }
      `}</style>

    </div>
  );
}
