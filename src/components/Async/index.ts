import Loading from "./Loading";
import Shimmer from "./Shimmer";
import AsyncQuery from "./AsyncQuery";
import AsyncSuspense from "./AsyncSuspense";

export * from "./AsyncQuery";
export * from "./AsyncSuspense";
export * from "./Loading";
export * from "./Shimmer";

export default {
  Loading,
  Shimmer,
  Query: AsyncQuery,
  Suspense: AsyncSuspense,
};
