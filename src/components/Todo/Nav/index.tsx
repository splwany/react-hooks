import { FC, ReactElement, useCallback, useRef, useState } from 'react';
import { ITodoItem } from '../typings';
import './index.css';


interface IProps {
    onTitleClick: () => void;
    onAdd: (todoItem: ITodoItem) => void;
}


const Nav: FC<IProps> = ({
    onTitleClick,
    onAdd
}): ReactElement => {

    const navTitles = ['Todo List', 'Done List'];
    const [navTitleIndex, setNavTitleIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const onTitleClicked = useCallback(() => {
        setNavTitleIndex(preState => (preState + 1) % 2);
        onTitleClick();
    }, [onTitleClick]);

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

    const hideInput = navTitleIndex > 0;
    const inputElement = <>
        <input className={`nav-input${hideInput ? ' hide' : ''}`} type="text" placeholder="请输入内容..." ref={inputRef} onKeyDown={onKeyDown} />
        <button className={`nav-add-btn${hideInput ? ' hide' : ''}`} onClick={onAddBtnClicked}></button>
    </>;

    return (
        <div className="nav">
            <span className="nav-title" onClick={onTitleClicked}>{navTitles[navTitleIndex]}</span>
            {inputElement}
        </div>
    );
};

export default Nav;