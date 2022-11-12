import { v4 as uuidv4 } from "uuid";

import Fetch, { FetchMethodOptions, FetchOptions } from "./Fetch";

import { AsyncStorage } from "../../async-storage";
import { dateToUTCString, log } from "../../utils";

export interface LocalFetchOptions extends FetchOptions {
  storage: AsyncStorage;
}

const slugToPathParts = (slug: string = "") => {
  return slug.split("/");
};

const slugToStorageKey = (slug: string = "") => {
  return slugToPathParts(slug)?.[1] || "";
};

class LocalFetch extends Fetch {
  storage: AsyncStorage;

  constructor({ storage, ...rest }: LocalFetchOptions) {
    super(rest);

    this.storage = storage;
  }

  private toResponse = async <TData = any>(promise: Promise<TData>) => {
    let response: Response;

    try {
      const data = await promise;
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

  fetch = async <TData = any>(
    getData: () => Promise<TData>,
    options?: FetchMethodOptions
  ) => {
    const doFetch = async () => {
      const data = getData();
      return this.toResponse(data);
    };

    return this.enqueueFetch(doFetch, options);
  };

  private getCollection = async <TData = any>(
    slug: string
  ): Promise<Record<string, TData>> => {
    const storageKey = slugToStorageKey(slug);
    const collection = await this.storage.getItemAsync(storageKey);

    return collection || {};
  };

  get = async <TData = any>(
    slug: string,
    _payload?: any,
    options?: FetchMethodOptions
  ) => {
    const doGet = async () => {
      const isList = slugToPathParts(slug).filter((part) => part).length === 1;

      const collection = await this.getCollection(slug);
      const data = isList ? Object.values(collection) : collection?.[slug];

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
      const storageKey = slugToStorageKey(slug);
      const collection = await this.getCollection(slug);
      // deletedAt: dateToUTCString(new Date()),

      const nextCollection = {
        ...collection,
        [slug]: undefined,
      };
      await this.storage.setItemAsync(storageKey, nextCollection);
    };

    return this.fetch(doDelete, options);
  };

  put = async <TData = any>(
    slug: string,
    payload?: any,
    options?: FetchMethodOptions
  ) => {
    const doPut = async () => {
      const storageKey = slugToStorageKey(slug);
      const collection = await this.getCollection(slug);
      const pathParts = slugToPathParts(slug);

      const id = uuidv4();
      const document = {
        ...payload,
        id,
        createdAt: dateToUTCString(new Date()),
        modifiedAt: dateToUTCString(new Date()),
      };

      const documentSlug = [...pathParts.slice(0, -1), id].join("/");

      const nextCollection = {
        ...collection,
        [documentSlug]: document,
      };
      await this.storage.setItemAsync(storageKey, nextCollection);

      return document;
    };

    return this.fetch<TData>(doPut, options);
  };

  patch = async <TData = any>(
    slug: string,
    payload?: any,
    options?: FetchMethodOptions
  ) => {
    const doPatch = async () => {
      const storageKey = slugToStorageKey(slug);
      const collection = await this.getCollection(slug);

      const data = collection?.[slug];

      let nextData =
        data &&
        payload &&
        typeof data === "object" &&
        typeof payload === "object"
          ? {
              ...data,
              ...payload,
            }
          : payload;

      nextData = {
        ...nextData,
        modifiedAt: dateToUTCString(new Date()),
      };

      const nextCollection = {
        ...collection,
        [slug]: nextData,
      };
      await this.storage.setItemAsync(storageKey, nextCollection);

      return nextData;
    };

    return this.fetch<TData>(doPatch, options);
  };
}

export default LocalFetch;
