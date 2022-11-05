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
  Effect,
  FadeInElement,
  theme,
  Modal,
  Button,
  LayoutBoxProps,
  Divider,
  Menu,
  Icon,
  greedy,
} from "@jnesbella/body-builder";
import { QueryClientProvider, QueryClient, useQuery } from "react-query";
import { Animated } from "react-native";
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

export interface BoxWithPaddingProps {
  maxWidth?: number;
  children?: React.ReactNode;
}

const BoxWithPadding = ({ maxWidth, children }: BoxWithPaddingProps) => {
  return (
    <Layout.Box greedy style={{ maxWidth }}>
      <Surface greedy>{children}</Surface>
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

interface FadeInFadeOutProps {
  enabled?: boolean;
  onFadedOut?: () => void;
  duration?: number;
  delay?: number;
}

function FadeInFadeOut({
  enabled = true,
  onFadedOut,
  duration,
  delay,
}: FadeInFadeOutProps) {
  const ref = React.useRef<FadeInElement>(null);

  return (
    <Effect.FadeIn
      greedy
      ref={ref}
      duration={duration}
      delay={delay}
      onFadeInComplete={() => {
        ref.current?.fadeOut();
      }}
      onFadeOutComplete={() => {
        if (enabled) {
          ref.current?.fadeIn();
        } else {
          onFadedOut?.();
        }
      }}
    >
      <Layout.Box spacingSize={1} greedy>
        <Surface greedy background={theme.colors.primaryLight} />
      </Layout.Box>
    </Effect.FadeIn>
  );
}

export interface LabledBoxProps extends LayoutBoxProps {
  label: string;
}

function LabledBox({ label, greedy = true, ...rest }: LabledBoxProps) {
  return (
    <Surface greedy={greedy} {...rest}>
      <Layout.Box
        spacingSize={1}
        greedy
        justifyContent="center"
        alignItems="center"
      >
        <Text.Label>{label}</Text.Label>
      </Layout.Box>
    </Surface>
  );
}

const NavMenuWrapper = styled(Animated.View)<{
  isVisible?: boolean;
  width?: number;
}>`
  z-index: ${theme.zIndex.aboveAll};
  left: ${(props) => (props.isVisible ? 0 : -(props.width || 0))}px;
  transition: left 0.2s;
`;

export interface NavMenuProps {
  isVisible?: boolean;
  isPinnedOpen?: boolean;
  width?: number;
}

function NavMenu({ isVisible, isPinnedOpen, width = 0 }: NavMenuProps) {
  const ref = React.useRef<FadeInElement>(null);

  React.useEffect(
    function handleVisiblityChange() {
      if (isVisible || isPinnedOpen) {
        ref.current?.fadeIn();
      } else {
        ref.current?.fadeOut();
      }
    },
    [isVisible, isPinnedOpen]
  );

  return (
    <Layout.Column greedy>
      <Effect.FadeIn ref={ref} duration={200} greedy={isPinnedOpen}>
        <NavMenuWrapper
          isVisible={isVisible || isPinnedOpen}
          width={width}
          style={{ flex: 1, position: !isPinnedOpen ? "absolute" : "relative" }}
        >
          <Menu
            elevation={isPinnedOpen ? 0 : 1}
            style={{ width: width }}
            spacingSize={[0, 1]}
            greedy={isPinnedOpen}
          >
            <Menu.Item fullWidth>
              <Layout.Row alignItems="center">
                <Icon icon={Icons.Hash} />

                <Space spacingSize={0.5} />

                <Menu.Text>sewing</Menu.Text>
              </Layout.Row>
            </Menu.Item>

            <Layout.Box greedy={isPinnedOpen} />

            <Divider />

            <Menu.Item fullWidth>
              <Layout.Row alignItems="center">
                <Icon icon={Icons.Plus} />

                <Space spacingSize={0.5} />

                <Menu.Text>New Thread</Menu.Text>
              </Layout.Row>
            </Menu.Item>
          </Menu>
        </NavMenuWrapper>
      </Effect.FadeIn>
    </Layout.Column>
  );
}

const NavBarContainer = styled(Surface)`
  z-index: ${theme.zIndex.aboveAll};
`;

export interface NavProps {
  children?: React.ReactNode;
}

function Nav() {
  const [isPinnedOpen, setIsPinnedOpen] = React.useState(false);
  const width = 300;

  return (
    <NavBarContainer>
      <Pressable greedy>
        {(pressableProps) => (
          <Layout.Column
            style={{ width: isPinnedOpen ? width : undefined }}
            greedy
          >
            <IconButton
              icon={Icons.List}
              onPress={() => setIsPinnedOpen(!isPinnedOpen)}
            />

            <NavMenu
              isVisible={pressableProps.hovered}
              isPinnedOpen={isPinnedOpen}
              width={width}
            />
          </Layout.Column>
        )}
      </Pressable>
    </NavBarContainer>
  );
}

function AppLayout() {
  return (
    <React.Fragment>
      {/* <Modal isVisible>
        <Text>Banana</Text>
      </Modal> */}

      <Info greedy>
        <Layout.Row greedy>
          <Nav />

          <Divider vertical />

          <Layout.Column greedy>
            <LabledBox label="Search" maxHeight={theme.spacing * 4} />

            <Divider />

            <Layout.Row greedy>
              <Layout.Column greedy>
                <LabledBox label="Pinned Notes" maxHeight={theme.spacing * 6} />

                <Divider />

                <LabledBox label="Notes" />
              </Layout.Column>

              <Divider vertical />

              <LabledBox label="Thread" maxWidth={300} />
            </Layout.Row>

            <Divider />

            <LabledBox label="Note Editor" maxHeight={theme.spacing * 10} />
          </Layout.Column>
        </Layout.Row>
      </Info>
    </React.Fragment>
  );
}

interface PleasantLoadingProps {
  children?: React.ReactNode;
  mockLoadingTimeout?: number;
}

function PleasantLoading({
  children,
  mockLoadingTimeout = 2000,
}: PleasantLoadingProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [_isFadedOut, setIsFadedOut] = React.useState(false);

  const isFadedOut = _isFadedOut || !mockLoadingTimeout;

  return (
    <React.Fragment>
      {!isFadedOut && !!mockLoadingTimeout && (
        <FadeInFadeOut
          duration={600}
          delay={300}
          enabled={!isLoaded && !!mockLoadingTimeout}
          onFadedOut={() => setIsFadedOut(true)}
        />
      )}

      <Async.Suspense onLoadingComplete={() => setIsLoaded(true)}>
        <Util.Suspend timeout={mockLoadingTimeout} />

        {isLoaded && isFadedOut && (
          <Effect.FadeIn greedy>{children}</Effect.FadeIn>
        )}
      </Async.Suspense>
    </React.Fragment>
  );
}

function Main() {
  return (
    <QueryClientProvider client={queryClient}>
      <AsyncStorageProvider storage={storage}>
        <ErrorBoundary fallback={<ErrorMessage />}>
          <Pressable.Provider>
            <PleasantLoading mockLoadingTimeout={0}>
              <AppLayout />
            </PleasantLoading>
          </Pressable.Provider>
        </ErrorBoundary>
      </AsyncStorageProvider>
    </QueryClientProvider>
  );
}

export default Main;
