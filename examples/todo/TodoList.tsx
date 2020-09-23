import React from 'react';
import { useRecoilValue } from 'recoil';
import { Todo, useActions, appState } from './TodoProvider';

export const TodoList = () => {
  const { todos, progress } = useRecoilValue(appState);
  const { update, showProgress, hideProgress } = useActions();

  const onChange = async (i: number, todo: Todo, checked: boolean) => {
    await showProgress();
    await update(i, { ...todo, completed: checked });
    await hideProgress();
  };

  return (
    <ul>
      {todos.map((todo, i) => (
        <li key={i}>
          <input
            id={`${i}_check`}
            type="checkbox"
            disabled={progress}
            checked={todo.completed}
            onChange={(e) => onChange(i, todo, e.target.checked)}
          />
          <label htmlFor={`${i}_check`}>
            <span style={{ textDecoration: todo.completed ? 'line-through' : '' }}>{todo.text}</span>
          </label>
        </li>
      ))}
    </ul>
  );
};
