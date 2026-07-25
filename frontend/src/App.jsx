import React, { useEffect, useState } from 'react';
import AddTodo from './components/AddTodo.jsx';
import TodoList from './components/TodoList.jsx';
import { getTodos, addTodo, updateTodo, deleteTodo } from './api.js';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState('');

  const loadTodos = async () => {
    try {
      const data = await getTodos();
      setTodos(data);
    } catch {
      setError('Could not load tasks. Is the API running?');
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleAdd = async (title) => {
    const newTodo = await addTodo(title);
    setTodos((prev) => [newTodo, ...prev]);
  };

  const handleToggle = async (todo) => {
    const updated = await updateTodo(todo._id, { completed: !todo.completed });
    setTodos((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
  };

  const handleDelete = async (id) => {
    await deleteTodo(id);
    setTodos((prev) => prev.filter((t) => t._id !== id));
  };

  return (
    <div className="app">
      <h1>TaskFlow</h1>
      <AddTodo onAdd={handleAdd} />
      {error && <p className="error">{error}</p>}
      <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} />
    </div>
  );
}
