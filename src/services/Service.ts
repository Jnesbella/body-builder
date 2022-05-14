import { compact } from "lodash";

import { PathParts } from "../types";
import { log } from "../utils";

import Fetch, { FetchState, FetchOptions } from "./Fetch";

export interface ServiceOptions {
  queryKey: string;
  pathRoot: string;
  fetch: Fetch;
}

const spreadParts = (parts: PathParts = []) =>
  typeof parts === "string" ? [parts] : parts;

const global = new Fetch();

class Service {
  static globals(nextState: FetchState) {
    global.setState(nextState);
  }

  static assemblePath(parts: PathParts = []) {
    return typeof parts === "string" ? parts : compact(parts).join("/");
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

  queryKey: string;
  pathRoot: string;
  local: Fetch;

  constructor({ queryKey, pathRoot, fetch }: ServiceOptions) {
    this.queryKey = queryKey;
    this.pathRoot = pathRoot;
    this.local = fetch;
  }

  getQueryKey(parts: PathParts = []): string | PathParts {
    return [this.queryKey, ...spreadParts(parts)];
  }

  getPath(parts: PathParts = []) {
    return Service.assemblePath([this.pathRoot, ...spreadParts(parts)]);
  }

  get<T = unknown>(
    parts: PathParts = [],
    payload?: any,
    fetchOptions?: FetchOptions
  ) {
    return this.local.get(
      this.getPath(parts),
      payload,
      fetchOptions
    ) as Promise<T>;
  }

  post<T = unknown>(parts: PathParts = [], payload?: any) {
    return this.local.post(this.getPath(parts), payload) as Promise<T>;
  }

  delete<T = unknown>(parts: PathParts = []) {
    return this.local.delete(this.getPath(parts)) as Promise<T>;
  }
}

export default Service;
