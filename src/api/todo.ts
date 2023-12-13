import { Todo } from '../App';
import { v4 as uuidv4 } from 'uuid';

const data: Todo[] = [
  { id: uuidv4(), title: 'title1', desc: 'desc', checked: true },
  { id: uuidv4(), title: 'title2', desc: 'desc', checked: true },
  { id: uuidv4(), title: 'title3', desc: 'desc', checked: true },
  { id: uuidv4(), title: 'title4', desc: 'desc', checked: true },
  { id: uuidv4(), title: 'title5', desc: 'desc', checked: false },
  { id: uuidv4(), title: 'title6', desc: 'desc', checked: false },
  { id: uuidv4(), title: 'title7', desc: 'desc', checked: false },
];

let fetchAllTimeoutId: NodeJS.Timeout | null = null;

function update(items: Todo[]): Promise<Todo[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem('todos', JSON.stringify(items));
      console.log('updated');
      resolve(items);
    }, 600);
  });
}

function fetchAll(): Promise<Todo[]> {
  return new Promise((resolve) => {
    fetchAllTimeoutId = setTimeout(() => {
      const jsonValue = localStorage.getItem('todos');
      const res = jsonValue == null ? data : JSON.parse(jsonValue);
      console.log('fetchAll');
      resolve(res);
    }, 1500);
  });
}

function cancelFetch() {
  if (fetchAllTimeoutId) {
    console.log('cancelFetch');
    clearTimeout(fetchAllTimeoutId);
    fetchAllTimeoutId = null;
  }
}

export { update, fetchAll, cancelFetch };
