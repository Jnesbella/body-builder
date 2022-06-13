import { Element } from "slate";

import { ListType } from "../../../typings-slate";

import { LIST_TYPES } from "./slateConstants";

export const isListType = (type: Element["type"]) => {
  return LIST_TYPES.includes(type as ListType);
};
