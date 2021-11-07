import { FC, ReactElement, useCallback, useEffect, useReducer, useState } from 'react';
import './index.css';
import Nav from './Nav';
import TodoList from './TodoList';
import { ITodoItem } from './typings';

interface IProps {
  activedTitle?: string;
  completedTitle?: string;
  emptyContent?: string;
}

type TodoListAction = {
  type: string
  val: ITodoItem[]
};

const todoListReducer = (state: ITodoItem[], action: TodoListAction): ITodoItem[] => {
  if (action.type === 'add') {
    return [...state, action.val[0]];
  }
  if (action.type === 'change') {
    const index = state.findIndex(item => item === action.val[0]);
    const target = { ...state[index] };
    target.completed = !target.completed;
    return [...state.slice(0, index), target, ...state.slice(index + 1)];
  }
  if (action.type === 'delete') {
    const indexs = [];
    for (const itemToDel of action.val) {
      const index = state.findIndex(item => item === itemToDel);
      indexs.push(index);
    }
    const newState: ITodoItem[] = [];
    for (let i = 0; i < state.length; i++) {
      if (indexs.includes(i)) continue;
      newState.push(state[i]);
    }
    return newState;
  }
  return state;
};

const Todo: FC<IProps> = ({
  activedTitle = '代办',
  completedTitle = '已完成',
  emptyContent = '无'
}): ReactElement => {

  const [todoList, todoListDispatch] = useReducer(todoListReducer, []);
  const [activedList, setActivedList] = useState<ITodoItem[]>([]);
  const [completedList, setCompletedList] = useState<ITodoItem[]>([]);
  const [completedNum, setCompletedNum] = useState(0);

  useEffect(() => {
    const acti = todoList.filter(item => !item.completed);
    setActivedList(acti);
    const compNum = todoList.length - acti.length;
    setCompletedNum(compNum);
  }, [todoList]);

  useEffect(() => {
    if (completedList.length !== completedNum) {
      setCompletedList(todoList.filter(item => item.completed));
    }
  }, [todoList, completedList, completedNum]);

  const onAdd = useCallback((todoItem: ITodoItem) => {
    todoListDispatch({ type: 'add', val: [todoItem] });
  }, []);

  const onCompletedChange = useCallback((element: ITodoItem) => {
    todoListDispatch({ type: 'change', val: [element] });
  }, []);

  const onDelete = useCallback((elementList: ITodoItem[]) => {
    todoListDispatch({type: 'delete', val: elementList});
  }, []);

  const emptyElement = <div className="empty">{emptyContent}</div>;

  return (
    <div className="todo">
      <Nav onAdd={onAdd} />
      {!activedList.length && !completedList.length && emptyElement}
      <TodoList title={activedTitle} list={activedList} reverse onChange={onCompletedChange} />
      <TodoList title={completedTitle} list={completedList} onChange={onCompletedChange} onDelete={onDelete} />
    </div>
  );
};

export default Todo;