import React, { useEffect, useState } from 'react';
import AddTodo from './components/AddTodo.jsx';
import TodoList from './components/TodoList.jsx';
import AuthForm from './components/AuthForm.jsx';
import { getTodos, addTodo, updateTodo, deleteTodo, login, register } from './api.js';

const TOKEN_KEY = 'taskflow_token';
const USER_KEY = 'taskflow_user';

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [authMode, setAuthMode] = useState('login');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [todos, setTodos] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    setTodos([]);
  };

  const loadTodos = async (activeToken) => {
    try {
      const data = await getTodos(activeToken);
      setTodos(data);
      setError('');
    } catch (err) {
      if (err.status === 401) {
        handleLogout();
        return;
      }
      setError(
        'Could not reach the server. If this is the first request in a while, ' +
          'the free backend may be waking up (~30-60s) — please try again shortly.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadTodos(token);
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleAuthSubmit = async (email, password) => {
    setAuthError('');
    setAuthLoading(true);
    try {
      const data =
        authMode === 'login' ? await login(email, password) : await register(email, password);
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAdd = async (title) => {
    try {
      const newTodo = await addTodo(title, token);
      setTodos((prev) => [newTodo, ...prev]);
      setError('');
    } catch (err) {
      if (err.status === 401) return handleLogout();
      setError('Could not add task. The server may be waking up — please try again.');
    }
  };

  const handleToggle = async (todo) => {
    try {
      const updated = await updateTodo(todo._id, { completed: !todo.completed }, token);
      setTodos((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
      setError('');
    } catch (err) {
      if (err.status === 401) return handleLogout();
      setError('Could not update task. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id, token);
      setTodos((prev) => prev.filter((t) => t._id !== id));
      setError('');
    } catch (err) {
      if (err.status === 401) return handleLogout();
      setError('Could not delete task. Please try again.');
    }
  };

  if (!token) {
    return (
      <div className="app">
        <h1>TaskFlow</h1>
        <AuthForm
          mode={authMode}
          onSubmit={handleAuthSubmit}
          onSwitchMode={() => {
            setAuthMode((m) => (m === 'login' ? 'register' : 'login'));
            setAuthError('');
          }}
          error={authError}
          loading={authLoading}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <div className="app-header">
        <h1>TaskFlow</h1>
        <div className="user-bar">
          <span>{user?.email}</span>
          <button className="link-button" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>
      <AddTodo onAdd={handleAdd} />
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p className="empty-state">Loading tasks...</p>
      ) : (
        <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} />
      )}
    </div>
  );
}
