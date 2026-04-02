"use client";

import type { Emitter } from "@/lib/types";
import { Input } from "@/components/ui/Input";

export function EmitterForm(props: {
    value: Emitter;
    onChange: (next: Emitter) => void;
}) {
    const v = props.value;

    const fileToPngDataUrl = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                const img = new window.Image();

                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const maxWidth = 600;
                    const scale = Math.min(1, maxWidth / img.width);

                    canvas.width = Math.max(1, Math.round(img.width * scale));
                    canvas.height = Math.max(1, Math.round(img.height * scale));

                    const ctx = canvas.getContext("2d");
                    if (!ctx) {
                        reject(new Error("No se pudo crear el canvas"));
                        return;
                    }

                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    resolve(canvas.toDataURL("image/png"));
                };

                img.onerror = () => reject(new Error("No se pudo leer la imagen"));
                img.src = reader.result as string;
            };

            reader.onerror = () => reject(new Error("No se pudo cargar el archivo"));
            reader.readAsDataURL(file);
        });
    };

    const handleLogoUpload = async (file: File) => {
        try {
            const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
            if (!allowed.includes(file.type)) {
                alert("Solo se permiten PNG, JPG o WEBP.");
                return;
            }

            const pngBase64 = await fileToPngDataUrl(file);
            props.onChange({ ...v, logo: pngBase64 });
        } catch (error) {
            console.error(error);
            alert("No se pudo procesar el logo.");
        }
    };

    return (
        <div className="grid gap-4">
            <Input
                label="Tu nombre o marca"
                placeholder="Ej: Laura Gómez / Estudio Creativo Lumen"
                value={v.name}
                onChange={(e) => props.onChange({ ...v, name: e.target.value })}
            />

            <div className="grid gap-2">
                <label className="text-sm font-medium">Logo (opcional)</label>

                <input
                    id="logo-upload"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleLogoUpload(file);
                    }}
                    className="hidden"
                />

                <label
                    htmlFor="logo-upload"
                    className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-5 text-sm text-zinc-600 transition hover:border-zinc-400 hover:bg-zinc-100"
                >
                    <span className="font-medium">Haz clic para seleccionar tu logo</span>
                </label>

                <p className="text-xs text-zinc-500">
                    Formatos permitidos: PNG, JPG o WEBP.
                </p>

                {v.logo && (
                    <div className="rounded-xl border border-zinc-200 p-3">
                        <div className="mb-2 text-xs font-medium text-zinc-500">
                            Vista previa del logo
                        </div>
                        <img
                            src={v.logo}
                            alt="Logo"
                            className="h-16 object-contain"
                        />
                    </div>
                )}
            </div>

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
                Puedes subir un logo o dejar solo el nombre. Guardaremos estos datos en tu dispositivo.
            </p>
        </div>
    );
}