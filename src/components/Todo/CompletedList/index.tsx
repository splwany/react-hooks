import {FC, ReactElement, useCallback} from 'react';
import { ITodoItem } from '../typings';
import '../TodoList/index.css';

interface IProps {
    onActived: (element: ITodoItem) => void;
    onDelete: (elementList: ITodoItem[]) => void;
    completedList: ITodoItem[];
}

const TodoList: FC<IProps> = ({
    onActived,
    onDelete,
    completedList
}): ReactElement => {

    const onClear = useCallback(() => {
        onDelete(completedList);
    }, [onDelete, completedList]);

    const onChange = useCallback(event => {
        const index: number = Number(event.currentTarget.dataset.index);
        onActived(completedList[index]);
    }, [onActived, completedList]);

    return (
        <div className="todo-list">
            <div className="todo-title">
                <span>已完成</span>
                <button className="clear-btn" onClick={onClear}>清空</button>
            </div>
            {completedList.map((item, i) => (
                <li className="todo-item" key={`item-${i}`} data-index={i} onClick={onChange}>
                    <input type="checkbox" checked={item.completed} onChange={() => {}} />
                    <span className={`todo-item-text${item.completed ? ' completed' : ''}`}>{item.content}</span>
                </li>
            ))}
        </div>
    );
};

export default TodoList;