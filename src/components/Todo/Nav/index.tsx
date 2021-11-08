import { FC, ReactElement } from 'react';
import { TodoItemType } from '../indexTypes';
import { useInputElementInit } from './indexHooks';
import './index.css';

interface INavProps {
    title: string;
    hideInput?: boolean;
    onTitleClick: () => void;
    onAdd: (todoItem: TodoItemType) => void;
}

interface IInputProps {
    onAdd: INavProps['onAdd'];
    isHide?: boolean;
}

const Nav: FC<INavProps> = ({
    title,
    hideInput = false,
    onTitleClick,
    onAdd
}): ReactElement => (
    <div className="nav">
        <span className="nav-title" onClick={() => onTitleClick()}>{title}</span>
        <Input isHide={hideInput} onAdd={onAdd} />
    </div>
);

const Input: FC<IInputProps> = ({
    onAdd,
    isHide = true
}): ReactElement => {

    // initialize inputElement
    const [inputRef, onKeyDown, onAddBtnClicked] = useInputElementInit(onAdd);

    return (
        <>
            <input className={`nav-input${ isHide ? ' hide' : '' }`} type="text" placeholder="请输入内容..." ref={inputRef} onKeyDown={onKeyDown} />
            <button className={`nav-add-btn${ isHide ? ' hide' : '' }`} onClick={onAddBtnClicked}></button>
        </>
    );
};

export default Nav;