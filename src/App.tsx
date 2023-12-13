import { v4 as uuidv4 } from 'uuid';
import { TodosList } from './components/TodosList/TodosList';
import styles from './App.module.css';
import { Routes, Route } from 'react-router-dom';
import { TodoDetail } from './components/TodoDetail/TodoDetail';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { TodoAddForm } from './components/TodoAddForm/TodoAddForm';
import api from './api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export type Todo = {
  id: string;
  title: string;
  desc: string | undefined;
  checked?: boolean;
};

function App() {
  const queryClient = useQueryClient();
  const [todos, setTodos] = useState<Todo[]>([]);
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const newTodos = await api.todo.fetchAll();
      setTodos(newTodos);
      return newTodos;
    },
  });

  const [updateTimeout, setUpdateTimeout] = useState<{
    id: NodeJS.Timeout | null;
    time: number | null;
    clickCount: number;
  }>({
    id: null,
    time: null,
    clickCount: 0,
  });

  const { mutate: updateTodosMutation } = useMutation({
    mutationFn: async (todos: Todo[]) => {
      const newtTodos = await api.todo.update(todos);
      return newtTodos;
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setUpdateTimeout((prevTimeout) => ({
        ...prevTimeout,
        clickCount: 0,
      }));
    },
  });

  const maxDelay = 5000;

  // Handle the update timeout to prevent too many requests in a short time
  const handleUpdateTimeout = (items: Todo[]) => {
    setTodos(items);
    api.todo.cancelFetch();
    const currentTime = Date.now();
    let delay = 1000;
    let clickCount = updateTimeout.clickCount;
    if (updateTimeout.id) {
      clearTimeout(updateTimeout.id);
    }

    if (updateTimeout.time !== null) {
      clickCount++;

      if (clickCount <= 3) {
        delay += clickCount * 500;
      } else {
        // Calculate the click rate based on time difference
        const timeDiff = currentTime - updateTimeout.time;
        const clickRate = timeDiff > 0 ? 1 / (timeDiff / 1000) : 0;

        delay += 1500 + Math.pow(clickCount, clickRate) * 10;
      }
      delay = Math.min(delay, maxDelay);
    }

    const timeoutId = setTimeout(() => {
      updateTodosMutation(items);
    }, delay);

    // Update the timeout state for next references
    setUpdateTimeout({
      id: timeoutId,
      time: currentTime,
      clickCount,
    });
  };

  const updateTodoChecked = (e: CheckboxChangeEvent, id: string) => {
    const idxToInsert = e.target.checked ? 0 : todos?.length! - 1;
    const idxToRemove = todos?.findIndex((item) => item.id === id);

    const newTodos = [...todos!];
    const [removedItem] = newTodos.splice(idxToRemove!, 1);
    newTodos.splice(idxToInsert, 0, {
      ...removedItem,
      checked: !removedItem.checked,
    });
    handleUpdateTimeout(newTodos);
  };

  const addTodo = (item: Todo) => {
    item.checked = true;
    item.id = uuidv4();
    const newTodos = [item, ...todos!];
    handleUpdateTimeout(newTodos);
  };

  const getTodoById = (id: string): Todo | undefined => {
    return todos.find((item) => item.id === id);
  };

  const deleteTodo = (id: string) => {
    const newTodos = todos?.filter((item) => item.id !== id);
    handleUpdateTimeout(newTodos);
  };

  return (
    <div className={styles.app}>
      <Routes>
        <Route
          path="/"
          element={
            <TodosList
              onCheckboxChange={updateTodoChecked}
              onDeleteBtnClick={deleteTodo}
              todos={todos!}
            />
          }
        />
        <Route
          path="/todo/:id"
          element={<TodoDetail getTodoById={getTodoById} />}
        />
        <Route path="/add" element={<TodoAddForm onAddTodo={addTodo} />} />
      </Routes>
    </div>
  );
}

export default App;
