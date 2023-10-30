import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Todo } from '../../App';
import { Card } from 'antd';

type TodoDetailProps = {
    getTodoById: (id: number) => Todo | undefined;
};

export function TodoDetail({ getTodoById }: TodoDetailProps) {
    const { id } = useParams();
    const [todo, setTodo] = useState<Todo>();
    const navigate = useNavigate();

    useEffect(() => {
        const todo = getTodoById(parseInt(id!));
        if (todo === undefined) navigate('/');
        setTodo(todo);
    }, [getTodoById, id, navigate]);

    return (
        <>
            <Card title={todo?.title}>{todo?.desc}</Card>
        </>
    );
}
