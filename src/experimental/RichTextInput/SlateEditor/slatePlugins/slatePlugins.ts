import { CustomEditor } from "../../../../typings-slate";

import { withImages } from "./slateImages";

const PLUGINS = [withImages];

export function withPlugins(editor: CustomEditor) {
  return PLUGINS.reduce((e, plugin) => plugin(e), editor);
}
