import Fetch, { FetchMethodOptions, FetchOptions } from "./Fetch";

import { AsyncStorage } from "../../async-storage";

export interface LocalFetchOptions extends FetchOptions {
  storage: AsyncStorage;
}

class LocalFetch extends Fetch {
  storage: AsyncStorage;

  constructor({ storage, ...rest }: LocalFetchOptions) {
    super(rest);

    this.storage = storage;
  }

  private toResponse = async <TData = any>(data: Promise<TData>) => {
    let response: Response;

    try {
      const body = JSON.stringify(data);

      response = new Response(body, {
        status: 200,
      });
    } catch (err) {
      const errBody = JSON.stringify(err);

      response = new Response(errBody, {
        status: 500,
      });
    }

    return response;
  };

  private fetch = async <TData = any>(
    getData: () => Promise<TData>,
    options?: FetchMethodOptions
  ) => {
    const doFetch = async () => {
      const data = getData();
      return this.toResponse(data);
    };

    return this.enqueueFetch(doFetch, options);
  };

  get = async <TData = any>(
    slug: string,
    _payload?: any,
    options?: FetchMethodOptions
  ) => {
    const doGet = async () => {
      const data = await this.storage.getItemAsync(slug);

      return data;
    };

    return this.fetch<TData>(doGet, options);
  };

  post = async (
    _slug: string,
    _payload?: any,
    _options?: FetchMethodOptions
  ) => {
    throw new Error("use PUT or PATCH instead");
  };

  delete = async (
    slug: string,
    _payload?: any,
    options?: FetchMethodOptions
  ) => {
    const doDelete = async () => {
      await this.storage.deleteItemAsync(slug);
    };

    return this.fetch(doDelete, options);
  };

  put = async <TData = any>(
    slug: string,
    payload?: any,
    options?: FetchMethodOptions
  ) => {
    const doPut = async () => {
      await this.storage.setItemAsync(slug, payload);

      return payload;
    };

    return this.fetch<TData>(doPut, options);
  };

  patch = async <TData = any>(
    slug: string,
    payload?: any,
    options?: FetchMethodOptions
  ) => {
    const doPatch = async () => {
      const data = await this.storage.getItemAsync(slug);

      const nextData =
        data &&
        payload &&
        typeof data === "object" &&
        typeof payload === "object"
          ? {
              ...data,
              ...payload,
            }
          : payload;

      await this.storage.setItemAsync(slug, nextData);

      return nextData;
    };

    return this.fetch<TData>(doPatch, options);
  };
}

export default LocalFetch;
