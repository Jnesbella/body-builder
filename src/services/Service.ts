import { compact } from "lodash";

import { PathParts } from "../types";
import { log } from "../utils";

import * as fetch from "./fetch";
import { FetchState } from "./fetch";

export interface ServiceOptions {
  queryKey: string;
  path: string;
}

class Service {
  static globals(options: FetchState) {
    fetch.setup(options);
  }

  static assemblePath(parts: PathParts = []) {
    return compact(parts).join("/");
  }

  static get<T = unknown>(
    parts: PathParts,
    payload?: any,
    fetchOptions?: fetch.FetchOptions
  ) {
    return fetch.get(
      Service.assemblePath(parts),
      payload,
      fetchOptions
    ) as Promise<T>;
  }

  static post<T = unknown>(parts: PathParts, payload?: any) {
    return fetch.post(Service.assemblePath(parts), payload) as Promise<T>;
  }

  static delete<T = unknown>(parts: PathParts) {
    return fetch.delete(Service.assemblePath(parts)) as Promise<T>;
  }

  queryKey: string;
  path: string;
  pathRoot: string;

  constructor({ queryKey, path }: ServiceOptions) {
    this.queryKey = queryKey;
    this.path = path;
    this.pathRoot = path;
  }

  getQueryKey(parts: PathParts = []): string | PathParts {
    return [this.queryKey, ...parts];
  }

  getPath(parts: PathParts = []) {
    return Service.assemblePath([this.pathRoot, ...parts]);
  }

  get<T = unknown>(
    parts: PathParts = [],
    payload?: any,
    fetchOptions?: fetch.FetchOptions
  ) {
    return Service.get<T>([this.pathRoot, ...parts], payload, fetchOptions);
  }

  post<T = unknown>(parts: PathParts = [], payload?: any) {
    return Service.post<T>([this.pathRoot, ...parts], payload);
  }

  delete<T = unknown>(parts: PathParts = []) {
    return Service.delete<T>([this.pathRoot, ...parts]);
  }
}

export default Service;
