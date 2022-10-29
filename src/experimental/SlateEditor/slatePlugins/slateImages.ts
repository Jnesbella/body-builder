import { CustomEditor } from "../../../slateTypings";

export function withImages(editor: CustomEditor) {
  const { isVoid, isInline } = editor;

  editor.isInline = (element) => {
    return element.type === "image" ? true : isInline(element);
  };

  editor.isVoid = (element) => {
    return element.type === "image" ? true : isVoid(element);
  };

  return editor;
}
