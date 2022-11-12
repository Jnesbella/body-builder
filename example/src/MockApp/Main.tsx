import * as React from "react";
import {
  ErrorBoundary,
  AsyncStorageProvider,
  Pressable,
  ErrorMessage,
  Tooltip,
} from "@jnesbella/body-builder";
import { QueryClientProvider } from "react-query";

import { queryClient, storage } from "./constants";
import AppProvider from "./components/AppProvider";
import PleasantLoading from "./components/PleasantLoading";
import AppLayout from "./components/AppLayout";

function Main() {
  return (
    <QueryClientProvider client={queryClient}>
      <AsyncStorageProvider storage={storage}>
        <ErrorBoundary fallback={<ErrorMessage />}>
          <Pressable.Provider>
            <Tooltip.Provider greedy>
              <PleasantLoading mockLoadingTimeout={0}>
                <AppProvider>
                  <AppLayout />
                </AppProvider>
              </PleasantLoading>
            </Tooltip.Provider>
          </Pressable.Provider>
        </ErrorBoundary>
      </AsyncStorageProvider>
    </QueryClientProvider>
  );
}

export default Main;
