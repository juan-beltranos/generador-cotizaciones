export type Currency = "COP" | "USD" | "EUR" | "MXN" | "ARS" | "CLP";

export type DiscountMode = "none" | "fixed" | "percent";

export type Emitter = {
    name: string;
    contact: string; // email o WhatsApp
    location?: string;
    logo?: string;
};

export type Client = {
    name: string;
    company?: string;
    dateISO: string; // YYYY-MM-DD
};

export type ServiceItem = {
    id: string;
    name: string;
    description?: string;
    price: number;
};

export type Settings = {
    currency: Currency;
    discountMode: DiscountMode;
    discountValue: number; // fijo o %
    taxPercent: number; // 0..100
    notes: string;
};

export type QuoteDraft = {
    quoteNumber: string;
    emitter: Emitter;
    client: Client;
    services: ServiceItem[];
    settings: Settings;
};
