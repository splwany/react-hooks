import {FC, useCallback} from 'react';
import { ITodoItem } from '../typings';
import './index.css';

interface IProps {
    list: ITodoItem[];
    onChange: (element: ITodoItem) => void;
    title?: string;
    emptyContent?: string;
    reverse?: boolean;
    onDelete?: (elementList: ITodoItem[]) => void;
}

const TodoList: FC<IProps> = ({
    list,
    onChange,
    title,
    emptyContent = '无',
    reverse,
    onDelete,
}) => {

    if (reverse) list = list.slice().reverse();

    const onClear = useCallback(() => {
        onDelete!(list);
    }, [onDelete, list]);
    
    const onClick = useCallback(event => {
        const index: number = Number(event.currentTarget.dataset.index);
        onChange(list[index]);
    }, [onChange, list]);
    
    const emptyElement = <div className="empty">{emptyContent}</div>;
    
    if (!list.length) return emptyElement;
    return (
        <div className="todo-list">
            {(Boolean(title) || onDelete) &&
                <div className="todo-title">
                    <span>{title || '未命名标题'}</span>
                    {onDelete && <button className="clear-btn" onClick={onClear}>清空</button>}
                </div>
            }
            {list.map((item, i) => (
                <li className="todo-item" key={item.key} data-index={i} onClick={onClick}>
                    <input type="checkbox" defaultChecked={item.completed} />
                    <span className={`todo-item-text${item.completed ? ' completed' : ''}`}>{item.content}</span>
                </li>
            ))}
        </div>
    );
};

export default TodoList;