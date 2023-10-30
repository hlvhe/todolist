import { Button, Form, Input } from 'antd';
import { Todo } from '../../App';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;

type TodoAddFormProps = {
    onAddTodo: (item: Todo) => void;
};

export function TodoAddForm({ onAddTodo }: TodoAddFormProps) {
    const navigate = useNavigate();

    const onFinish = (item: Todo) => {
        onAddTodo(item);
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
