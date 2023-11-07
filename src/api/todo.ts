import { Todo } from '../App';

const data: Todo[] = [
  { id: 1, title: 'title1', desc: 'desc', checked: true },
  { id: 2, title: 'title2', desc: 'desc', checked: true },
  { id: 3, title: 'title3', desc: 'desc', checked: true },
  { id: 4, title: 'title4', desc: 'desc', checked: true },
  { id: 5, title: 'title5', desc: 'desc', checked: false },
  { id: 6, title: 'title6', desc: 'desc', checked: false },
  { id: 7, title: 'title7', desc: 'desc', checked: false },
];

function update(items: Todo[]): Promise<Todo[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem('todos', JSON.stringify(items));
      resolve(items);
    }, 600);
  });
}

function fetchAll(): Promise<Todo[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const jsonValue = localStorage.getItem('todos');
      const res = jsonValue == null ? data : JSON.parse(jsonValue);
      resolve(res);
    }, 1500);
  });
}

export { update, fetchAll };
