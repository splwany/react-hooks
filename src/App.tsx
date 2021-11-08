import { FC, ReactElement, useMemo } from 'react';
import './App.css';
import Todo, { TodoListModeType } from './components/Todo';

const App: FC = (): ReactElement => {
  const listModes = useMemo((): TodoListModeType[] => [
    {
      navTitle: 'Todo List',
      listTitle: '待办',
      emptyContent: "什么待办都没有(●'◡'●)",
      reverse: true,
      canClear: false,
    },
    {
      navTitle: 'Done List',
      listTitle: '已完成',
      emptyContent: "什么都没有完成(●'◡'●)",
      canInput: false,
    }
  ], []);                        

  return (
    <div className="app">
      <Todo listModes={listModes} />
    </div>
  );
};

export default App;
