import { FC } from 'react';
import { TodoItemType } from '../indexTypes';
import { useTodoListInit } from './indexHooks';
import './index.css';

interface IProps {
    list: TodoItemType[];
    onChange: (element: TodoItemType) => void;
    title?: string;
    emptyContent?: string;
    reverse?: boolean;
    deleteButtonText?: string;
    onDelete?: (elementList: TodoItemType[]) => void;
}

const TodoList: FC<IProps> = ({
    title,
    list,
    emptyContent = '无',
    reverse,
    deleteButtonText = '清空',
    onChange,
    onDelete
}) => {

    const { isEmpty, showHeader, sortedList, onClear, onClick } = useTodoListInit(title, list, reverse, onChange, onDelete);

    const emptyElement = <div className="empty">{emptyContent}</div>;

    if (isEmpty) return emptyElement;
    return (
        <div className="todo-list">
            {showHeader &&
                <div className="todo-title">
                    <span>{title || '未命名标题'}</span>
                    {onDelete && <button className="clear-btn" onClick={onClear}>{deleteButtonText}</button>}
                </div>
            }
            {sortedList.map((item, i) => (
                <li className="todo-item" key={item.key} data-index={i} onClick={onClick}>
                    <input type="checkbox" defaultChecked={item.completed} />
                    <span className={`todo-item-text${ item.completed ? ' completed' : '' }`}>{item.content}</span>
                </li>
            ))}
        </div>
    );
};

export default TodoList;