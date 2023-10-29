import { List, Checkbox, Button, Space, Row, Col } from 'antd';
import { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TodosList.module.css';
import { Todo } from '../../App';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

type TodosListProps = {
    checkTodo: (e: CheckboxChangeEvent, idx: number) => void;
    todos: Todo[];
};

export function TodosList({ checkTodo, todos }: TodosListProps) {
    const navigate = useNavigate();

    const handleClick = (e: MouseEvent, i: number) => {
        navigate(`/todo/${i}`);
    };

    return (
        <>
            <Row gutter={[48, 8]} align={'middle'}>
                <Col span={12}>
                    <h1 className={styles.title}>Todos</h1>
                </Col>

                <Col span={12}>
                    <Button type="primary" onClick={() => navigate(`/add`)}>
                        Add a todo
                    </Button>
                </Col>
            </Row>

            <List
                className={styles.list}
                itemLayout="horizontal"
                dataSource={todos}
                renderItem={(item: Todo, i) => (
                    <List.Item>
                        <List.Item.Meta title={<p>{item.title}</p>} />
                        <Space>
                            <Button
                                type="primary"
                                onClick={(e) => handleClick(e, i)}
                            >
                                Details
                            </Button>
                            <Checkbox
                                onChange={(e) => checkTodo(e, i)}
                                checked={item.checked}
                            >
                                Done
                            </Checkbox>
                        </Space>
                    </List.Item>
                )}
            />
        </>
    );
}
