import { log } from "../../utils";

import { FetchResponseInterceptor } from "./fetchTypes";
import { checkIsOkay, toJSON } from "./fetchUtils";
import Queue from "./PromiseQueue";

export interface FetchOptions {
  retryCount?: number;
}

export interface FetchMethodOptions extends FetchOptions {
  immediate?: boolean;
}

abstract class Fetch {
  responseInterceptors: FetchResponseInterceptor[];
  retryCount: number;

  constructor({ retryCount = 0 }: FetchOptions = {}) {
    this.retryCount = retryCount;
    this.responseInterceptors = [];
  }

  addResponseInterceptor = (
    interceptor: FetchResponseInterceptor
  ): (() => void) => {
    this.responseInterceptors = [...this.responseInterceptors, interceptor];

    const removeResponseInterceptor = () => {
      this.responseInterceptors = this.responseInterceptors.filter(
        (i) => i !== interceptor
      );
    };

    return removeResponseInterceptor;
  };

  private callResponseInterceptors = async (
    response?: Response,
    error?: unknown
  ) => {
    return Promise.all(
      this.responseInterceptors.map(async (interceptor) => {
        try {
          await interceptor(response, error);
        } catch (err) {
          log("callResponseInterceptors", { err });
        }
      })
    );
  };

  fetchWithRetry = async <TData = any>(
    getResponse: () => Promise<Response>,
    {
      retryCount = this.retryCount,
    }: {
      retryCount?: Fetch["retryCount"];
    } = {}
  ): Promise<TData> => {
    let response: Response | undefined;
    let error: unknown | undefined;

    const attemptsCount = retryCount + 1;
    for (let i = 0; i < attemptsCount && !response; i++) {
      try {
        response = await getResponse();
        checkIsOkay(response);

        await this.callResponseInterceptors(response);

        return toJSON(response) as unknown as Promise<TData>;
      } catch (err) {
        error = err;

        await this.callResponseInterceptors(undefined, error);
      }
    }

    throw error || "Unable to fetch";
  };

  enqueueFetch = <TData = any>(
    getResponse: () => Promise<Response>,
    {
      immediate,
      ...rest
    }: {
      retryCount?: Fetch["retryCount"];
      immediate?: boolean;
    } = {}
  ): Promise<TData> => {
    const doFetch = () => this.fetchWithRetry(getResponse, rest);

    return immediate ? doFetch() : Queue.enqueue(doFetch);
  };

  abstract get: <TData = any>(
    slug: string,
    payload?: any,
    options?: FetchMethodOptions
  ) => Promise<TData>;

  abstract post: <TData = any>(
    slug: string,
    payload?: any,
    options?: FetchMethodOptions
  ) => Promise<TData>;

  abstract delete: <TData = any>(
    slug: string,
    payload?: any,
    options?: FetchMethodOptions
  ) => Promise<TData>;

  put = <TData = any>(
    _slug: string,
    _payload?: any,
    _options?: FetchMethodOptions
  ): Promise<TData> => {
    throw new Error("PUT not implemented");
  };

  patch = <TData = any>(
    _slug: string,
    _payload?: any,
    _options?: FetchMethodOptions
  ): Promise<TData> => {
    throw new Error("PATCH not implemented");
  };
}

export default Fetch;
