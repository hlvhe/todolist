import styles from './App.module.css';
import { TodosList } from './components/TodosList/TodosList';

function App() {
    return (
        <>
            <div className={styles.app}>
                <TodosList />
            </div>
        </>
    );
}

export default App;
