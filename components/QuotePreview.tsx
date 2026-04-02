"use client";

import type { QuoteDraft } from "@/lib/types";
import { totals } from "@/lib/calc";
import { formatMoney } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { QuotePdfDocument } from "./pdf/QuotePdfDocument";
import { pdf } from "@react-pdf/renderer";

export function QuotePreview(props: {
    draft: QuoteDraft;
    previewId?: string; // id del contenedor para PDF
    onNewQuote: () => void;
}) {
    const { draft } = props;
    const t = totals({
        services: draft.services,
        discountMode: draft.settings.discountMode,
        discountValue: draft.settings.discountValue,
        taxPercent: draft.settings.taxPercent
    });

    const waText = buildWhatsAppText(draft, t.total);
    const waLink = `https://wa.me/?text=${encodeURIComponent(waText)}`;

    const printNow = () => window.print();

    const downloadPDF = async () => {
        const blob = await pdf(<QuotePdfDocument draft={draft} />).toBlob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${draft.quoteNumber}.pdf`;
        a.click();

        URL.revokeObjectURL(url);
    };


    return (
        <div className="grid gap-4">
            <div className="no-print flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="text-sm text-zinc-600">Vista previa</div>
                    <div className="text-lg font-bold">Cotización {draft.quoteNumber}</div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="secondary" onClick={printNow}>
                        Imprimir
                    </Button>
                    <Button type="button" variant="secondary" onClick={downloadPDF}>
                        Descargar PDF
                    </Button>
                    <a href={waLink} target="_blank" rel="noreferrer">
                        <Button type="button" variant="primary">
                            Enviar por WhatsApp
                        </Button>
                    </a>
                </div>
            </div>

            {/* Preview imprimible */}
            <div
                id={props.previewId ?? "quote-preview"}
                className="pdf-safe rounded-2xl border border-zinc-200 bg-white shadow-soft"
            >
                <div className="p-6 sm:p-8">
                    <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-center gap-3">
                            {draft.emitter.logo && (
                                <img
                                    src={draft.emitter.logo}
                                    alt={draft.emitter.name}
                                    className="h-12 w-12 object-contain rounded"
                                />
                            )}

                            <div>
                                <div className="text-xl font-extrabold">
                                    {draft.emitter.name || "Tu nombre / marca"}
                                </div>

                                <div className="text-sm text-zinc-600">
                                    {draft.emitter.contact || "Tu contacto"}
                                </div>

                                {draft.emitter.location && (
                                    <div className="text-sm text-zinc-600">
                                        {draft.emitter.location}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="sm:text-right">
                            <div className="text-sm text-zinc-600">Cotización</div>
                            <div className="text-lg font-bold">{draft.quoteNumber}</div>
                            <div className="mt-1 text-sm text-zinc-600">Fecha: {draft.client.dateISO}</div>
                        </div>
                    </header>

                    <div className="mt-6 rounded-xl bg-zinc-50 p-4 border border-zinc-100">
                        <div className="text-sm font-semibold">Para:</div>
                        <div className="mt-1 text-base font-bold">{draft.client.name || "Nombre del cliente"}</div>
                        {draft.client.company ? <div className="text-sm text-zinc-600">{draft.client.company}</div> : null}
                    </div>

                    <div className="mt-6">
                        <div className="text-sm font-semibold">Servicios</div>
                        <div className="mt-3 overflow-hidden rounded-xl border border-zinc-200">
                            <table className="w-full text-sm">
                                <thead className="bg-zinc-50">
                                    <tr className="text-left">
                                        <th className="px-4 py-3 font-semibold">Detalle</th>
                                        <th className="px-4 py-3 font-semibold text-right">Precio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {draft.services.length === 0 ? (
                                        <tr>
                                            <td className="px-4 py-4 text-zinc-600" colSpan={2}>
                                                (Agrega al menos un servicio)
                                            </td>
                                        </tr>
                                    ) : (
                                        draft.services.map((s) => (
                                            <tr key={s.id} className="border-t border-zinc-200">
                                                <td className="px-4 py-3">
                                                    <div className="font-semibold">{s.name || "Servicio"}</div>
                                                    {s.description ? (
                                                        <div
                                                            className="quote-richtext mt-1 text-zinc-600"
                                                            dangerouslySetInnerHTML={{ __html: s.description }}
                                                        />
                                                    ) : null}
                                                </td>
                                                <td className="px-4 py-3 text-right font-semibold">
                                                    {formatMoney(Number(s.price) || 0, draft.settings.currency)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-zinc-200 p-4">
                            <div className="text-sm font-semibold">Resumen</div>
                            <div className="mt-3 grid gap-2 text-sm">
                                <Row label="Subtotal" value={formatMoney(t.sub, draft.settings.currency)} />
                                <Row
                                    label="Descuento"
                                    value={`- ${formatMoney(t.disc, draft.settings.currency)}`}
                                    muted={t.disc === 0}
                                />
                                <Row
                                    label={`Impuesto (${draft.settings.taxPercent || 0}%)`}
                                    value={formatMoney(t.tax, draft.settings.currency)}
                                    muted={t.tax === 0}
                                />
                                <div className="my-1 h-px bg-zinc-200" />
                                <Row
                                    label="Total a pagar"
                                    value={formatMoney(t.total, draft.settings.currency)}
                                    strong
                                />
                            </div>
                        </div>

                        <div className="rounded-xl border border-zinc-200 p-4">
                            <div className="text-sm font-semibold">Observaciones</div>
                            <div className="mt-2 text-sm text-zinc-700 whitespace-pre-wrap">
                                {draft.settings.notes?.trim()
                                    ? draft.settings.notes
                                    : "—"}
                            </div>
                        </div>
                    </div>

                    <footer className="mt-8 text-xs text-zinc-500">
                        Generado con Intelia SB”.
                    </footer>
                </div>
            </div>

            <div className="no-print">
                <Button type="button" variant="secondary" onClick={props.onNewQuote} className="w-full">
                    Nueva cotización
                </Button>
            </div>
        </div>
    );
}

function Row(props: { label: string; value: string; strong?: boolean; muted?: boolean }) {
    return (
        <div className="flex items-center justify-between gap-3">
            <div className={"text-zinc-700 " + (props.muted ? "opacity-60" : "")}>{props.label}</div>
            <div className={(props.strong ? "font-extrabold text-zinc-900" : "font-semibold")}>
                {props.value}
            </div>
        </div>
    );
}

function buildWhatsAppText(draft: QuoteDraft, total: number) {
    const lines: string[] = [];

    // Saludo
    lines.push(`Hola ${draft.client.name || ""}`);
    lines.push(`Te comparto la cotización de los servicios solicitados:`);
    lines.push(``);

    // Datos de la cotización
    lines.push(`Cotización: ${draft.quoteNumber}`);
    lines.push(`Fecha: ${draft.client.dateISO}`);
    lines.push(``);

    // Emisor
    lines.push(` Emisor:`);
    lines.push(`${draft.emitter.name || ""}`);
    if (draft.emitter.location) lines.push(`${draft.emitter.location}`);
    lines.push(`${draft.emitter.contact || ""}`);
    lines.push(``);

    // Cliente
    lines.push(`Cliente:`);
    lines.push(`${draft.client.name || ""}`);
    if (draft.client.company) lines.push(`${draft.client.company}`);
    lines.push(``);

    // Servicios
    lines.push(`Servicios:`);
    draft.services.forEach((s, i) => {
        const name = s.name || `Servicio ${i + 1}`;
        const price = Number(s.price) || 0;
        lines.push(`• ${name} — ${formatMoney(price, draft.settings.currency)}`);
    });
    lines.push(``);

    // Resumen
    lines.push(`Resumen:`);
    lines.push(`Subtotal: ${formatMoney(
        total +
        (draft.settings.discountMode !== "none"
            ? 0
            : 0),
        draft.settings.currency
    )}`);
    lines.push(`Total a pagar: ${formatMoney(total, draft.settings.currency)}`);
    lines.push(``);

    // Observaciones
    if (draft.settings.notes?.trim()) {
        lines.push(`Observaciones:`);
        lines.push(draft.settings.notes.trim());
        lines.push(``);
    }

    // Cierre
    lines.push(`Quedo atento/a a cualquier duda o ajuste`);
    lines.push(`— ${draft.emitter.name || ""}`);

    return lines.join("\n");
}

