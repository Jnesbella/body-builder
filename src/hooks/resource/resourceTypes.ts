import { MutationOptions } from "react-query";

export type OnMutationSuccess<TData = any, TVariables = any> = (
  data: TData | void,
  variables: TVariables,
  context: unknown
) => void | Promise<unknown>;
// export type OnMutationSuccess = MutationOptions["onSuccess"];

export type OnQuerySuccess<TData = any> = (data: TData) => void;
