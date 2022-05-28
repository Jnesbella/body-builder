import { compact, omit, range } from "lodash";

import { Authorization, TokenType } from "../../types";
import { log } from "../../utils";

import {
  FetchHeader,
  FetchState,
  FetchResponseInterceptor,
  CustomRequstInit,
  FetchOptions,
} from "./fetchTypes";
import { HEADER_DELIMITER } from "./constants";
import { checkIsOkay, toJSON } from "./fetchUtils";
import Queue from "./Queue";

class Fetch {
  state: FetchState;

  constructor({
    origin = "http://localhost:3000",
    apiRoot = "http://localhost:3001",
    retryCount = 0,
  }: Partial<FetchState> = {}) {
    this.state = {
      isFetchOneAtATime: true,
      apiRoot,
      origin,

      // requestInterceptors: [],
      responseInterceptors: [],

      retryCount,

      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": origin,
      },
    };
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

  setAuthorizationHeader = ({
    tokenType,
    accessToken,
    refreshToken,
  }: Authorization) => {
    let token: string | undefined;
    if (tokenType === "Bearer") {
      token = accessToken;
    } else if (tokenType === "Refresh") {
      token = refreshToken;
    }

    if (token) {
      this.setHeader("Authorization", token, { prefix: tokenType });
    } else {
      log("? FETCH \t Invalid authorization header. Unsetting authorization.");

      this.unsetAuthorization();
    }
  };

  isHeaderSet = (header: FetchHeader) => {
    return !!this.state.headers[header];
  };

  clearAuthorizationHeader = () => this.deleteHeader("Authorization");

  isAuthorizationHeaderSet = () => this.isHeaderSet("Authorization");

  setAuthorization = (nextAuthorization: Authorization) => {
    this.updateState({
      authorization: nextAuthorization,
    });
    this.setAuthorizationHeader(nextAuthorization);
  };

  unsetAuthorization = () => {
    this.updateState({
      authorization: undefined,
    });
    this.clearAuthorizationHeader();
  };

  // maybeRefreshAuthorization = async (err: unknown) => {
  //   const { onUnauthorized } = this.state;
  //   if (isUnauthorized(err) && onUnauthorized) {
  //     await onUnauthorized(this.state.authorization?.refreshToken);
  //   } else {
  //     throw err;
  //   }
  // };

  addResponseInterceptor = (
    interceptor: FetchResponseInterceptor
  ): (() => void) => {
    this.updateState({
      responseInterceptors: [...this.state.responseInterceptors, interceptor],
    });

    return () => {
      this.updateState({
        responseInterceptors: this.state.responseInterceptors.filter(
          (i) => i !== interceptor
        ),
      });
    };
  };

  fetch = async (slug: string, init: CustomRequstInit) => {
    const callResponseInterceptors = (response?: Response, error?: unknown) =>
      Promise.all(
        this.state.responseInterceptors.map((interceptor) =>
          interceptor(response, error)
        )
      );

    const doRequest = async () => {
      const { headers, apiRoot } = this.state;
      let input = `${apiRoot}${slug}`;

      const response = await fetch(input, {
        ...init,
        headers,
      });
      return checkIsOkay(response);
    };

    let response: Response | undefined;
    let error: unknown | undefined;

    const attemptsCount = this.state.retryCount + 1;
    for (let i = 0; i < attemptsCount && !response; i++) {
      try {
        response = await doRequest();
        await callResponseInterceptors(response);
      } catch (err) {
        error = err;
        await callResponseInterceptors(undefined, error);
      }
    }

    if (response) {
      return toJSON(response);
    }

    throw error || "Network error";
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
