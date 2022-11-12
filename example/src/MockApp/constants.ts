import {
  makeAsyncStorage,
  LocalFetch,
  ResourceService,
} from "@jnesbella/body-builder";
import { QueryClient } from "react-query";

import { Channel, Note, Tag } from "./types";

export const storage = makeAsyncStorage();

export const fetch = new LocalFetch({ storage });

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      retry: 3,
      retryDelay: 200,
    },
  },
});

export const notesService = new ResourceService<Note>({
  queryKey: "notes",
  pathRoot: "/notes",
  fetch,
});

export const channelsService = new ResourceService<Channel>({
  queryKey: "channels",
  pathRoot: "/channels",
  fetch,
});

export const tagsService = new ResourceService<Tag>({
  queryKey: "tags",
  pathRoot: "/tags",
  fetch,
});
