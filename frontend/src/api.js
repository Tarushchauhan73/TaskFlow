const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/todos';

export async function getTodos() {
  const res = await fetch(API_URL);
  return res.json();
}

export async function addTodo(title) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  return res.json();
}

export async function updateTodo(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteTodo(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  return res.json();
}
