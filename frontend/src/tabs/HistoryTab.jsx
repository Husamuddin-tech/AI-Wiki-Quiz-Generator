import { useEffect, useState } from 'react';
import { fetchQuiz, listHistory } from '../services/api';
import HistoryTable from '../components/HistoryTable';
import Modal from '../components/Modal';
import QuizDisplay from '../components/QuizDisplay';

const Spinner = () => (
  <div className="flex justify-center items-center h-40">
    <div className="w-10 h-10 border-4 border-[#6E7DA2] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="bg-[#F8F9FA] border border-red-400 text-red-700 p-4 rounded-md shadow-sm">
    <p className="font-semibold">Error</p>
    <p>{message}</p>
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
        setError(null);
        setRows(await listHistory());
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
      setError(null);
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
    setError(null);
  };

  if (loading) return <Spinner />;
  if (!loading && error && rows.length === 0) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#5B5E7A]">Quiz History</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map((row) => (
          <div
            key={row.id}
            className="bg-[#C7C9E2] p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer flex justify-between items-center"
          >
            <div>
              <h3 className="text-[#5B5E7A] font-semibold">{row.title}</h3>
              <p className="text-[#6E7DA2] text-sm">
                {new Date(row.date_generated).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => onDetails(row.id)}
              className="px-3 py-1 rounded-md bg-[#A7BFD9] text-white hover:bg-[#6E7DA2] transition-colors text-sm font-medium"
            >
              Details
            </button>
          </div>
        ))}
      </div>

      <div className="hidden">
        {/* Optional table view */}
        <HistoryTable rows={rows} onDetails={onDetails} />
      </div>

      <Modal open={open} onClose={onCloseModal} title={curr?.title || 'Quiz Details'}>
        {modalLoading ? (
          <Spinner />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : curr ? (
          <QuizDisplay data={curr} takeMode={false} />
        ) : null}
      </Modal>
    </div>
  );
}
