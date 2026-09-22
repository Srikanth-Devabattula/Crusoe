"use client";

import { useEffect, useRef, useState } from "react";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { FontSize } from "@tiptap/extension-text-style/font-size";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Image as ImageIcon,
  Italic,
  Minus,
  Plus,
  List,
  ListOrdered,
  Redo2,
  Strikethrough,
  Table as TableIcon,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";

import { cn } from "@/lib/cn";
import { uploadEditorImage } from "@/lib/contentImageUpload";

import {
  RICH_TEXT_FONT_SIZES,
  stepRichTextFontSize,
} from "./richTextFontSizes";
import { RichTextPasteExtension } from "./richTextPasteExtension";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  "aria-invalid"?: boolean;
};

function ToolbarButton({
  onClick,
  active,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md border text-gray-700 transition",
        active
          ? "border-brand/40 bg-brand/10 text-brand"
          : "border-transparent hover:border-gray-200 hover:bg-gray-50",
        disabled && "cursor-not-allowed opacity-40"
      )}
    >
      {children}
    </button>
  );
}

const editorExtensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
    link: false,
  }),
  Link.configure({
    openOnClick: false,
    autolink: true,
    linkOnPaste: true,
    HTMLAttributes: {
      rel: "noopener noreferrer",
      target: "_blank",
    },
  }),
  TextStyle,
  FontSize,
  Underline,
  Image.configure({
    inline: false,
    allowBase64: false,
    HTMLAttributes: {
      class: "rich-text-inline-image",
    },
    resize: {
      enabled: true,
      directions: [
        "right",
        "bottom",
        "left",
        "top-left",
        "top-right",
        "bottom-left",
        "bottom-right",
      ],
      minWidth: 80,
      minHeight: 80,
      alwaysPreserveAspectRatio: true,
    },
  }),
  Table.configure({
    resizable: true,
    HTMLAttributes: {
      class: "rich-text-table",
    },
  }),
  TableRow,
  TableHeader,
  TableCell,
  TextAlign.configure({
    types: ["heading", "paragraph"],
    alignments: ["left", "center", "right", "justify"],
  }),
  RichTextPasteExtension,
];

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  "aria-invalid": ariaInvalid,
}: RichTextEditorProps) {
  const skipExternalSync = useRef(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [, setToolbarRevision] = useState(0);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: editorExtensions,
    content: value || "<p></p>",
    editorProps: {
      attributes: {
        class:
          "rich-text-editor__content min-h-[280px] px-4 py-3 text-sm leading-relaxed text-gray-900 focus:outline-none",
        "data-placeholder": placeholder ?? "",
        ...(ariaInvalid ? { "aria-invalid": "true" } : {}),
      },
      transformPastedHTML(html) {
        return html;
      },
    },
    onUpdate: ({ editor: ed }) => {
      skipExternalSync.current = true;
      onChange(ed.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (skipExternalSync.current) {
      skipExternalSync.current = false;
      return;
    }
    const current = editor.getHTML();
    const next = value || "<p></p>";
    if (next !== current) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
  }, [editor, value]);

  useEffect(() => {
    if (!editor) return;
    const refreshToolbar = () => setToolbarRevision((n) => n + 1);
    editor.on("selectionUpdate", refreshToolbar);
    editor.on("transaction", refreshToolbar);
    return () => {
      editor.off("selectionUpdate", refreshToolbar);
      editor.off("transaction", refreshToolbar);
    };
  }, [editor]);

  if (!editor) {
    return (
      <div className="min-h-[320px] animate-pulse rounded-lg border border-gray-200 bg-gray-50" />
    );
  }

  const insertTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  const pickImage = () => imageInputRef.current?.click();

  const onImageFileSelected = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !file.type.startsWith("image/")) return;

    const url = await uploadEditorImage(file);
    if (!url) return;

    editor
      .chain()
      .focus()
      .setImage({ src: url, alt: file.name || "Inline image" })
      .run();
  };

  const currentFontSize = editor.getAttributes("textStyle").fontSize as
    | string
    | undefined;

  const applyFontSize = (size: string) => {
    if (!size) {
      editor.chain().focus().unsetFontSize().run();
      return;
    }
    editor.chain().focus().setFontSize(size).run();
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border bg-white shadow-sm transition focus-within:ring-2 focus-within:ring-brand/20",
        ariaInvalid ? "border-red-400" : "border-gray-200 focus-within:border-brand"
      )}
    >
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-100 bg-gray-50/80 px-2 py-2">
        <ToolbarButton
          label="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Underline"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Strikethrough"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>

        <span className="mx-1 h-6 w-px bg-gray-200" aria-hidden />

        <ToolbarButton
          label="Decrease font size"
          onClick={() =>
            applyFontSize(stepRichTextFontSize(currentFontSize, "down"))
          }
        >
          <Minus className="h-4 w-4" />
        </ToolbarButton>
        <label className="sr-only" htmlFor="rich-text-font-size">
          Font size
        </label>
        <select
          id="rich-text-font-size"
          value={currentFontSize ?? ""}
          onChange={(event) => applyFontSize(event.target.value)}
          className="h-8 max-w-[5.5rem] rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-800 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          title="Font size"
        >
          <option value="">Default</option>
          {RICH_TEXT_FONT_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <ToolbarButton
          label="Increase font size"
          onClick={() =>
            applyFontSize(stepRichTextFontSize(currentFontSize, "up"))
          }
        >
          <Plus className="h-4 w-4" />
        </ToolbarButton>

        <span className="mx-1 h-6 w-px bg-gray-200" aria-hidden />

        <ToolbarButton
          label="Bullet list"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Insert table" onClick={insertTable}>
          <TableIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Insert image" onClick={pickImage}>
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onImageFileSelected}
        />

        <span className="mx-1 h-6 w-px bg-gray-200" aria-hidden />

        <ToolbarButton
          label="Align left"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
        >
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Align center"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
        >
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Align right"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
        >
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Justify"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          active={editor.isActive({ textAlign: "justify" })}
        >
          <AlignJustify className="h-4 w-4" />
        </ToolbarButton>

        <span className="mx-1 h-6 w-px bg-gray-200" aria-hidden />

        <ToolbarButton
          label="Undo"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Redo"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo2 className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
