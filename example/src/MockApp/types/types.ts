import * as React from "react";
import {
  ResourceDocument,
  ResourceDocumentId,
  RichTextEditorProps,
} from "@jnesbella/body-builder";

export interface Note extends ResourceDocument {
  content?: RichTextEditorProps["value"];
  createdAt: string;
  modifiedAt: string;
  pinned?: boolean;

  tags?: Tag[];
  tagIds?: Tag["id"][];
}

interface BaseFilter {
  filterBy: string;
}

export interface TagFilter extends BaseFilter {
  filterBy: "tags";
  tagId: ResourceDocumentId;
}

export interface ElementFilter extends BaseFilter {
  filterBy: "element";
  elementType: string;
}

export type Filter = TagFilter | ElementFilter;

export interface Search {
  filters: Filter[];
}

export interface Channel extends ResourceDocument, Search {
  name: string;
}

export interface Tag extends ResourceDocument {
  label: string;
}

export interface AppState {
  search: Search;
}

export interface AppActions {
  setSearch: React.Dispatch<React.SetStateAction<Search>>;
}
