"use client";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "danger";
};

const styles: Record<NonNullable<Props["variant"]>, string> = {
    primary:
        "bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-900",
    secondary:
        "bg-white text-zinc-900 hover:bg-zinc-50 border border-zinc-200",
    danger:
        "bg-red-600 text-white hover:bg-red-500 border border-red-600"
};

export function Button({ variant = "primary", className = "", ...props }: Props) {
    return (
        <button
            className={
                "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold " +
                "shadow-sm active:scale-[0.99] transition " +
                styles[variant] +
                " " +
                className
            }
            {...props}
        />
    );
}
