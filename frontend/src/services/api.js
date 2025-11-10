const BASE_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:8000'
).replace(/\/+$/, '');

const DEFAULT_HEADERS = { 'Content-Type': 'application/json' };

// Utility to handle fetch with timeout
async function fetchWithTimeout(url, options = {}, timeout = 60000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  options.signal = controller.signal;

  try {
    const res = await fetch(url, options);
    clearTimeout(id);

    let data;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    if (!res.ok) {
      const errMsg = data?.detail || res.statusText || 'Request failed';
      throw new Error(errMsg);
    }
    return data;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw err;
  }
}

export async function generateQuiz(url, force = false) {
  return await fetchWithTimeout(`${BASE_URL}/generate_quiz`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ url, force }),
  });
}

export async function listHistory() {
  return await fetchWithTimeout(`${BASE_URL}/history`);
}

export async function fetchQuiz(id) {
  return await fetchWithTimeout(`${BASE_URL}/quiz/${id}`);
}
