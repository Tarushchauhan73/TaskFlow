const RAW_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/todos';
const API_BASE = RAW_API_URL.replace(/\/todos\/?$/, '');
const TODOS_URL = `${API_BASE}/todos`;
const AUTH_URL = `${API_BASE}/auth`;

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(res) {
  if (res.status === 401) {
    const err = new Error('Session expired. Please log in again.');
    err.status = 401;
    throw err;
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Request failed');
  }
  return res.json();
}

export async function register(email, password) {
  const res = await fetch(`${AUTH_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

export async function login(email, password) {
  const res = await fetch(`${AUTH_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

export async function getTodos(token) {
  const res = await fetch(TODOS_URL, { headers: authHeaders(token) });
  return handleResponse(res);
}

export async function addTodo(title, token) {
  const res = await fetch(TODOS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify({ title }),
  });
  return handleResponse(res);
}

export async function updateTodo(id, data, token) {
  const res = await fetch(`${TODOS_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteTodo(id, token) {
  const res = await fetch(`${TODOS_URL}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  return handleResponse(res);
}
