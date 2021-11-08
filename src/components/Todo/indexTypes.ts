type TodoListModeType = {
    navTitle?: string;
    listTitle?: string;
    emptyContent?: string;
    reverse?: boolean;
    deleteButtonText?: string;
    canClear?: boolean;
    canInput?: boolean;
};

type TodoItemType = {
    key: number
    content: string
    completed: boolean
};

type TodoListAction = {
    type: string
    val: TodoItemType[]
};

export type {
    TodoListModeType,
    TodoItemType,
    TodoListAction,
};