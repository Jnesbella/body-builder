import { withLists } from "./slateLists";
import { withImages } from "./slateImages";

export function withPlugins() {
  withImages();
  withLists();
}
