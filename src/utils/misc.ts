import { QueryKey } from "react-query";

export const log = (message?: any, ...optionalParams: any[]) =>
  console.log(message, ...optionalParams);

export const hashCode = (str: string) => {
  let hash = 0;
  let i: number | undefined;
  let chr: number | undefined;

  if (str.length === 0) {
    return hash;
  }

  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }

  return hash;
};

export const serializeQueryKey = (queryKey: QueryKey) => {
  return `${hashCode(JSON.stringify(queryKey))}`;
};
