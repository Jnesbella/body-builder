export async function checkIsOkay(response: Response) {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }

  return response;
}

export async function toJSON(response: Response) {
  let text: string = "";

  try {
    text = await response.text(); // Parse it as text
    const data = JSON.parse(text); // Try to parse it as JSON
    return data;
  } finally {
    return text;
  }
}

export function getErrorMessge(err: unknown) {
  if (err && "message" in (err as Error)) {
    return (err as Error).message;
  }

  return "";
}

export function isUnauthorized(err: unknown) {
  return getErrorMessge(err) === "unauthorized";
}

export const fetchWithRetry = async (
  input: string,
  init: RequestInit,
  maybeRefreshAuthorization?: (err: unknown) => Promise<void>
) => {
  const doRequest = async () => {
    const response = await fetch(input, init);
    await checkIsOkay(response);
    return toJSON(response);
  };

  const retryRequest = doRequest;

  let res: any;

  try {
    res = await doRequest();
  } catch (err) {
    await maybeRefreshAuthorization?.(err);
    res = await retryRequest();
  } finally {
    return res;
  }
};
