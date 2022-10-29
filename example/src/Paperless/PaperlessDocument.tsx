import * as React from "react";
import {
  Layout,
  Surface,
  theme,
  TextInput,
  Divider,
  Text,
  Space,
  Button,
  background,
  greedy,
  bordered,
  IconButton,
  Tooltip,
  Pressable,
  zIndex,
  Menu,
  Icon,
  TooltipElement,
  log,
  TooltipProviderElement,
  ButtonElement,
  RichTextInput,
  ScrollView,
  useForceUpdate,
} from "@jnesbella/body-builder";
import * as Icons from "react-bootstrap-icons";
// import { ScrollView } from "react-native";
import styled from "styled-components/native";

import { initialValue } from "./paperlessConstants";
import { createPage } from "./paperlessHelpers";
import { PaperlessPage } from "./paperlessTypes";
import Page, { PaperlessPageElement } from "./PaperlessPage";
import Measure, { MeasureElement } from "./Measure";
import { isNumber, range, sum } from "lodash";
import { ReactEditor } from "slate-react";
import { CustomEditor } from "../../../dist/slateTypings";

const TitleBarContainer = styled(Surface).attrs({ elevation: 1 })`
  ${zIndex("aboveAll")};
`;

const PageWrapper = styled(Layout.Box)`
  ${bordered};
  max-width: ${theme.spacing * 100}px;
  width: 100%;
`;

