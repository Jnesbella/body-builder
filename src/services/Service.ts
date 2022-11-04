import { compact } from "lodash";
import { QueryKey } from "react-query";

import { PathParts } from "../types";

import Fetch, { FetchOptions } from "./Fetch/Fetch";

export interface ServiceOptions {
  queryKey: string;
  pathRoot: string;
  fetch: Fetch;
}

class Service {
  static assemblePath(parts: PathParts = []): string {
    return Array.isArray(parts) ? compact(parts).join("/") : `${parts}`;
  }

  static toPathPartsArray = (parts: PathParts = []) =>
    Array.isArray(parts) ? parts : [parts];

  static combinePathParts = (
    parts: PathParts = [],
    otherParts: PathParts = []
  ) => [
    ...Service.toPathPartsArray(parts),
    ...Service.toPathPartsArray(otherParts),
  ];

  queryKey: string;
  pathRoot: string;
  local: Fetch;

  constructor({ queryKey, pathRoot, fetch }: ServiceOptions) {
    this.queryKey = queryKey;
    this.pathRoot = pathRoot;
    this.local = fetch;
  }

  getQueryKey = (parts: PathParts = []): QueryKey => {
    return Service.combinePathParts(this.queryKey, parts);
  };

  getPath = (parts: PathParts = []): string => {
    const pathParts = Service.combinePathParts(this.pathRoot, parts);
    return Service.assemblePath(pathParts);
  };

  get = <TData = any>(
    parts: PathParts = [],
    payload?: any,
    fetchOptions?: FetchOptions
  ) => {
    const slug = this.getPath(parts);
    return this.local.get<TData>(slug, payload, fetchOptions);
  };

  post = <TData = any>(
    parts: PathParts = [],
    payload?: any,
    fetchOptions?: FetchOptions
  ) => {
    const slug = this.getPath(parts);
    return this.local.post<TData>(slug, payload, fetchOptions);
  };

  delete = <TData = any>(
    parts: PathParts = [],
    fetchOptions?: FetchOptions
  ) => {
    const slug = this.getPath(parts);
    return this.local.delete<TData>(slug, undefined, fetchOptions);
  };

  put = <TData = any>(
    parts: PathParts = [],
    payload?: any,
    fetchOptions?: FetchOptions
  ) => {
    const slug = this.getPath(parts);
    return this.local.put<TData>(slug, payload, fetchOptions);
  };

  patch = <TData = any>(
    parts: PathParts = [],
    payload?: any,
    fetchOptions?: FetchOptions
  ) => {
    const slug = this.getPath(parts);
    return this.local.patch<TData>(slug, payload, fetchOptions);
  };
}

export default Service;
