"use client";

export function Card(props: { title: string; subtitle?: string; children: React.ReactNode }) {
    return (
        <section className="rounded-2xl bg-white shadow-soft border border-zinc-100">
            <div className="p-5 border-b border-zinc-100">
                <h2 className="text-base font-bold">{props.title}</h2>
                {props.subtitle ? (
                    <p className="mt-1 text-sm text-zinc-600">{props.subtitle}</p>
                ) : null}
            </div>
            <div className="p-5">{props.children}</div>
        </section>
    );
}
