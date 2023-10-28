import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Todo } from '../../App';
import { Card } from 'antd';

type TodoDetailProps = {
    getTodo: (id: number) => Todo;
};

export function TodoDetail({ getTodo }: TodoDetailProps) {
    const { id } = useParams();
    const [todo, setTodo] = useState<Todo>();
    const navigate = useNavigate();

    useEffect(() => {
        const todo = getTodo(parseInt(id!));
        if (todo === undefined) navigate('/');
        setTodo(todo);
    }, [getTodo, id, navigate]);

    return (
        <>
            <Card title={todo?.title}>{todo?.desc}</Card>
        </>
    );
}
