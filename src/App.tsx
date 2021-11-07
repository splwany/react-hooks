import {FC, ReactElement} from 'react';
import './App.css';
import Todo from './components/Todo';

const App: FC = (): ReactElement => {
  return (
    <div className="app">
      <Todo emptyContent="什么都没有(●'◡'●)" />
    </div>
  );
};

export default App;
