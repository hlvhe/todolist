import { Button, Form, Input } from 'antd';
import { Todo } from '../../App';
import TextArea from 'antd/es/input/TextArea';
import { useNavigate } from 'react-router-dom';

type TodoAddFormProps = {
    addTodo: (item: Todo) => void;
};

export function TodoAddForm({ addTodo }: TodoAddFormProps) {
    const navigate = useNavigate();

    const onFinish = (item: Todo) => {
        addTodo(item);
        navigate('/');
    };

    return (
        <>
            <Form name="wrap" layout={'vertical'} onFinish={onFinish}>
                <Form.Item
                    label="Title"
                    name="title"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item label="Description" name="desc">
                    <TextArea rows={4} />
                </Form.Item>

                <Form.Item label="">
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}
