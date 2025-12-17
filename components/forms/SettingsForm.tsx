"use client";

import type { Settings } from "@/lib/types";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { TogglePill } from "@/components/ui/TogglePill";

export function SettingsForm(props: {
    value: Settings;
    onChange: (next: Settings) => void;
}) {
    const v = props.value;

    return (
        <div className="grid gap-5">
            <Select
                label="Moneda"
                value={v.currency}
                onChange={(e) => props.onChange({ ...v, currency: e.target.value as Settings["currency"] })}
            >
                <option value="COP">COP (Colombia)</option>
                <option value="USD">USD (Dólar)</option>
                <option value="EUR">EUR (Euro)</option>
                <option value="MXN">MXN (México)</option>
                <option value="ARS">ARS (Argentina)</option>
                <option value="CLP">CLP (Chile)</option>
            </Select>

            <TogglePill
                label="Descuento (opcional)"
                value={v.discountMode}
                onChange={(discountMode) => props.onChange({ ...v, discountMode, discountValue: 0 })}
                options={[
                    { value: "none", label: "No" },
                    { value: "fixed", label: "Valor" },
                    { value: "percent", label: "%" }
                ]}
            />

            {v.discountMode !== "none" ? (
                <Input
                    label={v.discountMode === "fixed" ? "Descuento en dinero" : "Descuento en porcentaje"}
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step="1"
                    value={String(v.discountValue ?? 0)}
                    onChange={(e) => props.onChange({ ...v, discountValue: Number(e.target.value) })}
                />
            ) : null}

            <Input
                label="Impuesto (opcional)"
                hint="Escribe un porcentaje. Ej: 19"
                type="number"
                inputMode="numeric"
                min={0}
                step="1"
                value={String(v.taxPercent ?? 0)}
                onChange={(e) => props.onChange({ ...v, taxPercent: Number(e.target.value) })}
            />

            <Textarea
                label="Observaciones / condiciones"
                hint="Ej: Tiempo de entrega, forma de pago, validez de la cotización, etc."
                placeholder="Escribe aquí lo que quieras aclarar al cliente."
                value={v.notes}
                onChange={(e) => props.onChange({ ...v, notes: e.target.value })}
            />
        </div>
    );
}
