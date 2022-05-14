import { compact, omit } from "lodash";

import { Authorization, TokenType } from "../../types";
import { log } from "../../utils";

import {
  FetchHeader,
  FetchState,
  UnauthorizedHandler,
  CustomRequstInit,
  FetchOptions,
} from "./fetchTypes";
import { HEADER_DELIMITER } from "./constants";
import { isUnauthorized, fetchWithRetry } from "./fetchUtils";
import Queue from "./Queue";

class Fetch {
  state: FetchState;

  constructor({
    origin = "http://localhost:3000",
    apiRoot = "http://localhost:3001",
  }: Partial<FetchState> = {}) {
    log({ origin, apiRoot });

    this.state = {
      isFetchOneAtATime: true,
      apiRoot,
      origin,

      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": origin,
      },
    };

    log({ state: this.state });
  }

  setState = (nextState: FetchState) => {
    this.state = nextState;
  };

  getState = () => {
    return this.state;
  };

  updateState = (updates: Partial<FetchState> = {}) => {
    this.setState({ ...this.state, ...updates });
  };

  setIsFetchOneAtATime = (nextIsFetchOneAtATime: boolean) => {
    this.updateState({
      isFetchOneAtATime: nextIsFetchOneAtATime,
    });
  };

  setApiRoot = (nextApiRoot: string) => {
    this.updateState({
      apiRoot: nextApiRoot,
    });
  };

  setHeader = (
    header: FetchHeader,
    value: string,
    { prefix }: { prefix?: string } = {}
  ) => {
    const { headers } = this.state;
    headers[header] = compact([prefix, value]).join(HEADER_DELIMITER);

    this.updateState({
      headers,
    });
  };

  deleteHeader = (header: FetchHeader) => {
    const { headers } = this.state;
    const nextHeaders = omit(headers, header);

    this.updateState({
      headers: nextHeaders,
    });
  };

  onUnauthorized = (handler: UnauthorizedHandler) => {
    this.updateState({
      onUnauthorized: handler,
    });
  };

  setAuthorizationHeader = ({
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

    if (token) {
      this.setHeader("Authorization", token, { prefix: tokenType });
    }
  };

  isHeaderSet = (header: FetchHeader) => {
    return !!this.state.headers[header];
  };

  clearAuthorizationHeader = () => this.deleteHeader("Authorization");

  isAuthorizationHeaderSet = () => this.isHeaderSet("Authorization");

  maybeRefreshAuthorization = async (err: unknown) => {
    const { onUnauthorized } = this.state;
    if (isUnauthorized(err) && onUnauthorized) {
      await onUnauthorized();
    } else {
      throw err;
    }
  };

  fetch = (slug: string, init: CustomRequstInit) => {
    const { headers, apiRoot } = this.state;
    log({ apiRoot, slug });
    const input = `${apiRoot}${slug}`;

    return fetchWithRetry(
      input,
      {
        ...init,
        headers,
      },
      this.maybeRefreshAuthorization
    );
  };

  enqueueFetch = (
    slug: string,
    init: CustomRequstInit,
    { force = false }: FetchOptions = {}
  ) => {
    const doFetch = () => this.fetch(slug, init);

    return this.state.isFetchOneAtATime && !force
      ? Queue.enqueue(doFetch)
      : doFetch();
  };

  get = (slug: string, payload?: any, options?: FetchOptions) =>
    this.enqueueFetch(
      slug + (payload ? `?${new URLSearchParams(payload)}` : ""),
      {
        method: "GET",
      },
      options
    );

  post = (slug: string, payload?: any) =>
    this.enqueueFetch(slug, {
      method: "POST",
      body: JSON.stringify(payload),
    });

  delete = (slug: string) =>
    this.enqueueFetch(slug, {
      method: "DELETE",
    });
}

export default Fetch;
