import React from "react";
import {
  ErrorBoundary,
  Text,
  Layout,
  Provider,
  makeAsyncStorage,
  Service,
  Fetch,
} from "body-builder";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

// import "body-builder/dist/index.css";

const storage = makeAsyncStorage();

const local = new Fetch({
  apiRoot: "http://localhost:3002/api",
});

const service = new Service({
  queryKey: "debug",
  pathRoot: "/audits",
  fetch: local,
});

function Debug() {
  const { data } = useQuery("app", () => service.get("debug"));

  console.log({ data });

  return <Text>{data}</Text>;
}

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

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary
        fallback={
          <Layout.Box greedy justifyContent="center" alignItems="center">
            <Text>Error</Text>
          </Layout.Box>
        }
      >
        <Provider storage={storage}>
          <Layout.Column>
            <Text>BODY BUILDER</Text>
            <Debug />
          </Layout.Column>
        </Provider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

export default App;
