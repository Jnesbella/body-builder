import { MutationOptions } from "react-query";

// export type OnMutationSuccess<TData = any, TVariables = any> = (
//   data: TData,
//   variables: TVariables,
//   context: unknown
// ) => void | Promise<unknown>;
export type OnMutationSuccess<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
> = MutationOptions<TData, TError, TVariables, TContext>["onSuccess"];

export type OnQuerySuccess<TData = any> = (data: TData) => void;
