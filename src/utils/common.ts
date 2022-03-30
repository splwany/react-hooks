export const throttle = (fn: CallableFunction) => {
    let lock = false;
    const unLock = () => lock = false;
    return (...args: any[]) => {
        if (lock) return;
        lock = true;
        fn(...args);
        requestAnimationFrame(unLock);
    };
};

export const getDate = () => {
    const d = new Date();
    const year = d.getFullYear().toString();
    const month = (d.getMonth() + 101).toString().substring(1);
    const date = (d.getDate() + 100).toString().substring(1);
    return `${year}-${month}-${date}`;
}