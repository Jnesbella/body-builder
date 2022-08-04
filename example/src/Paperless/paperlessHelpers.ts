import { v4 as uuidv4 } from "uuid";

import { PaperlessPage } from "./paperlessTypes";

export const createPage = (payload?: Partial<PaperlessPage>) => ({
  id: uuidv4(),
  title: "",
  ...payload,
});
