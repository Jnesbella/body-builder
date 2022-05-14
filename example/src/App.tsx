import React from "react";
import {
  ErrorBoundary,
  Text,
  Layout,
  Provider,
  makeAsyncStorage,
  Service,
} from "body-builder";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

// import "body-builder/dist/index.css";

const storage = makeAsyncStorage();

function Debug({ enabled = true }: { enabled?: boolean } = {}) {
  const { data } = useQuery("app", () => Service.get(["/api/audits/debug"]), {
    enabled,
  });

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
  const [initialized, setInitialized] = React.useState(false);

  React.useEffect(() => {
    Service.globals({
      onUnauthorized: async () => {
        // TODO
      },
      apiRoot: "http://localhost:3002",
      isFetchOneAtATime: true,
      allowOrigin: "http://localhost:3000",
    });

    setInitialized(true);
  }, []);

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
            <Debug enabled={initialized} />
          </Layout.Column>
        </Provider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

export default App;
