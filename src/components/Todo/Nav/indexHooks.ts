import React, { useCallback, useRef } from "react";
import { TodoItemType } from "../indexTypes";

function useInputElementInit (onAdd: (todoItem: TodoItemType) => void): [React.RefObject<HTMLInputElement>, typeof onKeyDown, typeof onAddBtnClicked] {
    const inputRef = useRef<HTMLInputElement>(null);

    const onAddBtnClicked = useCallback(() => {
        const val: string = inputRef.current!.value.trim();
        if (val.length) {
            const todoItem: TodoItemType = {
                key: Date.now(),
                content: val,
                completed: false
            };
            onAdd(todoItem);
            inputRef.current!.value = '';
        }
    }, [onAdd]);

    const onKeyDown = useCallback(e => {
        if (e.keyCode === 13) onAddBtnClicked();
    }, [onAddBtnClicked]);
    
    return [inputRef, onKeyDown, onAddBtnClicked];
}

export {
    useInputElementInit
};