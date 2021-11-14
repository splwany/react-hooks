import { useMemo } from "react";

function useLocalStorage<T>(key: string, defaultValue: T): T {
    const value = useMemo(() => {
        const value = localStorage.getItem(key);
        if (value === null) return null;
        return JSON.parse(value);
    }, [key]);
    if (value === null) return defaultValue;
    return value;
}

export {
    useLocalStorage,
};