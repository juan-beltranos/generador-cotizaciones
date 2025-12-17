"use client";

import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { QuoteDraft } from "@/lib/types";
import { totals } from "@/lib/calc";
import { formatMoney } from "@/lib/format";

const styles = StyleSheet.create({
    page: { padding: 28, fontSize: 11, fontFamily: "Helvetica" },
    headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 14 },
    h1: { fontSize: 16, fontWeight: "bold" },
    muted: { color: "#52525b" },
    card: { border: "1px solid #e4e4e7", borderRadius: 10, padding: 12, marginTop: 10 },
    sectionTitle: { fontSize: 12, fontWeight: "bold", marginBottom: 8 },
    tableHeader: { flexDirection: "row", borderBottom: "1px solid #e4e4e7", paddingBottom: 6, marginTop: 8 },
    row: { flexDirection: "row", paddingVertical: 7, borderBottom: "1px solid #f4f4f5" },
    colLeft: { width: "75%" },
    colRight: { width: "25%", textAlign: "right" as const },
    bold: { fontWeight: "bold" },
    footer: { marginTop: 18, fontSize: 9, color: "#71717a" }
});

export function QuotePdfDocument({ draft }: { draft: QuoteDraft }) {
    const t = totals({
        services: draft.services,
        discountMode: draft.settings.discountMode,
        discountValue: draft.settings.discountValue,
        taxPercent: draft.settings.taxPercent
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.headerRow}>
                    <View>
                        <Text style={styles.h1}>{draft.emitter.name || "Tu nombre / marca"}</Text>
                        <Text style={styles.muted}>{draft.emitter.contact || "Tu contacto"}</Text>
                        {draft.emitter.location ? <Text style={styles.muted}>{draft.emitter.location}</Text> : null}
                    </View>

                    <View style={{ alignItems: "flex-end" }}>
                        <Text style={styles.muted}>Cotización</Text>
                        <Text style={[styles.h1, { fontSize: 14 }]}>{draft.quoteNumber}</Text>
                        <Text style={styles.muted}>Fecha: {draft.client.dateISO}</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Para</Text>
                    <Text style={styles.bold}>{draft.client.name || "Nombre del cliente"}</Text>
                    {draft.client.company ? <Text style={styles.muted}>{draft.client.company}</Text> : null}
                </View>

                <View style={{ marginTop: 14 }}>
                    <Text style={styles.sectionTitle}>Servicios</Text>

                    <View style={styles.tableHeader}>
                        <Text style={[styles.colLeft, styles.bold]}>Detalle</Text>
                        <Text style={[styles.colRight, styles.bold]}>Precio</Text>
                    </View>

                    {draft.services.map((s) => (
                        <View key={s.id} style={styles.row}>
                            <View style={styles.colLeft}>
                                <Text style={styles.bold}>{s.name || "Servicio"}</Text>
                                {s.description ? <Text style={styles.muted}>{s.description}</Text> : null}
                            </View>
                            <Text style={[styles.colRight, styles.bold]}>
                                {formatMoney(Number(s.price) || 0, draft.settings.currency)}
                            </Text>
                        </View>
                    ))}
                </View>

                <View style={{ marginTop: 14, flexDirection: "row", gap: 10 }}>
                    <View style={[styles.card, { flex: 1 }]}>
                        <Text style={styles.sectionTitle}>Resumen</Text>
                        <Row label="Subtotal" value={formatMoney(t.sub, draft.settings.currency)} />
                        <Row label="Descuento" value={`- ${formatMoney(t.disc, draft.settings.currency)}`} />
                        <Row label={`Impuesto (${draft.settings.taxPercent || 0}%)`} value={formatMoney(t.tax, draft.settings.currency)} />
                        <View style={{ marginTop: 8, borderTop: "1px solid #e4e4e7", paddingTop: 8 }}>
                            <Row label="Total a pagar" value={formatMoney(t.total, draft.settings.currency)} strong />
                        </View>
                    </View>

                    <View style={[styles.card, { flex: 1 }]}>
                        <Text style={styles.sectionTitle}>Observaciones</Text>
                        <Text>{draft.settings.notes?.trim() ? draft.settings.notes : "—"}</Text>
                    </View>
                </View>

                <Text style={styles.footer}>Generado con Intelia SB.</Text>
            </Page>
        </Document>
    );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
    return (
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 6 }}>
            <Text style={{ color: "#3f3f46" }}>{label}</Text>
            <Text style={{ fontWeight: strong ? "bold" : "normal" }}>{value}</Text>
        </View>
    );
}
