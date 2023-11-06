import { TodosList } from './components/TodosList/TodosList';
import styles from './App.module.css';
import { Routes, Route } from 'react-router-dom';
import { TodoDetail } from './components/TodoDetail/TodoDetail';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useEffect, useState } from 'react';
import { TodoAddForm } from './components/TodoAddForm/TodoAddForm';
import api from './api';

export type Todo = {
    id: number;
    title: string;
    desc: string | undefined;
    checked?: boolean;
};

function App() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [updateTimeout, setUpdateTimeout] = useState<{
        id: NodeJS.Timeout | null;
        time: number | null;
    }>({
        id: null,
        time: null,
    });

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

    const handleUpdateTimeout = async (items: Todo[]) => {
        const currentTime = Date.now();
        let delay = 1000;
        const exponent = 0.79;
        const max = 5000;

        if (updateTimeout.id) clearTimeout(updateTimeout.id);
        if (updateTimeout.time !== null) {
            const timeDiff = currentTime - updateTimeout.time;
            const clickRate = timeDiff > 0 ? 1 / (timeDiff / 1000) : 0;
            delay *= Math.pow(1 + clickRate, exponent);
            delay = Math.min(delay, max);
        }

        const timeoutId = setTimeout(async () => {
            try {
                await api.todo.update(items);
            } catch (error) {
                console.error('Error while updating:', error);
                await fetchTodos();
            }
        }, delay);

        setUpdateTimeout({
            id: timeoutId,
            time: currentTime,
        });
    };

    const updateTodoChecked = async (e: CheckboxChangeEvent, id: number) => {
        const idxToInsert = e.target.checked ? 0 : todos.length - 1;
        const idxToRemove = todos.findIndex((item) => item.id === id);

        const newTodos = [...todos];
        const [removedItem] = newTodos.splice(idxToRemove, 1);
        newTodos.splice(idxToInsert, 0, {
            ...removedItem,
            checked: !removedItem.checked,
        });

        setTodos(newTodos);
        handleUpdateTimeout(newTodos);
    };

    const addTodo = async (item: Todo) => {
        item.checked = true;
        const newTodos = [item, ...todos];
        setTodos(newTodos);
        handleUpdateTimeout(newTodos);
    };

    const getTodoById = (id: number): Todo | undefined => {
        return todos[id];
    };

    const deleteTodo = (id: number) => {
        const newTodos = todos.filter((item) => item.id !== id);
        setTodos(newTodos);
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
