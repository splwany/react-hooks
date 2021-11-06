import {FC, ReactElement, useCallback} from 'react';
import { ITodoItem } from '../typings';
import './index.css';

interface IProps {
    onCompleted: (element: ITodoItem) => void;
    reverse?: boolean;
    activedList: ITodoItem[];
}

const TodoList: FC<IProps> = ({
    onCompleted,
    reverse = false,
    activedList
}): ReactElement => {

    if (reverse) activedList = activedList.slice().reverse();

    const onChange = useCallback(event => {
        const index: number = Number(event.currentTarget.dataset.index);
        onCompleted(activedList[index]);
    }, [onCompleted, activedList]);

    return (
        <div className="todo-list">
            <div className="todo-title">代办</div>
            {activedList.map((item, i) => (
                <li className="todo-item" key={`item-${i}`} data-index={i} onClick={onChange}>
                    <input type="checkbox" checked={item.completed} onChange={() => {}} />
                    <span className={`todo-item-text${item.completed ? ' completed' : ''}`}>{item.content}</span>
                </li>
            ))}
        </div>
    );
};

export default TodoList;