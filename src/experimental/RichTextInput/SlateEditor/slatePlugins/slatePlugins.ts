import { CustomEditor } from "../../../../typings-slate";

import { withHTML } from "./slateHTML";
import { withImages } from "./slateImages";

const PLUGINS = [
  withImages,
  // withHTML,
];

export function withPlugins(editor: CustomEditor) {
  return PLUGINS.reduce((e, plugin) => plugin(e), editor);
}
