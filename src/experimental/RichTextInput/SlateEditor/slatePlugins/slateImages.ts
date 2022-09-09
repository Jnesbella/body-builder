import { CustomEditor } from "../../../../typings-slate";

export function withImages(editor: CustomEditor) {
  const { isVoid } = editor;

  editor.isVoid = (element) => {
    return element.type === "image" ? true : isVoid(element);
  };

  return editor;
}
