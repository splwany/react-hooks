import { FC, ReactElement } from 'react';
import './index.css';
import Nav from './Nav';
import TodoList from './TodoList';
import { TodoItemType, TodoListAction, TodoListModeType } from './indexTypes';
import { useTodoInit, useTodoListChooserInit } from './indexHooks';

interface ITodoProps {
    listModes: TodoListModeType[];
}

interface ITodoListChooserProps {
    listModes: TodoListModeType[];
    lists: TodoItemType[][];
    dispatch: React.Dispatch<TodoListAction>;
    index?: number;
}

const Todo: FC<ITodoProps> = ({
    listModes = []
}): ReactElement => {

    const {
        index,
        navTitle,
        hideInput,
        lists,
        dispatch,
        onTitleClick,
        onAdd
    } = useTodoInit(listModes);

    return (
        <div className="todo">
            <Nav {...{ title: navTitle, hideInput, onTitleClick, onAdd }} />
            <TodoListChooser {...{ listModes, lists, dispatch, index }} />
        </div>
    );
};

const TodoListChooser: FC<ITodoListChooserProps> = ({
    listModes,
    lists,
    dispatch,
    index = 0
}): ReactElement => {

    const { titles, emptyContents, reverses, canClears, deleteButtonTexts, onChange, onDelete } = useTodoListChooserInit(listModes, dispatch);

    const todoListElements = (() => titles.map((title, i) => (
        <TodoList {...{
            title,
            list: lists[i],
            emptyContent: emptyContents[i],
            reverse: reverses[i],
            deleteButtonText: deleteButtonTexts[i],
            onChange,
            onDelete: canClears[i] ? onDelete : undefined
        }} />
    )))();
    
    return todoListElements[index];
};

export default Todo;
export type { TodoListModeType };