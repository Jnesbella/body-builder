import * as React from "react";
import {
  ErrorBoundary,
  Layout,
  AsyncStorageProvider,
  Text,
  Pressable,
  makeAsyncStorage,
  Fetch,
  Service,
  LocalFetch,
} from "@jnesbella/body-builder";
import { QueryClientProvider, QueryClient } from "react-query";

const storage = makeAsyncStorage();

const local = new Fetch({
  apiRoot: "http://localhost:3002/api",
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      retry: 3,
      retryDelay: 200,
    },
  },
});

const service = new Service({
  queryKey: "debug",
  pathRoot: "/debug",
  fetch: local,
});

function Main() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary
        fallback={
          <Layout.Box greedy justifyContent="center" alignItems="center">
            <Text>Error</Text>
          </Layout.Box>
        }
      >
        <AsyncStorageProvider storage={storage}>
          <Pressable.Provider>
            <Layout.Column></Layout.Column>
          </Pressable.Provider>
        </AsyncStorageProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default Main;
