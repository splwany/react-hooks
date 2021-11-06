import { FC, ReactElement, useCallback, useRef } from 'react';
import { ITodoItem } from '../typings';
import './index.css';


interface IProps {
    onAdd: (todoItem: ITodoItem) => void;
}


const Nav: FC<IProps> = ({
    onAdd
}): ReactElement => {

    const navTitle = 'ToDo List';
    const inputRef = useRef<HTMLInputElement>(null);

    const onAddBtnClicked = useCallback(() => {
        const val: string = inputRef.current!.value.trim();
        if (val.length) {
            const todoItem: ITodoItem = {
                key: Date.now(),
                content: val,
                completed: false
            };
            onAdd(todoItem);
            inputRef.current!.value = '';
        }
    }, [onAdd]);

    const onKeyDown = useCallback(e => {
        if (e.keyCode === 13) {
            onAddBtnClicked();
        }
    }, [onAddBtnClicked]);

    return (
        <div className="nav">
            <span className="nav-title">{navTitle}</span>
            <input className="nav-input" type="text" placeholder="请输入内容..." ref={inputRef} onKeyDown={onKeyDown} />
            <button className="nav-add-btn" onClick={onAddBtnClicked}></button>
        </div>
    );
};

export default Nav;