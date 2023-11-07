import { TodosList } from './components/TodosList/TodosList';
import styles from './App.module.css';
import { Routes, Route } from 'react-router-dom';
import { TodoDetail } from './components/TodoDetail/TodoDetail';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { TodoAddForm } from './components/TodoAddForm/TodoAddForm';
import api from './api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export type Todo = {
  id: number;
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
      const todos = await api.todo.fetchAll();
      setTodos(todos);
      return todos;
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
    mutationFn: api.todo.update,
    onMutate: async (newTodos) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);

      // Optimistically update to the new value
      queryClient.setQueryData<Todo[]>(['todos'], newTodos);

      // Return a context object with the snapshotted value
      return { previousTodos };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      const prevTodos = context?.previousTodos ?? [];
      queryClient.setQueryData<Todo[]>(['todos'], prevTodos);
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

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  const maxDelay = 5000;

  // Handle the update timeout to prevent too many requests in a short time
  const handleUpdateTimeout = (items: Todo[]) => {
    setTodos(items);
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

  const updateTodoChecked = (e: CheckboxChangeEvent, id: number) => {
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
    const newTodos = [item, ...todos!];
    handleUpdateTimeout(newTodos);
  };

  const getTodoById = (id: number): Todo | undefined => {
    return todos![id];
  };

  const deleteTodo = (id: number) => {
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
