export function safeParseJSON<T>(value: string | null): T | null {
    if (!value) return null;
    try {
        return JSON.parse(value) as T;
    } catch {
        return null;
    }
}

export function lsGet<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    const raw = window.localStorage.getItem(key);
    const parsed = safeParseJSON<T>(raw);
    return parsed ?? fallback;
}

export function lsSet<T>(key: string, value: T) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, JSON.stringify(value));
}

export function lsRemove(key: string) {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(key);
}
