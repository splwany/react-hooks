import { useCallback } from "react";
import { TodoItemType } from "../indexTypes";

function useTodoListInit(
    title: string | undefined,
    list: TodoItemType[],
    reverse: boolean | undefined,
    onChange: (todoItem: TodoItemType) => void,
    onDelete: ((elementList: TodoItemType[]) => void) | undefined
) {

    let sortedList = list;
    if (reverse) sortedList = list.slice().reverse();

    const onClear = useCallback(() => {
        onDelete!(sortedList);
    }, [onDelete, sortedList]);

    const onClick = useCallback(event => {
        const { index } = event.target.dataset;
        if (typeof index === 'undefined') return;
        onChange(sortedList[index]);
    }, [onChange, sortedList]);

    return { isEmpty: sortedList.length === 0, showHeader: Boolean(title) || onDelete, sortedList, onClear, onClick };
}

export {
    useTodoListInit
};
