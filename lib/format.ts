import type { Currency } from "./types";

const currencyLocaleMap: Record<Currency, string> = {
    COP: "es-CO",
    USD: "en-US",
    EUR: "es-ES",
    MXN: "es-MX",
    ARS: "es-AR",
    CLP: "es-CL"
};

export function formatMoney(amount: number, currency: Currency) {
    const locale = currencyLocaleMap[currency] ?? "es-CO";
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        maximumFractionDigits: 0
    }).format(isFinite(amount) ? amount : 0);
}

export function todayISO() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}
