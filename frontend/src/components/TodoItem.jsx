import React from 'react';

export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className="todo-item">
      <label>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo)}
        />
        <span className={todo.completed ? 'completed' : ''}>{todo.title}</span>
      </label>
      <button className="delete-btn" onClick={() => onDelete(todo._id)}>
        Delete
      </button>
    </li>
  );
}
