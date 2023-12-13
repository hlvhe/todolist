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

let fetchController: AbortController | null = null;

function update(items: Todo[]): Promise<Todo[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem('todos', JSON.stringify(items));
      resolve(items);
    }, 600);
  });
}

function fetchAll(): Promise<Todo[]> {
  fetchController = new AbortController();
  const { signal } = fetchController;

  return new Promise((resolve) => {
    const fetchAllTimeoutId = setTimeout(() => {
      const jsonValue = localStorage.getItem('todos');
      const res = jsonValue == null ? data : JSON.parse(jsonValue);
      resolve(res);
    }, 1500);

    // Attach the abort signal to the fetch timeout
    signal.addEventListener('abort', () => {
      clearTimeout(fetchAllTimeoutId);
    });
  });
}

function cancelFetch() {
  if (fetchController) {
    fetchController.abort();
    fetchController = null;
  }
}

export { update, fetchAll, cancelFetch };
