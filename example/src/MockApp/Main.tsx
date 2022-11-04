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
  ErrorMessage,
  Info,
  Async,
  Util,
  Flubber,
  Surface,
  IconButton,
  Space,
  Measure,
} from "@jnesbella/body-builder";
import { QueryClientProvider, QueryClient, useQuery } from "react-query";
import { Modal } from "react-native";
import Loading from "../../../dist/components/Async/Loading";
import styled from "styled-components/native";
import * as Icons from "react-bootstrap-icons";

const storage = makeAsyncStorage();

const fetch = new LocalFetch({ storage });

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
  fetch,
});

const BoxWithPadding = ({ maxWidth }: { maxWidth?: number }) => {
  return (
    <Layout.Box greedy style={{ maxWidth }}>
      <Surface greedy />
    </Layout.Box>
  );
};

function MeasureDemo() {
  return (
    <Surface greedy>
      <Measure greedy>
        {(rect) => (
          <Layout.Box alignItems="center" justifyContent="center" greedy>
            <Text>
              {rect?.width || 0} x {rect?.height || 0}
            </Text>
          </Layout.Box>
        )}
      </Measure>
    </Surface>
  );
}

function AppLayout() {
  return (
    <Layout.Row greedy>
      <Flubber
        greedy
        width={["nav", "width"]}
        height={["nav", "height"]}
        defaultWidth={300}
      >
        {/* <MeasureDemo /> */}
      </Flubber>

      <Flubber.Grip
        pushAndPull={[
          ["nav", "width"],
          ["main", "width"],
        ]}
      />

      <Flubber greedy width={["main", "width"]} height={["main", "height"]}>
        <Surface>
          <Layout.Row spacingSize={1}>
            <IconButton icon={Icons.List} />
          </Layout.Row>
        </Surface>

        <Space />

        <Layout.Row greedy>
          <BoxWithPadding />

          <Space />

          <BoxWithPadding maxWidth={300} />
        </Layout.Row>
      </Flubber>
    </Layout.Row>
  );
}

function Main() {
  return (
    <QueryClientProvider client={queryClient}>
      <AsyncStorageProvider storage={storage}>
        <ErrorBoundary fallback={<ErrorMessage />}>
          <Pressable.Provider>
            <Info greedy>
              <React.Suspense
                fallback={
                  <Layout.Box
                    greedy
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text>Loading...</Text>
                  </Layout.Box>
                }
              >
                <AppLayout />
                {/* <MeasureDemo /> */}
              </React.Suspense>
            </Info>
          </Pressable.Provider>
        </ErrorBoundary>
      </AsyncStorageProvider>
    </QueryClientProvider>
  );
}

export default Main;
