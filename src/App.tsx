import { TodosList } from './components/TodosList/TodosList';
import styles from './App.module.css';
import { Routes, Route } from 'react-router-dom';
import { TodoDetail } from './components/TodoDetail/TodoDetail';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useState } from 'react';
import { TodoAddForm } from './components/TodoAddForm/TodoAddForm';

export type Todo = {
    title: string;
    desc: string | undefined;
    checked?: boolean;
};

const data: Todo[] = [
    { title: 'title1', desc: 'desc', checked: true },
    { title: 'title2', desc: 'desc', checked: true },
    { title: 'title3', desc: 'desc', checked: true },
    { title: 'title4', desc: 'desc', checked: true },
    { title: 'title5', desc: 'desc', checked: true },
    { title: 'title6', desc: 'desc', checked: true },
    { title: 'title7', desc: 'desc', checked: true },
];

function App() {
    const [todos, setTodos] = useState(data);

    const checkTodo = (e: CheckboxChangeEvent, idx: number) => {
        const todo = { ...todos[idx], checked: e.target.checked };
        const newTodos = [...todos];
        newTodos.splice(idx, 1);
        if (todo.checked) newTodos.unshift(todo);
        else newTodos.push(todo);
        setTodos(newTodos);
    };

    const addTodo = (item: Todo) => {
        item.checked = true;
        setTodos((prevState) => [item, ...prevState]);
    };

    const getTodo = (id: number) => {
        return todos[id];
    };

    return (
        <div className={styles.app}>
            <Routes>
                <Route
                    path="/"
                    element={<TodosList checkTodo={checkTodo} todos={todos} />}
                />
                <Route
                    path="/todo/:id"
                    element={<TodoDetail getTodo={getTodo} />}
                />
                <Route
                    path="/add"
                    element={<TodoAddForm addTodo={addTodo} />}
                />
            </Routes>
        </div>
    );
}

export default App;
