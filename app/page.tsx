"use client";

import { useEffect, useMemo, useState } from "react";
import { Stepper } from "@/components/Stepper";
import { Card } from "@/components/Card";
import { Button } from "@/components/ui/Button";

import { EmitterForm } from "@/components/forms/EmitterForm";
import { ClientForm } from "@/components/forms/ClientForm";
import { ServicesForm } from "@/components/forms/ServicesForm";
import { SettingsForm } from "@/components/forms/SettingsForm";
import { QuotePreview } from "@/components/QuotePreview";

import type { QuoteDraft, Emitter, Client, ServiceItem, Settings } from "@/lib/types";
import { lsGet, lsSet } from "@/lib/storage";
import { nextQuoteNumber } from "@/lib/quoteNumber";
import { todayISO } from "@/lib/format";

const LS_EMITTER = "gc:emitter";

function defaultEmitter(): Emitter {
  return { name: "", contact: "", location: "" };
}

function defaultClient(): Client {
  return { name: "", company: "", dateISO: todayISO() };
}

function defaultSettings(): Settings {
  return {
    currency: "COP",
    discountMode: "none",
    discountValue: 0,
    taxPercent: 0,
    notes: ""
  };
}

function defaultServices(): ServiceItem[] {
  return [{ id: crypto.randomUUID(), name: "", description: "", price: 0 }];
}

export default function HomePage() {
  const steps = ["Tus datos", "Cliente", "Servicios", "Ajustes", "Resultado"];
  const [step, setStep] = useState(0);

  const [emitter, setEmitter] = useState<Emitter>(defaultEmitter());
  const [client, setClient] = useState<Client>(defaultClient());
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings());
  const [quoteNumber, setQuoteNumber] = useState<string>("");

  // Cargar emisor de LocalStorage (reutilizable)
  useEffect(() => {
    const saved = lsGet<Emitter>(LS_EMITTER, defaultEmitter());
    setEmitter(saved);

    // Nueva cotización al entrar
    setQuoteNumber(nextQuoteNumber());
    setServices(defaultServices());
  }, []);

  // Persistir emisor automáticamente
  useEffect(() => {
    lsSet(LS_EMITTER, emitter);
  }, [emitter]);

  const draft: QuoteDraft = useMemo(
    () => ({
      quoteNumber,
      emitter,
      client,
      services,
      settings
    }),
    [quoteNumber, emitter, client, services, settings]
  );

  const canNext = useMemo(() => {
    if (step === 0) return emitter.name.trim() && emitter.contact.trim();
    if (step === 1) return client.name.trim() && client.dateISO.trim();
    if (step === 2) return services.length > 0 && services.every(s => (s.name.trim() && (Number(s.price) || 0) >= 0));
    return true;
  }, [step, emitter, client, services]);

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const newQuote = () => {
    setClient(defaultClient());
    setServices(defaultServices());
    setSettings(defaultSettings());
    setQuoteNumber(nextQuoteNumber());
    setStep(0);
    // emisor NO se borra (se reutiliza), por UX comercial.
  };

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
        <header className="no-print">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                Generador de Cotizaciones
              </h1>
              <p className="mt-2 text-sm sm:text-base text-zinc-600">
                Crea una cotización profesional en minutos (sin Excel ni plantillas).
              </p>
            </div>

            <div className="hidden sm:block text-right">
              <div className="text-xs text-zinc-500">Número</div>
              <div className="text-sm font-bold">{quoteNumber || "—"}</div>
            </div>
          </div>

          <div className="mt-5">
            <Stepper steps={steps} current={step} />
          </div>
        </header>

        <div className="mt-6 grid gap-4">
          {step === 0 ? (
            <Card
              title="Tus datos"
              subtitle="Esto saldrá en la cotización. Se guarda para que no lo repitas."
            >
              <EmitterForm value={emitter} onChange={setEmitter} />
            </Card>
          ) : null}

          {step === 1 ? (
            <Card title="Datos del cliente" subtitle="¿A quién le vas a enviar esta cotización?">
              <ClientForm value={client} onChange={setClient} />
            </Card>
          ) : null}

          {step === 2 ? (
            <Card title="Servicios" subtitle="Agrega lo que vas a entregar y su precio.">
              <ServicesForm value={services} currency={settings.currency} onChange={setServices} />
            </Card>
          ) : null}

          {step === 3 ? (
            <Card title="Ajustes finales" subtitle="Opcional: descuento, impuesto y condiciones.">
              <SettingsForm value={settings} onChange={setSettings} />
            </Card>
          ) : null}

          {step === 4 ? (
            <QuotePreview draft={draft} previewId="quote-preview" onNewQuote={newQuote} />
          ) : null}

          {/* Navegación */}
          <div className="no-print flex items-center justify-between gap-3">
            <Button type="button" variant="secondary" onClick={back} disabled={step === 0}>
              Atrás
            </Button>

            <div className="text-xs text-zinc-500">
              Paso {step + 1} de {steps.length}
            </div>

            {step < 4 ? (
              <Button type="button" onClick={next} disabled={!canNext}>
                Siguiente
              </Button>
            ) : (
              <span className="w-[92px]" />
            )}
          </div>

          {step < 4 && !canNext ? (
            <div className="no-print rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              Completa los campos principales para continuar.
            </div>
          ) : null}
        </div>

        <footer className="no-print mt-10 text-center text-xs text-zinc-500">
          Hecho para freelancers. 100% desde tu navegador.
        </footer>
      </div>
    </main>
  );
}
