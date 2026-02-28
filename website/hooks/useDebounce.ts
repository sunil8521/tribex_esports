import { useEffect, useState } from 'react';

/**
 * Debounces a value — only updates after `delay` ms of inactivity.
 * Use for search inputs to avoid firing API calls on every keystroke.
 */
export function useDebounce<T>(value: T, delay = 400): T {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(id);
    }, [value, delay]);

    return debounced;
}
