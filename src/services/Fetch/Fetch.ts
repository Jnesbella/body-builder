import { compact, isNumber, omit } from "lodash";

import { Authorization } from "../../types";
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
    origin = window.location.origin,
    apiRoot = "http://REPLACE_ME:3001",
    retryCount = 0,
  }: Partial<FetchState> = {}) {
    this.state = {
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

  setApiRoot = (nextApiRoot: string) => {
    this.updateState({
      apiRoot: nextApiRoot,
    });
  };

  getApiRoot = () => {
    return this.getState().apiRoot;
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
      log("? FETCH \t Invalid authorization header. Unsetting authorization.", {
        tokenType,
        accessToken,
        refreshToken,
        token,
      });

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

  fetch = async (
    slug: string,
    init: CustomRequstInit,
    {
      retryCountOverride,
    }: { retryCountOverride?: FetchState["retryCount"] } = {}
  ) => {
    const callResponseInterceptors = async (
      response?: Response,
      error?: unknown
    ) => {
      return Promise.all(
        this.state.responseInterceptors.map(async (interceptor) => {
          try {
            await interceptor(response, error);
          } catch (err) {
            log("callResponseInterceptors", { err });
          }
        })
      );
    };

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

    const attemptsCount =
      (isNumber(retryCountOverride)
        ? retryCountOverride
        : this.state.retryCount) + 1;

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
    { priority = "queue", retryCount }: FetchOptions = {}
  ) => {
    const doFetch = () =>
      this.fetch(slug, init, { retryCountOverride: retryCount });

    return priority === "queue" ? Queue.enqueue(doFetch) : doFetch();
  };

  get = (slug: string, payload?: any, options?: FetchOptions) =>
    this.enqueueFetch(
      slug + (payload ? `?${new URLSearchParams(payload)}` : ""),
      {
        method: "GET",
      },
      options
    );

  post = (slug: string, payload?: any, options?: FetchOptions) =>
    this.enqueueFetch(
      slug,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      options
    );

  delete = (slug: string, options?: FetchOptions) =>
    this.enqueueFetch(
      slug,
      {
        method: "DELETE",
      },
      options
    );
}

export default Fetch;
