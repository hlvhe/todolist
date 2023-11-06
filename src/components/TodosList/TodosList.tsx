import { List, Checkbox, Button, Space, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from './TodosList.module.css';
import { Todo } from '../../App';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

type TodosListProps = {
    onCheckboxChange: (e: CheckboxChangeEvent, idx: number) => void;
    onDeleteBtnClick: (idx: number) => void;
    todos: Todo[];
};

export function TodosList({
    onCheckboxChange,
    onDeleteBtnClick,
    todos,
}: TodosListProps) {
    const navigate = useNavigate();

    const handleBtnAddClick = () => {
        navigate(`/add`);
    };

    const handleBtnDetailsClick = (id: number) => {
        navigate(`/todo/${id}`);
    };

    return (
        <>
            <Row gutter={[48, 8]} align={'middle'}>
                <Col span={12}>
                    <h1 className={styles.title}>Todos</h1>
                </Col>

                <Col span={12}>
                    <Button type="primary" onClick={handleBtnAddClick}>
                        Add a todo
                    </Button>
                </Col>
            </Row>

            <List
                className={styles.list}
                itemLayout="horizontal"
                dataSource={todos}
                renderItem={(item: Todo) => (
                    <List.Item key={item.id}>
                        <List.Item.Meta title={<p>{item.title}</p>} />
                        <Space>
                            <Button
                                type="primary"
                                danger
                                onClick={() => onDeleteBtnClick(item.id)}
                            >
                                Delete
                            </Button>
                            <Button
                                type="primary"
                                onClick={() => handleBtnDetailsClick(item.id)}
                            >
                                Details
                            </Button>
                            <Checkbox
                                onChange={(e) => onCheckboxChange(e, item.id)}
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
