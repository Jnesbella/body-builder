import React from "react";
import {
  ErrorBoundary,
  Text,
  Layout,
  AsyncStorageProvider,
  makeAsyncStorage,
  Service,
  Fetch,
  Space,
  isUnauthorized,
  log,
  Button,
  Divider,
  TextInput,
} from "@jnesbella/body-builder";
import { Pressable } from "react-native";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
// import "body-builder/dist/index.css";

import FlubberExample from "./FlubberExample";
import RichTextEdtiorExample from "./RichTextEditorExample";
import Paperless from "./Paperless";

type PressableState = Readonly<{
  pressed: boolean;
  hovered?: boolean;
  focused?: boolean;
}>;

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
  // const { data } = useQuery("app", () => service.get("debug"));
  // return <Text>{data}</Text>;

  const fetch = React.useMemo(() => {
    return new Fetch({
      apiRoot: "http://localhost:3002/api",
      retryCount: 2,
    });
  }, []);

  React.useEffect(() => {
    const removeResponseInterceptor = fetch.addResponseInterceptor((_, err) => {
      if (isUnauthorized(err)) {
        log("isUnauthorized");
      }
    });

    return () => {
      removeResponseInterceptor();
    };
  }, [fetch]);

  React.useEffect(() => {
    fetch.get("/audits/debug");
  }, [fetch]);

  return null;
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
        <AsyncStorageProvider storage={storage}>
          <Layout.Column greedy>
            {/* <Layout.Box spacingSize={1}>
              <Text>BODY BUILDER</Text>
            </Layout.Box> */}

            {/* <Debug /> */}

            {/* <Layout.Column spacingSize={1}>
              <Button mode="contained" color="primary" title="APPLE" />
              <Space />
              <Button mode="outlined" color="primary" title="BANANA" />
              <Space />
              <Button mode="text" color="primary" title="ORANGE" />

              <Space />
              <Divider />
              <Space />

              <Button mode="contained" color="accent" title="APPLE" />
              <Space />
              <Button mode="outlined" color="accent" title="BANANA" />
              <Space />
              <Button mode="text" color="accent" title="ORANGE" />

              <Space />
              <Divider />
              <Space />

              <TextInput placeholder="username" />
            </Layout.Column>

            <FlubberExample />

            <Space /> */}

            <Paperless.Document />

            {/* <RichTextEdtiorExample /> */}
          </Layout.Column>
        </AsyncStorageProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

export default App;
