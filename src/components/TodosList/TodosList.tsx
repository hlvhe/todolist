import { List, Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useState } from 'react';

type Todo = {
    title: string;
    desc: string;
    checked: boolean;
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

export function TodosList() {
    const [todos, setTodos] = useState(data);

    const onChange = (e: CheckboxChangeEvent, idx: number) => {
        const todo = { ...todos[idx], checked: e.target.checked };
        const newTodos = [...todos];
        newTodos.splice(idx, 1);
        if (todo.checked) newTodos.unshift(todo);
        else newTodos.push(todo);
        setTodos(newTodos);
    };

    return (
        <>
            <h1>Todos</h1>
            <List
                itemLayout="horizontal"
                dataSource={todos}
                renderItem={(item, i) => (
                    <List.Item>
                        <List.Item.Meta title={<p>{item.title}</p>} />
                        <Checkbox
                            onChange={(e) => onChange(e, i)}
                            checked={item.checked}
                        >
                            Done
                        </Checkbox>
                    </List.Item>
                )}
            />
        </>
    );
}
