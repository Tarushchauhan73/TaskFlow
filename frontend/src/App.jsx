import React, { useEffect, useState } from 'react';
import AddTodo from './components/AddTodo.jsx';
import TodoList from './components/TodoList.jsx';
import { getTodos, addTodo, updateTodo, deleteTodo } from './api.js';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadTodos = async () => {
    try {
      const data = await getTodos();
      setTodos(data);
      setError('');
    } catch {
      setError(
        'Could not reach the server. If this is the first request in a while, ' +
          'the free backend may be waking up (~30-60s) — please try again shortly.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleAdd = async (title) => {
    try {
      const newTodo = await addTodo(title);
      setTodos((prev) => [newTodo, ...prev]);
      setError('');
    } catch {
      setError('Could not add task. The server may be waking up — please try again.');
    }
  };

  const handleToggle = async (todo) => {
    try {
      const updated = await updateTodo(todo._id, { completed: !todo.completed });
      setTodos((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
      setError('');
    } catch {
      setError('Could not update task. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t._id !== id));
      setError('');
    } catch {
      setError('Could not delete task. Please try again.');
    }
  };

  return (
    <div className="app">
      <h1>TaskFlow</h1>
      <AddTodo onAdd={handleAdd} />
      {error && <p className="error">{error}</p>}
      {loading ? <p className="empty-state">Loading tasks...</p> : (
        <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} />
      )}
    </div>
  );
}
