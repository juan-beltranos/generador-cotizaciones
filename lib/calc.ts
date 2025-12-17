import type { DiscountMode, ServiceItem } from "./types";

export function subtotal(services: ServiceItem[]) {
    return services.reduce((acc, s) => acc + (Number(s.price) || 0), 0);
}

export function discountAmount(sub: number, mode: DiscountMode, value: number) {
    const v = Number(value) || 0;
    if (mode === "fixed") return Math.min(v, sub);
    if (mode === "percent") return Math.min((sub * v) / 100, sub);
    return 0;
}

export function taxAmount(base: number, taxPercent: number) {
    const t = Number(taxPercent) || 0;
    return Math.max(0, (base * t) / 100);
}

export function totals(params: {
    services: ServiceItem[];
    discountMode: DiscountMode;
    discountValue: number;
    taxPercent: number;
}) {
    const sub = subtotal(params.services);
    const disc = discountAmount(sub, params.discountMode, params.discountValue);
    const afterDisc = Math.max(0, sub - disc);
    const tax = taxAmount(afterDisc, params.taxPercent);
    const total = afterDisc + tax;

    return { sub, disc, tax, total };
}
