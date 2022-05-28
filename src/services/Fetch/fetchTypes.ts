import { Authorization } from "../../types";

export type FetchHeader =
  | "Authorization"
  | "App-Context"
  | "Content-Type"
  | "Access-Control-Allow-Origin";

// export type UnauthorizedHandler = (
//   refreshToken?: Authorization["refreshToken"]
// ) => Promise<void> | void;

export type FetchResponseInterceptor = (
  response?: Response,
  error?: unknown
) => void | Promise<unknown>;

export interface FetchState {
  isFetchOneAtATime: boolean;
  apiRoot: string;
  origin: string;
  headers: Record<string, string>;

  // requestInterceptors: ((url: string, options: RequestInit) => RequestInit)[];
  responseInterceptors: FetchResponseInterceptor[];

  retryCount: number;

  // onUnauthorized?: UnauthorizedHandler;
  authorization?: Authorization;
}

export interface CustomRequstInit
  extends Omit<Partial<RequestInit>, "headers"> {
  method: RequestInit["method"];
}

export interface FetchOptions {
  force?: boolean;
}
