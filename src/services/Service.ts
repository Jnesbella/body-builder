import { compact } from "lodash";

import { PathParts } from "../types";
import { log } from "../utils";

import Fetch, { FetchState, FetchOptions } from "./Fetch";

export interface ServiceOptions {
  queryKey: string;
  pathRoot: string;
  fetch: Fetch;
}

const global = new Fetch();

class Service {
  static globals(nextState: FetchState) {
    global.setState(nextState);
  }

  static assemblePath(parts: PathParts = []): string {
    return Array.isArray(parts) ? compact(parts).join("/") : `${parts}`;
  }

  static get<T = unknown>(
    parts: PathParts,
    payload?: any,
    fetchOptions?: FetchOptions
  ) {
    return global.get(
      Service.assemblePath(parts),
      payload,
      fetchOptions
    ) as Promise<T>;
  }

  static post<T = unknown>(parts: PathParts, payload?: any) {
    return global.post(Service.assemblePath(parts), payload) as Promise<T>;
  }

  static delete<T = unknown>(parts: PathParts) {
    return global.delete(Service.assemblePath(parts)) as Promise<T>;
  }

  static spreadParts = (parts: PathParts = []) =>
    Array.isArray(parts) ? parts : [parts];

  queryKey: string;
  pathRoot: string;
  local: Fetch;

  constructor({ queryKey, pathRoot, fetch }: ServiceOptions) {
    this.queryKey = queryKey;
    this.pathRoot = pathRoot;
    this.local = fetch;
  }

  getQueryKey = (parts: PathParts = []): PathParts => {
    return [this.queryKey, ...Service.spreadParts(parts)];
  };

  getPath = (parts: PathParts = []): string => {
    return Service.assemblePath([this.pathRoot, ...Service.spreadParts(parts)]);
  };

  get = <T = unknown>(
    parts: PathParts = [],
    payload?: any,
    fetchOptions?: FetchOptions
  ) => {
    return this.local.get(
      this.getPath(parts),
      payload,
      fetchOptions
    ) as Promise<T>;
  };

  post = <T = unknown>(parts: PathParts = [], payload?: any) => {
    return this.local.post(this.getPath(parts), payload) as Promise<T>;
  };

  delete = <T = unknown>(parts: PathParts = []) => {
    return this.local.delete(this.getPath(parts)) as Promise<T>;
  };
}

export default Service;
