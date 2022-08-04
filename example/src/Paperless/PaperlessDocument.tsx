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
} from "@jnesbella/body-builder";
import * as Icons from "react-bootstrap-icons";
import { ScrollView } from "react-native";
import styled from "styled-components/native";

import { initialValue } from "./paperlessConstants";
import { createPage } from "./paperlessHelpers";
import { PaperlessPage } from "./paperlessTypes";
import Page, { PaperlessPageElement } from "./PaperlessPage";
import Measure, { MeasureElement } from "./Measure";
import { range, sum } from "lodash";

const TitleBarContainer = styled(Surface).attrs({ elevation: 1 })`
  ${zIndex("aboveAll")};
`;

const DocumentContainer = styled(ScrollView).attrs({
  background: theme.colors.backgroundInfo,
  greedy: true,
})`
  ${background};
  ${greedy};
`;

const PageWrapper = styled(Layout.Column)`
  ${bordered};
  max-width: ${theme.spacing * 100}px;
  width: 100%;
`;

function PaperlessDocument() {
  const [isTableOfContentsVisible, setIsTableOfContentsVisible] =
    React.useState(false);

  const [pages, setPages] = React.useState<PaperlessPage[]>([
    createPage({ content: initialValue }),
  ]);

  const [focusedPageIndex, setFocusedPageIndex] = React.useState<
    number | undefined
  >();

  const tooltipRef = React.useRef<TooltipElement>(null);

  const addPage = () => setPages((prevPages) => [...prevPages, createPage()]);

  const pagesRef = React.useRef<Record<number, MeasureElement | null>>(
    pages.reduce((memo, _page, index) => ({ ...memo, [index]: null }), {})
  );

  const [pagesOffsetTop, setPagesOffsetTop] = React.useState<number>(0);

  const scrollViewRef = React.useRef<ScrollView>(null);

  const scrollToPage = (pageIndex: number) => {
    const y =
      sum(
        range(pageIndex).map(
          (index) => pagesRef.current[index]?.layout?.height || 0
        )
      ) + pagesOffsetTop;

    scrollViewRef.current?.scrollTo({ y, animated: true });
  };

  log("PaperlessDocument: ", pagesRef);

  const insertPage = (index: number) =>
    setPages((prevPages) => [
      ...prevPages.slice(0, index),
      createPage(),
      ...prevPages.slice(index),
    ]);

  const AddPageButton = ({ pageIndex }: { pageIndex: number }) => (
    <IconButton icon={Icons.Plus} onPress={() => insertPage(pageIndex)} />
  );

  const titleBar = (
    <TitleBarContainer>
      <Pressable
        onBlur={() => {
          tooltipRef.current?.hide();
        }}
      >
        {(pressableProps) => (
          <Layout.Row alignItems="center" spacingSize={1}>
            <Layout.Box greedy>
              <TextInput
                fullWidth
                placeholder={
                  pressableProps.focused || pressableProps.hovered
                    ? "Title your document"
                    : ""
                }
                onFocus={pressableProps.focus}
                onBlur={pressableProps.blur}
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
              id="Document_Tooltip"
              placement="bottom-end"
              topOffset={theme.spacing}
              content={
                <Menu elevation={1}>
                  <Menu.Item>
                    <Layout.Row alignItems="center">
                      <Icon icon={Icons.Download} size={Icon.size.small} />

                      <Space />

                      <Menu.Text>Download</Menu.Text>
                    </Layout.Row>
                  </Menu.Item>

                  <Menu.Item>
                    <Layout.Row alignItems="center">
                      <Icon icon={Icons.Trash} size={Icon.size.small} />

                      <Space />

                      <Menu.Text>Delete</Menu.Text>
                    </Layout.Row>
                  </Menu.Item>
                </Menu>
              }
            >
              {(tooltipProps) => (
                <IconButton
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
    <Layout.Column spacingSize={[0, 0.5]}>
      <Layout.Row
        justifyContent="center"
        onLayout={(event) => setPagesOffsetTop(event.nativeEvent.layout.height)}
      >
        <AddPageButton pageIndex={0} />
      </Layout.Row>

      {pages.map((page, index) => (
        <Measure
          key={page.id}
          ref={(node) => {
            console.log("measure ref: ", { index, node });
            pagesRef.current[index] = node;
          }}
        >
          <Layout.Box spacingSize={[0, 0.5]} alignItems="center">
            <PageWrapper>
              <Page
                page={page}
                pageNum={index + 1}
                isFocused={focusedPageIndex === index}
                onFocus={() => setFocusedPageIndex(index)}
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

          <Layout.Row justifyContent="center">
            <AddPageButton pageIndex={index + 1} />
          </Layout.Row>
        </Measure>
      ))}
    </Layout.Column>
  );

  const tableOfContents = (
    <Surface greedy maxWidth={theme.spacing * 200}>
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
                      <Text.Label>
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
    <Tooltip.Provider>
      <Surface background={theme.colors.backgroundInfo} greedy>
        {titleBar}

        <Layout.Row greedy>
          <ScrollView ref={scrollViewRef} contentContainerStyle={{ flex: 1 }}>
            {pagesContent}
          </ScrollView>

          {isTableOfContentsVisible && tableOfContents}
        </Layout.Row>
      </Surface>
    </Tooltip.Provider>
  );
}

export default PaperlessDocument;
