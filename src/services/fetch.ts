import { omit } from "lodash";
import { Authorization, TokenType } from "../types";

import Queue from "./Queue";

enum Headers {
  Authorization = "Authorization",
  AppContext = "App-Context",
  ContentType = "Content-Type",
  AccessControlAllowOrigin = "Access-Control-Allow-Origin",
}

const HEADER_DELIMITER = " ";

interface Common {
  headers: Record<string, string>;
}

const common: Common = {
  headers: {
    [Headers.ContentType]: "application/json",
    [Headers.AccessControlAllowOrigin]: "http://127.0.0.1:3001",
  },
};

type UnauthorizedHandler = () => Promise<void>;

let unauthorizedHandler: UnauthorizedHandler | undefined;

let isFetchOneAtATime = true;

export const setIsFetchOneAtATime = (nextIsFetchOneAtATime: boolean) => {
  isFetchOneAtATime = nextIsFetchOneAtATime;
};

let apiRoot = "";

export const setApiRoot = (nextApiRoot: string) => {
  apiRoot = nextApiRoot;
};

const setHeader = (header: Headers, prefix: string, value?: string) => {
  common.headers = {
    ...common.headers,
    [header]: [prefix, value].join(HEADER_DELIMITER),
  };
};

const deleteHeader = (header: Headers) => {
  if (common.headers) {
    common.headers = omit(common.headers, header);
  }
};

const isHeaderSet = (header: Headers) => !!common.headers[header];

export const setAuthorizationHeader = ({
  tokenType,
  accessToken,
  refreshToken,
}: Authorization) => {
  let token: string | undefined;
  if (tokenType === TokenType.Bearer) {
    token = accessToken;
  } else if (tokenType === TokenType.Refresh) {
    token = refreshToken;
  }

  setHeader(Headers.Authorization, tokenType, token);
};

export const clearAuthorizationHeader = () =>
  deleteHeader(Headers.Authorization);

export const isAuthorizationHeaderSet = () =>
  isHeaderSet(Headers.Authorization);

const checkIsOkay = async (response: Response) => {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }

  return response;
};

const toJSON = (response: Response) => response.json();

export function onUnauthorized(handler: UnauthorizedHandler) {
  unauthorizedHandler = handler;
}

function getErrorMessge(err: unknown) {
  if (err && "message" in (err as Error)) {
    return (err as Error).message;
  }

  return "";
}

function isUnauthorized(err: unknown) {
  return getErrorMessge(err) === "unauthorized";
}

const maybeRefreshAuthorization = async (err: unknown) => {
  if (isUnauthorized(err) && unauthorizedHandler) {
    await unauthorizedHandler();
  } else {
    throw err;
  }
};

type CustomRequstInit = Pick<RequestInit, "method"> &
  Omit<Partial<RequestInit>, "headers">;

const fetchRequest = async (slug: string, init: CustomRequstInit) => {
  const doRequest = async () => {
    const response = await fetch(`${apiRoot}${slug}`, {
      ...common,
      ...init,
    });

    await checkIsOkay(response);

    return toJSON(response);
  };

  const retryRequest = doRequest;

  let res: any;

  try {
    res = await doRequest();
  } catch (err) {
    await maybeRefreshAuthorization(err);
    res = await retryRequest();
  } finally {
    return res;
  }
};

/*
 * fetching one at a time helps the local lambda docker containers run more reliably
 */
export interface FetchOptions {
  force?: boolean;
}

const maybeFetchOneAtATime = (
  slug: string,
  init: CustomRequstInit,
  { force = false }: FetchOptions = {}
) => {
  const doFetch = () => fetchRequest(slug, init);

  return isFetchOneAtATime && !force ? Queue.enqueue(doFetch) : doFetch();
};

const getRequest = (slug: string, payload?: any, options?: FetchOptions) =>
  maybeFetchOneAtATime(
    slug + (payload ? `?${new URLSearchParams(payload)}` : ""),
    {
      method: "GET",
    },
    options
  );

const postRequest = (slug: string, payload?: any) =>
  maybeFetchOneAtATime(slug, {
    method: "POST",
    body: JSON.stringify(payload),
  });

const deleteRequest = (slug: string) =>
  maybeFetchOneAtATime(slug, {
    method: "DELETE",
  });

export { getRequest as get, postRequest as post, deleteRequest as delete };

export const setup = ({}: {
  accessToken?: string;
  refreshToken?: string;
}) => {};

export const teardown = () => {};