function PaperlessDocument() {
  const [isTableOfContentsVisible, setIsTableOfContentsVisible] =
    React.useState(true);

  const [pages, setPages] = React.useState<PaperlessPage[]>([
    createPage({ content: initialValue }),
  ]);

  const [focusedPageIndex, setFocusedPageIndex] = React.useState<
    number | undefined
  >();

  const tooltipRef = React.useRef<TooltipElement>(null);

  const threeDotsMenuButtonRef = React.useRef<ButtonElement>(null);

  const tooltipProviderRef = React.useRef<TooltipProviderElement>(null);

  const addPage = () => setPages((prevPages) => [...prevPages, createPage()]);

  const [pageElements, setPageElements] = React.useState<
    Record<number, PaperlessPageElement | null>
  >({});

  const capturePageElement = React.useCallback(
    (pageIndex: number, pageElement: PaperlessPageElement | null) => {
      const { name } = pageElements?.[pageIndex] || {};

      if (name !== pageElement?.name) {
        setPageElements((prevPageElements) => ({
          ...prevPageElements,
          [pageIndex]: pageElement,
        }));
      }
    },
    [pageElements]
  );

  const editor = React.useMemo(
    () =>
      isNumber(focusedPageIndex)
        ? pageElements?.[focusedPageIndex]?.editor
        : undefined,
    [pageElements, focusedPageIndex]
  );

  const pagesMeasurementsRef = React.useRef<
    Record<number, MeasureElement | null>
  >(pages.reduce((memo, _page, index) => ({ ...memo, [index]: null }), {}));

  const scrollViewRef = React.useRef<ScrollView>(null);

  const scrollToPage = (pageIndex: number) => {
    const y = sum(
      range(pageIndex).map(
        (index) => pagesMeasurementsRef.current[index]?.layout?.height || 0
      )
    );

    scrollViewRef.current?.scrollTo({ y, animated: true });
  };

  const insertPage = (index: number) =>
    setPages((prevPages) => [
      ...prevPages.slice(0, index),
      createPage(),
      ...prevPages.slice(index),
    ]);

  const AddPageButton = ({ pageIndex }: { pageIndex: number }) => (
    <Tooltip
      placement="right-center"
      content={<Tooltip.Text>Add page</Tooltip.Text>}
    >
      {(tooltipProps) => (
        <IconButton
          icon={Icons.Plus}
          onPress={() => {
            tooltipProviderRef.current?.blurTooltip();
            insertPage(pageIndex);
            // TODO
            window.setTimeout(() => {
              scrollToPage(pageIndex);
            });
          }}
          onHoverOver={tooltipProps.onHoverOver}
          onHoverOut={tooltipProps.onHoverOut}
        />
      )}
    </Tooltip>
  );

  const [isTitleFocused, setIsTitleFocused] = React.useState(false);

  const titleBar = (
    <TitleBarContainer>
      <Pressable
        isFocused={isTitleFocused}
        onBlur={() => {
          tooltipRef.current?.hide();
        }}
        greedy
      >
        {(pressableProps) => (
          <Layout.Row alignItems="center" spacingSize={1} greedy>
            <Layout.Box greedy>
              <TextInput
                fullWidth
                placeholder="Untitled"
                // placeholder={
                //   pressableProps.focused || pressableProps.hovered
                //     ? "Title your document"
                //     : ""
                // }
                onFocus={() => {
                  setIsTitleFocused(true);
                  pressableProps.focus();
                  tooltipRef.current?.hide();
                }}
                onBlur={() => {
                  setIsTitleFocused(false);
                  pressableProps.blur();
                }}
              />
            </Layout.Box>

            <Space />

            <IconButton
              icon={
                isTableOfContentsVisible
                  ? Icons.ArrowBarRight
                  : Icons.ArrowBarLeft
              }
              onPress={() =>
                setIsTableOfContentsVisible(!isTableOfContentsVisible)
              }
            />

            <Space />

            <Tooltip
              ref={tooltipRef}
              placement="bottom-end"
              topOffset={theme.spacing + theme.borderThickness}
              onHide={() => {
                threeDotsMenuButtonRef.current?.blur();
              }}
              content={(tooltipProps) => (
                <Menu elevation={1}>
                  <Menu.Item
                    onPress={() => {
                      tooltipProps.hide();
                    }}
                  >
                    <Layout.Row alignItems="center">
                      <Icon icon={Icons.Download} size={Icon.size.small} />

                      <Space />

                      <Menu.Text>Download</Menu.Text>
                    </Layout.Row>
                  </Menu.Item>

                  <Menu.Item
                    onPress={() => {
                      tooltipProps.hide();
                    }}
                  >
                    <Layout.Row alignItems="center">
                      <Icon icon={Icons.Trash} size={Icon.size.small} />

                      <Space />

                      <Menu.Text>Delete</Menu.Text>
                    </Layout.Row>
                  </Menu.Item>
                </Menu>
              )}
            >
              {(tooltipProps) => (
                <IconButton
                  ref={threeDotsMenuButtonRef}
                  icon={Icons.ThreeDotsVertical}
                  onPress={() => {
                    tooltipProps.onPress();
                  }}
                  isFocused={tooltipProps.focused}
                  onBlur={() => {
                    tooltipProps.onBlur();
                  }}
                />
              )}
            </Tooltip>
          </Layout.Row>
        )}
      </Pressable>
    </TitleBarContainer>
  );

  const pagesContent = (
    <Layout.Column spacingSize={[0, 0.5]} greedy>
      {pages.map((page, index) => (
        <Measure
          key={page.id}
          ref={(node) => {
            pagesMeasurementsRef.current[index] = node;
          }}
        >
          <Layout.Row justifyContent="center">
            <AddPageButton pageIndex={index} />
          </Layout.Row>

          <Layout.Box spacingSize={[0, 0.5]} alignItems="center">
            <PageWrapper>
              <Page
                ref={(pageElement) => capturePageElement(index, pageElement)}
                page={page}
                pageNum={index + 1}
                isFocused={focusedPageIndex === index}
                onFocus={() => {
                  setFocusedPageIndex(index);
                  // const nextEditor = pageRefs[index].current?.getEditor();

                  // setEditor(nextEditor);
                }}
                onBlur={() => {
                  if (focusedPageIndex === index) {
                    setFocusedPageIndex(undefined);
                  }

                  // setEditor(undefined);
                }}
                pageCount={pages.length}
                onChange={(page) =>
                  setPages((prevPages) => [
                    ...prevPages.slice(0, index),
                    page,
                    ...prevPages.slice(index + 1),
                  ])
                }
              />
            </PageWrapper>
          </Layout.Box>
        </Measure>
      ))}

      <Layout.Row justifyContent="center">
        <AddPageButton pageIndex={pages.length} />
      </Layout.Row>
    </Layout.Column>
  );

  const tableOfContents = (
    <Surface greedy maxWidth={theme.spacing * 40}>
      <Layout.Row greedy>
        <Divider vertical />

        <Layout.Box greedy>
          <ScrollView>
            <Layout.Column greedy spacingSize={1}>
              <Text.SubHeader>Table of Contents</Text.SubHeader>

              <Space />

              {pages.map((page, index) => (
                <React.Fragment key={`TableOfContents_Page_${page.id}`}>
                  {index > 0 && <Space spacingSize={0.5} />}

                  <Button
                    focusOnPress={false}
                    focusable={false}
                    onPress={() => scrollToPage(index)}
                  >
                    <Layout.Row alignItems="center">
                      <Text.Label numberOfLines={1}>
                        {index + 1}. {page.title || "Untitled"}
                      </Text.Label>
                    </Layout.Row>
                  </Button>
                </React.Fragment>
              ))}
            </Layout.Column>
          </ScrollView>
        </Layout.Box>
      </Layout.Row>
    </Surface>
  );

  return (
    <Tooltip.Provider greedy>
      <Surface background={theme.colors.backgroundInfo} greedy>
        {titleBar}

        <Layout.Row greedy>
          <Surface fullHeight>
            <ScrollView>
              {({ contentOffset }) => (
                <Layout.Box spacingSize={1}>
                  <RichTextInput.Toolbar
                    editor={editor}
                    topOffset={-(contentOffset?.y || 0)}
                  />
                </Layout.Box>
              )}
            </ScrollView>
          </Surface>

          <ScrollView ref={scrollViewRef} contentContainerStyle={{ flex: 1 }}>
            <Tooltip.Provider ref={tooltipProviderRef}>
              {pagesContent}
            </Tooltip.Provider>
          </ScrollView>

          {isTableOfContentsVisible && tableOfContents}
        </Layout.Row>
      </Surface>
    </Tooltip.Provider>
  );
}

export default PaperlessDocument;
