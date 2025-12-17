"use client";

import type { Emitter } from "@/lib/types";
import { Input } from "@/components/ui/Input";

export function EmitterForm(props: {
    value: Emitter;
    onChange: (next: Emitter) => void;
}) {
    const v = props.value;

    return (
        <div className="grid gap-4">
            <Input
                label="Tu nombre o marca"
                placeholder="Ej: Laura Gómez / Estudio Creativo Lumen"
                value={v.name}
                onChange={(e) => props.onChange({ ...v, name: e.target.value })}
            />
            <Input
                label="Tu contacto (Email o WhatsApp)"
                hint="Ej: correo@dominio.com o +57 300 000 0000"
                placeholder="Escribe tu email o número"
                value={v.contact}
                onChange={(e) => props.onChange({ ...v, contact: e.target.value })}
            />
            <Input
                label="Ciudad o país (opcional)"
                placeholder="Ej: Bogotá, Colombia"
                value={v.location ?? ""}
                onChange={(e) => props.onChange({ ...v, location: e.target.value })}
            />
            <p className="text-xs text-zinc-500">
                Guardaremos estos datos en tu dispositivo para que no los repitas.
            </p>
        </div>
    );
}
