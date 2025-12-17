"use client";

import type { Client } from "@/lib/types";
import { Input } from "@/components/ui/Input";

export function ClientForm(props: {
    value: Client;
    onChange: (next: Client) => void;
}) {
    const v = props.value;

    return (
        <div className="grid gap-4">
            <Input
                label="Nombre del cliente"
                placeholder="Ej: Andrés Pérez"
                value={v.name}
                onChange={(e) => props.onChange({ ...v, name: e.target.value })}
            />
            <Input
                label="Empresa (opcional)"
                placeholder="Ej: ACME S.A.S."
                value={v.company ?? ""}
                onChange={(e) => props.onChange({ ...v, company: e.target.value })}
            />
            <Input
                label="Fecha de la cotización"
                type="date"
                value={v.dateISO}
                onChange={(e) => props.onChange({ ...v, dateISO: e.target.value })}
            />
            <p className="text-xs text-zinc-500">
                Tip: puedes ajustar la fecha si estás creando una cotización para otro día.
            </p>
        </div>
    );
}
