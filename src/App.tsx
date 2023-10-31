import { TodosList } from './components/TodosList/TodosList';
import styles from './App.module.css';
import { Routes, Route } from 'react-router-dom';
import { TodoDetail } from './components/TodoDetail/TodoDetail';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useEffect, useState } from 'react';
import { TodoAddForm } from './components/TodoAddForm/TodoAddForm';
import api from './api';

export type Todo = {
    title: string;
    desc: string | undefined;
    checked?: boolean;
};

function App() {
    const [todos, setTodos] = useState<Todo[]>([]);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const todos = await api.todo.fetchAll();
            setTodos(todos);
        } catch (error) {
            console.error('Error fetching:', error);
        }
    };

    const swapAndToggleTodo = (
        todos: Todo[],
        deleteId: number,
        addId: number,
    ) => {
        const newTodos = [...todos];
        const todo = newTodos.splice(deleteId, 1)[0];
        newTodos.splice(addId, 0, { ...todo, checked: !todo.checked });
        return newTodos;
    };

    const updateTodoChecked = async (
        e: CheckboxChangeEvent,
        idx: number,
    ): Promise<void> => {
        const id = e.target.checked ? 0 : todos.length - 1;
        const newTodos = swapAndToggleTodo([...todos], idx, id);
        setTodos(newTodos);
        try {
            await api.todo.update(newTodos);
        } catch (error) {
            console.error('Error while updating:', error);
            setTodos((prev) => {
                const newTodos = swapAndToggleTodo(prev, id, idx);
                return newTodos;
            });
        }
    };

    const addTodo = async (item: Todo): Promise<void> => {
        item.checked = true;
        const newTodos = [item, ...todos];
        setTodos(newTodos);
        try {
            await api.todo.update(newTodos);
        } catch (error) {
            console.error('Error while adding:', error);
            setTodos((prev) => {
                const newTodos = [...prev];
                newTodos.shift();
                return newTodos;
            });
        }
    };

    const getTodoById = (id: number): Todo | undefined => {
        return todos[id];
    };

    const deleteTodo = async (id: number): Promise<void> => {
        const newTodos = [...todos];
        const todo = newTodos.splice(id, 1)[0];
        setTodos(newTodos);

        try {
            await api.todo.update(newTodos);
        } catch (error) {
            console.error('Error while deleting:', error);
            newTodos.splice(id, 0, todo);
            setTodos((prev) => {
                const newTodos = [...prev];
                newTodos.splice(id, 0, todo);
                return newTodos;
            });
        }
    };

    return (
        <div className={styles.app}>
            <Routes>
                <Route
                    path="/"
                    element={
                        <TodosList
                            onCheckboxChange={updateTodoChecked}
                            onDeleteBtnDeleteClick={deleteTodo}
                            todos={todos}
                        />
                    }
                />
                <Route
                    path="/todo/:id"
                    element={<TodoDetail getTodoById={getTodoById} />}
                />
                <Route
                    path="/add"
                    element={<TodoAddForm onAddTodo={addTodo} />}
                />
            </Routes>
        </div>
    );
}

export default App;
