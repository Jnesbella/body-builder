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

export interface FetchState extends Partial<Authorization> {
  onUnauthorized?: UnauthorizedHandler;
  isFetchOneAtATime: boolean;
  apiRoot: string;
  allowOrigin: string;
}

const DEFAULT_STATE: FetchState = {
  onUnauthorized: undefined,
  isFetchOneAtATime: true,
  apiRoot: "http://localhost:3001",
  allowOrigin: "http://localhost:3000",
  accessToken: undefined,
  refreshToken: undefined,
  tokenType: undefined,
};

let state: FetchState = {
  ...DEFAULT_STATE,
};

export const setIsFetchOneAtATime = (nextIsFetchOneAtATime: boolean) => {
  state.isFetchOneAtATime = nextIsFetchOneAtATime;
};

export const setApiRoot = (nextApiRoot: string) => {
  state.apiRoot = nextApiRoot;
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

const toJSON = async (response: Response) => {
  let text: string = "";

  try {
    text = await response.text(); // Parse it as text
    const data = JSON.parse(text); // Try to parse it as JSON
    return data;
  } finally {
    return text;
  }

  // return response.json();
};

export function onUnauthorized(handler: UnauthorizedHandler) {
  state.onUnauthorized = handler;
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
  if (isUnauthorized(err) && state.onUnauthorized) {
    await state.onUnauthorized();
  } else {
    throw err;
  }
};

type CustomRequstInit = Pick<RequestInit, "method"> &
  Omit<Partial<RequestInit>, "headers">;

const fetchRequest = async (slug: string, init: CustomRequstInit) => {
  const doRequest = async () => {
    const response = await fetch(`${state.apiRoot}${slug}`, {
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

  return state.isFetchOneAtATime && !force ? Queue.enqueue(doFetch) : doFetch();
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

export const setup = (nextState: Partial<FetchState>) => {
  state = { ...state, ...nextState };

  // setup authorization
  const { tokenType, accessToken, refreshToken } = state;
  if (tokenType && accessToken && refreshToken) {
    setAuthorizationHeader({ tokenType, accessToken, refreshToken });
  } else {
    clearAuthorizationHeader();
  }

  // setup fetch strategy
  const { isFetchOneAtATime } = state;
  setIsFetchOneAtATime(isFetchOneAtATime);

  // setup api root
  const { apiRoot } = state;
  setApiRoot(apiRoot);

  // setup allow origin
  setHeader(Headers.AccessControlAllowOrigin, state.allowOrigin);
};

export const teardown = () => {
  setup(DEFAULT_STATE);
};
