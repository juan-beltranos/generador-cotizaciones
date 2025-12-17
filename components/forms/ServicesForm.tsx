"use client";

import type { Currency, ServiceItem } from "@/lib/types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatMoney } from "@/lib/format";

export function ServicesForm(props: {
    value: ServiceItem[];
    currency: Currency;
    onChange: (next: ServiceItem[]) => void;
}) {
    const add = () => {
        const id = crypto.randomUUID();
        props.onChange([
            ...props.value,
            { id, name: "", description: "", price: 0 }
        ]);
    };

    const remove = (id: string) => {
        props.onChange(props.value.filter((s) => s.id !== id));
    };

    const update = (id: string, patch: Partial<ServiceItem>) => {
        props.onChange(props.value.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    };

    const totalLive = props.value.reduce((a, s) => a + (Number(s.price) || 0), 0);

    return (
        <div className="grid gap-4">
            {props.value.length === 0 ? (
                <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-700">
                    Agrega tus servicios. Puedes poner 1 o varios.
                </div>
            ) : null}

            <div className="grid gap-4">
                {props.value.map((s, idx) => (
                    <div key={s.id} className="rounded-2xl border border-zinc-200 bg-white p-4">
                        <div className="flex items-center justify-between gap-3">
                            <div className="text-sm font-bold">Servicio #{idx + 1}</div>
                            <Button type="button" variant="secondary" onClick={() => remove(s.id)}>
                                Eliminar
                            </Button>
                        </div>

                        <div className="mt-4 grid gap-3">
                            <Input
                                label="Nombre del servicio"
                                placeholder="Ej: Diseño de logo"
                                value={s.name}
                                onChange={(e) => update(s.id, { name: e.target.value })}
                            />
                            <Input
                                label="Descripción corta (opcional)"
                                placeholder="Ej: 3 propuestas + 2 rondas de ajustes"
                                value={s.description ?? ""}
                                onChange={(e) => update(s.id, { description: e.target.value })}
                            />
                            <Input
                                label="Precio"
                                type="number"
                                inputMode="numeric"
                                min={0}
                                step="1"
                                value={String(s.price ?? 0)}
                                onChange={(e) => update(s.id, { price: Number(e.target.value) })}
                            />
                            <div className="text-xs text-zinc-500">
                                Vista rápida: <span className="font-semibold">{formatMoney(Number(s.price) || 0, props.currency)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button type="button" variant="secondary" onClick={add}>
                    + Agregar servicio
                </Button>

                <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm">
                    Total de servicios: <span className="font-bold">{formatMoney(totalLive, props.currency)}</span>
                </div>
            </div>
        </div>
    );
}
