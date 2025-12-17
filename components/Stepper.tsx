"use client";

export function Stepper(props: {
    steps: string[];
    current: number; // 0-based
}) {
    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {props.steps.map((s, idx) => {
                const active = idx === props.current;
                const done = idx < props.current;
                return (
                    <div key={s} className="flex items-center gap-2 shrink-0">
                        <div
                            className={
                                "h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold border " +
                                (active
                                    ? "bg-zinc-900 text-white border-zinc-900"
                                    : done
                                        ? "bg-zinc-100 text-zinc-900 border-zinc-200"
                                        : "bg-white text-zinc-500 border-zinc-200")
                            }
                            aria-label={`Paso ${idx + 1}`}
                        >
                            {idx + 1}
                        </div>
                        <div className={"text-sm " + (active ? "font-semibold" : "text-zinc-600")}>
                            {s}
                        </div>
                        {idx !== props.steps.length - 1 ? (
                            <div className="w-6 h-px bg-zinc-200" />
                        ) : null}
                    </div>
                );
            })}
        </div>
    );
}
