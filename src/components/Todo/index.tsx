import { FC, ReactElement, useMemo } from 'react';
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

    const {
        titles,
        emptyContents,
        reverses,
        canClears,
        deleteButtonTexts,
        onChange,
        onDelete
    } = useTodoListChooserInit(listModes, dispatch);

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

export const TodoWithInit = (): ReactElement => {
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

    return <Todo listModes={listModes} />;
}

export default Todo;
export type { TodoListModeType };