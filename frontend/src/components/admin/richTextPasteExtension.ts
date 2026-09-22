import { Extension } from "@tiptap/core";
import type { Editor } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";

import { uploadEditorImage } from "@/lib/contentImageUpload";
import { cleanPastedHtml } from "@/lib/cleanPastedHtml";

async function insertImageFile(editor: Editor, file: File) {
  const url = await uploadEditorImage(file);
  if (!url) return;

  editor
    .chain()
    .focus()
    .setImage({
      src: url,
      alt: file.name?.trim() || "Inline image",
    })
    .run();
}

function readImageFiles(dataTransfer: DataTransfer | null): File[] {
  if (!dataTransfer) return [];

  const fromList = Array.from(dataTransfer.files ?? []).filter((file) =>
    file.type.startsWith("image/")
  );
  if (fromList.length) return fromList;

  const fromItems: File[] = [];
  for (const item of Array.from(dataTransfer.items ?? [])) {
    if (item.kind === "file" && item.type.startsWith("image/")) {
      const file = item.getAsFile();
      if (file) fromItems.push(file);
    }
  }
  return fromItems;
}

/** Paste/drop HTML and upload pasted image files into the editor. */
export const RichTextPasteExtension = Extension.create({
  name: "richTextPaste",

  addProseMirrorPlugins() {
    const editor = this.editor;

    return [
      new Plugin({
        props: {
          handlePaste(_view, event) {
            const clipboard = event.clipboardData;
            if (!clipboard) return false;

            const imageFiles = readImageFiles(clipboard);
            if (imageFiles.length) {
              event.preventDefault();
              void insertImageFile(editor, imageFiles[0]);
              return true;
            }

            const html = clipboard.getData("text/html")?.trim();
            if (!html || html.length < 2) return false;

            event.preventDefault();

            const cleaned = cleanPastedHtml(html);
            if (!cleaned) return false;

            const loneImg = cleaned.match(/^<img[^>]+src=["']([^"']+)["'][^>]*\/?>\s*$/i);
            if (loneImg?.[1]) {
              editor
                .chain()
                .focus()
                .setImage({ src: loneImg[1], alt: "Inline image" })
                .run();
              return true;
            }

            editor.commands.insertContent(cleaned, {
              parseOptions: {
                preserveWhitespace: false,
              },
            });

            return true;
          },
          handleDrop(_view, event) {
            const imageFiles = readImageFiles(event.dataTransfer);
            if (!imageFiles.length) return false;

            event.preventDefault();
            void insertImageFile(editor, imageFiles[0]);
            return true;
          },
        },
      }),
    ];
  },
});
