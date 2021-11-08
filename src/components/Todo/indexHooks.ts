import React, { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { TodoItemType, TodoListAction, TodoListModeType } from "./indexTypes";


function useLocalStorage<T>(key: string, defaultValue: T): T {
    const value = useMemo(() => {
        const value = localStorage.getItem(key);
        if (value === null) return null;
        return JSON.parse(value);
    }, [key]);
    if (value === null) return defaultValue;
    return value;
}


function useTodoListState(initialTodoList: TodoItemType[]): [TodoItemType[][], React.Dispatch<TodoListAction>] {
    // todoList, initialized by savedList
    const [todoList, todoListDispatch] = useReducer(todoListReducer, initialTodoList);

    // activatedList, computed from todoList
    const activatedList = useMemo(() => todoList.filter(item => !item.completed), [todoList]);

    // when todoList updated, save it to localStorage
    // and update completedNum
    useEffect(() => {
        localStorage.setItem('todoList', JSON.stringify(todoList));
        setCompletedNum(todoList.length - activatedList.length);
    }, [todoList, activatedList]);

    // completedList
    const completedListInit = useMemo(() => initialTodoList.filter(item => item.completed), [initialTodoList]);
    const [completedList, setCompletedList] = useState<TodoItemType[]>(completedListInit);
    const [completedNum, setCompletedNum] = useState(completedList.length);
    useEffect(() => {
        if (completedList.length === completedNum) return;
        setCompletedList(todoList.filter(item => item.completed));
    }, [todoList, completedList, completedNum]);

    return [[activatedList, completedList], todoListDispatch];
}

function todoListReducer(state: TodoItemType[], action: TodoListAction): TodoItemType[] {
    switch (action.type) {
        case 'add':
            return [...state, ...action.val];
        case 'change':
            const index = state.findIndex(item => item === action.val[0]);
            const target = { ...state[index] };
            target.completed = !target.completed;
            return [...state.slice(0, index), target, ...state.slice(index + 1)];
        case 'delete':
            const indexs = [];
            for (const itemToDel of action.val) {
                const index = state.findIndex(item => item === itemToDel);
                indexs.push(index);
            }
            const newState: TodoItemType[] = [];
            for (let i = 0; i < state.length; i++) {
                if (indexs.includes(i)) continue;
                newState.push(state[i]);
            }
            return newState;
        case 'clear':
            if (state.length) return [];
            break;
        default:
            break;
    }
    return state;
};


function useTodoInit(listModes: TodoListModeType[]) {

    // savedList, which saved in localStorage. Only run once
    const savedList = useLocalStorage<TodoItemType[]>('todoList', []);

    // get activatedList, completedList and todoListDispatch from todoListState which initialized by savedList
    const [lists, dispatch] = useTodoListState(savedList);
    const onAdd = useCallback((todoItem: TodoItemType) => {
        dispatch({ type: 'add', val: [todoItem] });
    }, [dispatch]);

    const [navTitles, hideInputs] = useMemo(() => {
        const navTitles: string[] = [], hideInputs: boolean[] = [];
        listModes.forEach(({ navTitle = '未命名标题', canInput = true }) => {
            navTitles.push(navTitle);
            hideInputs.push(!canInput);
        });
        return [navTitles, hideInputs];
    }, [listModes]);

    const [index, setIndex] = useState(0);
    const onTitleClick = useCallback(() => {
        setIndex(preIndex => (preIndex + 1) % navTitles.length);
    }, [setIndex, navTitles]);

    return { index, navTitle: navTitles[index], hideInput: hideInputs[index], lists, onTitleClick, onAdd, dispatch };
}


function useTodoListChooserInit(listModes: TodoListModeType[], todoListDispatch: React.Dispatch<TodoListAction>) {

    const [titles, emptyContents, reverses, canClears, deleteButtonTexts] = useMemo(() => {
        const titles: string[] = [], emptyContents: string[] = [], reverses: boolean[] = [];
        const canClears: boolean[] = [], deleteButtonTexts: string[] = [];
        listModes.forEach(({ listTitle = '未命名标题', emptyContent = '无', reverse = false, canClear = true, deleteButtonText = '清空' }) => {
            titles.push(listTitle);
            emptyContents.push(emptyContent);
            reverses.push(reverse);
            canClears.push(canClear);
            deleteButtonTexts.push(deleteButtonText);
        });
        return [titles, emptyContents, reverses, canClears, deleteButtonTexts];
    }, [listModes]);

    const onChange = useCallback((element: TodoItemType) => {
        todoListDispatch({ type: 'change', val: [element] });
    }, [todoListDispatch]);

    const onDelete = useCallback((elementList: TodoItemType[]) => {
        todoListDispatch({ type: 'delete', val: elementList });
    }, [todoListDispatch]);

    return { titles, emptyContents, reverses, canClears, deleteButtonTexts, onChange, onDelete };
}


export {
    useTodoInit,
    useTodoListChooserInit
};