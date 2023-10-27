import { List, Checkbox } from 'antd';

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
    return (
        <>
            <h1>Todos</h1>
            <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item: Todo) => (
                    <List.Item>
                        <List.Item.Meta title={<p>{item.title}</p>} />
                        <Checkbox checked={item.checked}>Done</Checkbox>
                    </List.Item>
                )}
            />
        </>
    );
}
