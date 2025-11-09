import React from 'react';
import { IconInfoCircle, IconClock } from '@tabler/icons-react';

export default function HistoryTable({ rows, onDetails }) {
  return (
    <div className="overflow-x-auto bg-[#F8F9FA] p-4 rounded-lg shadow-md">
      {/* Table Header */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h3 className="text-xl font-semibold text-[#5B5E7A] flex items-center gap-2">
          <IconClock size={20} /> Past Quizzes
        </h3>
        <p className="text-sm text-[#6E7DA2]">
          Total quizzes: {rows.length}
        </p>
      </div>

      <div className="min-w-full">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-[#C7C9E2] text-[#5B5E7A]">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">URL</th>
              <th className="px-4 py-2 text-left">Generated</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-[#5B5E7A]">
                  No quizzes found.
                </td>
              </tr>
            ) : (
              rows.map((r, index) => (
                <tr
                  key={r.id}
                  className={`transition-all duration-300 ${
                    index % 2 === 0 ? 'bg-[#E0E4F1]' : 'bg-[#C7C9E2]/90'
                  } hover:bg-[#A7BFD9]/80`}
                >
                  <td className="px-4 py-2 font-medium">{r.id}</td>
                  <td className="px-4 py-2 font-semibold text-[#5B5E7A]">{r.title}</td>
                  <td className="px-4 py-2 text-sm break-all max-w-[200px] truncate" title={r.url}>
                    {r.url}
                  </td>
                  <td className="px-4 py-2 text-sm flex items-center gap-1">
                    <IconClock size={16} /> {new Date(r.date_generated).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => onDetails(r.id)}
                      className="flex items-center gap-1 px-3 py-1 rounded-md bg-[#5B5E7A] hover:bg-[#6E7DA2] text-white text-sm font-medium shadow-sm transition-all transform hover:scale-105"
                    >
                      <IconInfoCircle size={16} /> Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Responsive note for small screens */}
      <p className="text-xs text-[#6E7DA2] mt-2 sm:hidden">
        Swipe horizontally to view full table on small screens.
      </p>
    </div>
  );
}
