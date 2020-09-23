import React from 'react';
import { RecoilRoot } from 'recoil';
import { AdditionalForm } from './AdditionalForm';
import { TodoList } from './TodoList';

const TodoApp = () => {
  return (
    <RecoilRoot>
      <p>TodoApp</p>
      <AdditionalForm />
      <TodoList />
    </RecoilRoot>
  );
};

export default TodoApp;
