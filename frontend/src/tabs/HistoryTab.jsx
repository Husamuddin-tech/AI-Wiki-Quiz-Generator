import { useEffect, useState } from 'react';
import { IconClipboardList, IconClock, IconBook, IconInfoCircle } from '@tabler/icons-react';
import { fetchQuiz, listHistory } from '../services/api';
import Modal from '../components/Modal';
import QuizDisplay from '../components/QuizDisplay';

const Spinner = () => (
  <div className="flex justify-center items-center h-40">
    <div className="w-10 h-10 border-4 border-[#6E7DA2] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function HistoryTab() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [curr, setCurr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await listHistory();
        setRows(data);
      } catch (e) {
        console.error(e);
        setError(e.message || 'Failed to fetch history.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onDetails = async (id) => {
    try {
      setOpen(true);
      setModalLoading(true);
      setCurr(null);
      const data = await fetchQuiz(id);
      setCurr(data);
    } catch (e) {
      console.error(e);
      setError(e.message || 'Failed to fetch quiz details.');
    } finally {
      setModalLoading(false);
    }
  };

  const onCloseModal = () => {
    setOpen(false);
    setCurr(null);
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded-md flex items-center gap-2">
          <IconBook size={20} /> {error}
        </div>
      )}

      <h2 className="text-2xl font-bold text-[#5B5E7A] flex items-center gap-2">
        <IconClipboardList size={24} /> Quiz History
      </h2>

      {rows.length === 0 && (
        <div className="text-[#5B5E7A]/70 text-center py-10 flex flex-col items-center gap-2">
          <IconInfoCircle size={32} /> No past quizzes found.
        </div>
      )}

      {/* Quiz Cards */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rows.map((row) => (
          <div
            key={row.id}
            className="relative bg-linear-to-br from-[#C7C9E2]/80 to-[#A7BFD9]/80 p-5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between gap-4 group"
          >
            <div className="flex flex-col gap-2">
              <h3 className="text-[#5B5E7A] font-semibold flex items-center gap-2">
                <IconClipboardList size={18} className="text-[#6E7DA2]" /> {row.title}
              </h3>
              <p className="text-[#6E7DA2] text-sm flex items-center gap-1">
                <IconClock size={16} /> {new Date(row.date_generated).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => onDetails(row.id)}
              className="mt-auto px-4 py-2 rounded-lg bg-[#6E7DA2] text-white font-medium text-sm hover:bg-[#A7BFD9] shadow-sm transform transition-transform duration-300 group-hover:scale-105 flex items-center justify-center gap-2"
            >
              <IconInfoCircle size={16} /> View Details
            </button>
            {/* subtle glowing effect */}
            <span className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"></span>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal open={open} onClose={onCloseModal} title={curr?.title || 'Quiz Details'}>
        {modalLoading ? <Spinner /> : curr ? <QuizDisplay data={curr} takeMode={false} /> : null}
      </Modal>
    </div>
  );
}
