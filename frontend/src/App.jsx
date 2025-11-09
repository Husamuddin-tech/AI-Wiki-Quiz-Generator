import React, { useState } from 'react';
import { IconPuzzle, IconHistory } from '@tabler/icons-react';
import GenerateQuizTab from './tabs/GenerateQuizTab';
import HistoryTab from './tabs/HistoryTab';

export default function App() {
  const [tab, setTab] = useState('gen');

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#5B5E7A]">
      {/* Navbar */}
      <header className="bg-[#C7C9E2] shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
          <h1 className="text-2xl font-bold text-[#5B5E7A]">
            AI Wiki Quiz Generator
          </h1>
          <nav className="flex gap-4">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                tab === 'gen'
                  ? 'bg-[#A7BFD9] text-white'
                  : 'hover:bg-[#6E7DA2]/30'
              }`}
              onClick={() => setTab('gen')}
            >
              <IconPuzzle size={20} /> Generate Quiz
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                tab === 'hist'
                  ? 'bg-[#A7BFD9] text-white'
                  : 'hover:bg-[#6E7DA2]/30'
              }`}
              onClick={() => setTab('hist')}
            >
              <IconHistory size={20} /> Past Quizzes
            </button>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8">
        {tab === 'gen' ? <GenerateQuizTab /> : <HistoryTab />}
      </main>

      {/* Footer */}
      <footer className="bg-[#C7C9E2] py-4 text-center text-[#5B5E7A] text-sm">
        &copy; {new Date().getFullYear()} AI Wiki Quiz Generator. All rights reserved.
      </footer>
    </div>
  );
}
