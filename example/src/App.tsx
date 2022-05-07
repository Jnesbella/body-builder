import React from "react";
import {
  ErrorBoundary,
  Text,
  Layout,
  Provider,
  makeAsyncStorage,
} from "body-builder";
import { QueryClient, QueryClientProvider } from "react-query";

// import "body-builder/dist/index.css";

const storage = makeAsyncStorage();

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
          <Text>BODY BUILDER</Text>
        </Provider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

export default App;
