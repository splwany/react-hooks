function useLocalStorage<T>(key: string, defaultValue: T): T {
    const value = localStorage.getItem(key);
    if (value === null) return defaultValue;
    return JSON.parse(value);
}

export {
    useLocalStorage,
};