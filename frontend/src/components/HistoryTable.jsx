import React from 'react';

export default function HistoryTable({ rows, onDetails }) {
  return (
    <div className="overflow-x-auto bg-[#F8F9FA] p-4 rounded-lg shadow-md">
      {/* Table Header */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-[#5B5E7A]">Past Quizzes</h3>
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
            {rows.map((r) => (
              <tr
                key={r.id}
                className="bg-[#A7BFD9] hover:bg-[#6E7DA2] text-white transition-colors"
              >
                <td className="px-4 py-2">{r.id}</td>
                <td className="px-4 py-2 font-medium">{r.title}</td>
                <td className="px-4 py-2 wrap-break-word">{r.url}</td>
                <td className="px-4 py-2">
                  {new Date(r.date_generated).toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => onDetails(r.id)}
                    className="px-3 py-1 rounded-md bg-[#5B5E7A] hover:bg-[#6E7DA2] transition-colors text-sm font-medium"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
