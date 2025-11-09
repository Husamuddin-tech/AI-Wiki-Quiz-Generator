import React, { useState } from 'react';
import { IconPuzzle, IconHistory, IconBrandWikipedia, IconBrain } from '@tabler/icons-react';
import GenerateQuizTab from './tabs/GenerateQuizTab';
import HistoryTab from './tabs/HistoryTab';

export default function App() {
  const [tab, setTab] = useState('gen');

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#5B5E7A] relative overflow-hidden">

      {/* Background glowing icons */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <IconBrain size={200} className="text-[#6E7DA2]/20 animate-pulse absolute" />
        <IconBrandWikipedia size={200} className="text-[#A7BFD9]/20 animate-pulse absolute" />
      </div>

      {/* Navbar */}
      <header className="bg-[#C7C9E2] shadow-md z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center py-4 px-4 sm:px-6 gap-3 sm:gap-0">
          <h1 className="text-xl sm:text-2xl font-bold text-[#5B5E7A] flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <IconBrain size={28} className="text-[#6E7DA2]" />
            AI Wiki Quiz Generator
          </h1>
          <nav className="flex gap-2 sm:gap-4 flex-wrap justify-center">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-300 transform ${
                tab === 'gen'
                  ? 'bg-[#A7BFD9] text-white shadow-lg scale-105'
                  : 'hover:bg-[#6E7DA2]/30 hover:scale-105'
              }`}
              onClick={() => setTab('gen')}
            >
              <IconPuzzle size={20} /> Generate Quiz
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-300 transform ${
                tab === 'hist'
                  ? 'bg-[#A7BFD9] text-white shadow-lg scale-105'
                  : 'hover:bg-[#6E7DA2]/30 hover:scale-105'
              }`}
              onClick={() => setTab('hist')}
            >
              <IconHistory size={20} /> Past Quizzes
            </button>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 z-10 relative">
        {tab === 'gen' ? <GenerateQuizTab /> : <HistoryTab />}
      </main>

      {/* Footer */}
      <footer className="bg-[#C7C9E2] py-4 text-center text-[#5B5E7A] text-sm z-10 relative">
        &copy; {new Date().getFullYear()} AI Wiki Quiz Generator. All rights reserved.
      </footer>
    </div>
  );
}
