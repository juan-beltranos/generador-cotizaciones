"use client";

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
    label: string;
};

export function Select({ label, className = "", children, ...props }: Props) {
    return (
        <label className="block">
            <span className="text-sm font-medium text-zinc-800">{label}</span>
            <select
                className={
                    "mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm " +
                    "outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 " +
                    className
                }
                {...props}
            >
                {children}
            </select>
        </label>
    );
}
