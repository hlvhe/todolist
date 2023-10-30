import { Todo } from '../App';

const data: Todo[] = [
    { title: 'title1', desc: 'desc', checked: true },
    { title: 'title2', desc: 'desc', checked: true },
    { title: 'title3', desc: 'desc', checked: true },
    { title: 'title4', desc: 'desc', checked: true },
    { title: 'title5', desc: 'desc', checked: false },
    { title: 'title6', desc: 'desc', checked: false },
    { title: 'title7', desc: 'desc', checked: false },
];

function update(items: Todo[]) {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            localStorage.setItem('todos', JSON.stringify(items));
            resolve();
        }, 2000);
    });
}

function fetchAll(): Promise<Todo[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const jsonValue = localStorage.getItem('todos');
            const res = jsonValue == null ? data : JSON.parse(jsonValue);
            resolve(res);
        }, 2000);
    });
}

export { update, fetchAll };
