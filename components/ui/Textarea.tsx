"use client";

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string;
    hint?: string;
};

export function Textarea({ label, hint, className = "", ...props }: Props) {
    return (
        <label className="block">
            <span className="text-sm font-medium text-zinc-800">{label}</span>
            {hint ? <div className="text-xs text-zinc-500 mt-1">{hint}</div> : null}
            <textarea
                className={
                    "mt-2 w-full min-h-[110px] rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm " +
                    "outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 " +
                    className
                }
                {...props}
            />
        </label>
    );
}
