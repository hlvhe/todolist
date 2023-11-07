import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import api from './api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();

describe('App component', () => {
  it('Uncheck a todo: should modify checked property and position on bottom of todos', async () => {
    api.todo.fetchAll = jest.fn().mockResolvedValue([
      { id: 1, title: 'title1', desc: 'desc', checked: true },
      { id: 2, title: 'title2', desc: 'desc', checked: true },
      { id: 3, title: 'title3', desc: 'desc', checked: true },
      { id: 4, title: 'title4', desc: 'desc', checked: true },
      { id: 5, title: 'title5', desc: 'desc', checked: false },
      { id: 6, title: 'title6', desc: 'desc', checked: false },
      { id: 7, title: 'title7', desc: 'desc', checked: false },
    ]);

    render(
      <BrowserRouter basename="/">
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </BrowserRouter>
    );
    const getTodos = () => screen.getAllByRole('checkbox');
    // Wait for the initial rendering
    await waitFor(() => {
      expect(api.todo.fetchAll).toHaveBeenCalledTimes(1);
      const todos = getTodos();
      expect(todos.length).toBeGreaterThan(0);
    });

    // Get the initial todos
    const initialTodos = getTodos();
    const initialTodo = initialTodos[2];
    const initialTitle = initialTodo.getAttribute('title');

    // Ensure the initial 'checked' property is true
    expect(initialTodo).toHaveProperty('checked', true);

    // Click on the todo item checkbox
    fireEvent.click(initialTodos[2]);

    // Get the updated list of todos
    const updatedTodos = getTodos();

    // Assuming the updated todo is at the bottom
    const updatedTodo = updatedTodos[updatedTodos.length - 1];

    // Ensure the 'checked' property is false for the updated todo
    expect(updatedTodo).toHaveProperty('checked', false);

    // Ensure the title of the updated todo remains the same as the initial one
    expect(updatedTodo.getAttribute('title')).toBe(initialTitle);
  });

  it('Check a todo: should modify checked property and move to the top of todos', async () => {
    api.todo.fetchAll = jest.fn().mockResolvedValue([
      { id: 1, title: 'title1', desc: 'desc', checked: true },
      { id: 2, title: 'title2', desc: 'desc', checked: true },
      { id: 3, title: 'title3', desc: 'desc', checked: true },
      { id: 4, title: 'title4', desc: 'desc', checked: true },
      { id: 5, title: 'title5', desc: 'desc', checked: false },
      { id: 6, title: 'title6', desc: 'desc', checked: false },
      { id: 7, title: 'title7', desc: 'desc', checked: false },
    ]);
    render(
      <BrowserRouter basename="/">
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </BrowserRouter>
    );

    const getTodos = () => screen.getAllByRole('checkbox');

    // Wait for the initial rendering
    await waitFor(() => {
      expect(api.todo.fetchAll).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      const todos = getTodos();
      expect(todos.length).toBeGreaterThan(0);
    });

    // Get the initial todos
    const initialTodos = getTodos();
    const initialTodo = initialTodos[5];
    const initialTitle = initialTodo.getAttribute('title');

    // Ensure the initial 'checked' property is false
    expect(initialTodo).toHaveProperty('checked', false);

    act(() => {
      // Click on the todo item checkbox
      fireEvent.click(initialTodos[5]);
    });

    // Get the updated list of todos
    const updatedTodos = getTodos();

    // Assuming the updated todo is at the bottom
    const updatedTodo = updatedTodos[updatedTodos.length - 1];

    await waitFor(() => {
      // Ensure the 'checked' property is true for the updated todo
      expect(updatedTodos[0]).toHaveProperty('checked', true);

      // Ensure the title of the updated todo remains the same as the initial one
      expect(updatedTodo.getAttribute('title')).toBe(initialTitle);
    });
  });

  it('Uncheck a todo with request failure: updates UI and reverts to initial state upon failed update', async () => {
    api.todo.fetchAll = jest.fn().mockResolvedValue([
      { id: 1, title: 'title1', desc: 'desc', checked: true },
      { id: 2, title: 'title2', desc: 'desc', checked: true },
      { id: 3, title: 'title3', desc: 'desc', checked: true },
      { id: 4, title: 'title4', desc: 'desc', checked: true },
      { id: 5, title: 'title5', desc: 'desc', checked: false },
      { id: 6, title: 'title6', desc: 'desc', checked: false },
      { id: 7, title: 'title7', desc: 'desc', checked: false },
    ]);

    // Mock a failed update API call
    api.todo.update = jest
      .fn()
      .mockRejectedValue(new Error('Failed to update todo'));

    act(() => {
      render(
        <BrowserRouter basename="/">
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </BrowserRouter>
      );
    });

    const getTodos = () => screen.getAllByRole('checkbox');
    // Wait for initial rendering and ensure the todo is visible
    await waitFor(() => {
      expect(api.todo.fetchAll).toHaveBeenCalledTimes(1);
      const todos = getTodos();
      expect(todos.length).toBeGreaterThan(0);
    });

    // Get the initial todos
    const initialTodoPosition = 2;
    const initialTodos = getTodos();
    const initialTodo = initialTodos[initialTodoPosition];
    const initialTitle = initialTodo.getAttribute('title');

    // Ensure the initial 'checked' property is true
    expect(initialTodo).toHaveProperty('checked', true);

    act(() => {
      fireEvent.click(initialTodo);
    });

    // Get the updated list of todos
    const updatedTodos = getTodos();

    // Assuming the updated todo is at the bottom
    const updatedTodo = updatedTodos[updatedTodos.length - 1];

    // Ensure the 'checked' property is true for the updated todo
    expect(updatedTodo).toHaveProperty('checked', false);

    // Ensure the title of the updated todo remains the same as the initial one
    expect(updatedTodo.getAttribute('title')).toBe(initialTitle);

    await waitFor(() => {
      // Revert UI position and checked property after failed update
      const postFailedUpdateTodos = getTodos();

      // Assuming the updated todo is in his initial position
      const postFailedUpdateTodo = postFailedUpdateTodos[initialTodoPosition];
      // Check if the UI reverts to the initial state after a failed update
      expect(postFailedUpdateTodo.getAttribute('title')).toBe(initialTitle);
      expect(postFailedUpdateTodo).toHaveProperty('checked', true);
    });
  });
});
