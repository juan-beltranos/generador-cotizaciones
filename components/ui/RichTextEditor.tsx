"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type Props = {
    label?: string;
    value: string;
    placeholder?: string;
    onChange: (html: string) => void;
};

export function RichTextEditor({
    label,
    value,
    placeholder,
    onChange,
}: Props) {
    const editor = useEditor({
        extensions: [StarterKit],
        immediatelyRender: false,
        content: value || "<p></p>",
        editorProps: {
            attributes: {
                class: "tiptap min-h-[140px] px-3 py-3 text-sm focus:outline-none",
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) return null;

    return (
        <div className="grid gap-1.5">
            {label ? (
                <label className="text-sm font-medium text-zinc-900">{label}</label>
            ) : null}

            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                <div className="flex flex-wrap gap-2 border-b border-zinc-200 bg-zinc-50 p-2">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`rounded-md px-2 py-1 text-xs border ${editor.isActive("bold")
                                ? "bg-zinc-900 text-white border-zinc-900"
                                : "bg-white text-zinc-700 border-zinc-200"
                            }`}
                    >
                        Negrita
                    </button>

                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`rounded-md px-2 py-1 text-xs border ${editor.isActive("italic")
                                ? "bg-zinc-900 text-white border-zinc-900"
                                : "bg-white text-zinc-700 border-zinc-200"
                            }`}
                    >
                        Cursiva
                    </button>

                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`rounded-md px-2 py-1 text-xs border ${editor.isActive("bulletList")
                                ? "bg-zinc-900 text-white border-zinc-900"
                                : "bg-white text-zinc-700 border-zinc-200"
                            }`}
                    >
                        Bullets
                    </button>

                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={`rounded-md px-2 py-1 text-xs border ${editor.isActive("orderedList")
                                ? "bg-zinc-900 text-white border-zinc-900"
                                : "bg-white text-zinc-700 border-zinc-200"
                            }`}
                    >
                        Numeración
                    </button>

                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setParagraph().run()}
                        className={`rounded-md px-2 py-1 text-xs border ${editor.isActive("paragraph")
                                ? "bg-zinc-900 text-white border-zinc-900"
                                : "bg-white text-zinc-700 border-zinc-200"
                            }`}
                    >
                        Párrafo
                    </button>

                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        className={`rounded-md px-2 py-1 text-xs border ${editor.isActive("heading", { level: 3 })
                                ? "bg-zinc-900 text-white border-zinc-900"
                                : "bg-white text-zinc-700 border-zinc-200"
                            }`}
                    >
                        Título
                    </button>

                    <button
                        type="button"
                        onClick={() => editor.chain().focus().undo().run()}
                        className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700"
                    >
                        Deshacer
                    </button>

                    <button
                        type="button"
                        onClick={() => editor.chain().focus().redo().run()}
                        className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700"
                    >
                        Rehacer
                    </button>
                </div>

                <EditorContent editor={editor} />

                {(!value || value === "<p></p>") && placeholder ? (
                    <div className="pointer-events-none px-3 pb-3 text-xs text-zinc-400">
                        {placeholder}
                    </div>
                ) : null}
            </div>
        </div>
    );
}