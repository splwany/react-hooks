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

    const onClear = () => onDelete!(sortedList);

    const onClick = (event: any) => {
        const index: number = Number(event.currentTarget.dataset.index);
        onChange(sortedList[index]);
    }

    return { isEmpty: sortedList.length === 0, showHeader: Boolean(title) || onDelete, sortedList, onClear, onClick };
}

export {
    useTodoListInit
};
