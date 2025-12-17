"use client";

type Option<T extends string> = { value: T; label: string };

export function TogglePill<T extends string>(props: {
    label: string;
    value: T;
    onChange: (v: T) => void;
    options: Option<T>[];
}) {
    return (
        <div>
            <div className="text-sm font-medium text-zinc-800">{props.label}</div>
            <div className="mt-2 inline-flex rounded-xl border border-zinc-200 bg-white p-1">
                {props.options.map((opt) => {
                    const active = opt.value === props.value;
                    return (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => props.onChange(opt.value)}
                            className={
                                "px-3 py-1.5 text-sm rounded-lg transition " +
                                (active
                                    ? "bg-zinc-900 text-white"
                                    : "text-zinc-700 hover:bg-zinc-50")
                            }
                        >
                            {opt.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
