import { lsGet, lsSet } from "./storage";

const KEY = "gc:lastQuoteNumber";

function pad(n: number) {
    return String(n).padStart(4, "0");
}

export function nextQuoteNumber(): string {
    // Formato: COT-YYYY-0001
    const year = new Date().getFullYear();
    const last = lsGet<number>(KEY, 0);
    const next = last + 1;
    lsSet(KEY, next);
    return `COT-${year}-${pad(next)}`;
}
