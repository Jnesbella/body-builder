import * as React from "react";
import {
  RichTextInput,
  Layout,
  Surface,
  theme,
  TextInput,
  Divider,
  Text,
  Space,
  Button,
  Icon,
  background,
  greedy,
  Info,
  bordered,
  IconButton,
  Portal,
  Tooltip,
  Pressable,
  log,
  Menu,
  TooltipElement,
  zIndex,
} from "@jnesbella/body-builder";
import { v4 as uuidv4 } from "uuid";
import * as Icons from "react-bootstrap-icons";
import { ScrollView } from "react-native";
import styled from "styled-components/native";
import { isNumber } from "lodash";

const TitleBar = styled(Surface).attrs({ elevation: 1 })`
  ${zIndex("aboveAll")};
`;

const Container = styled(ScrollView).attrs({
  background: theme.colors.backgroundInfo,
  greedy: true,
})`
  ${background};
  ${greedy};
`;

const PageContainer = styled(Layout.Box)`
  overflow: hidden;
`;

interface Page {
  id: string;
  title: string;
  content?: string;
  index?: number;
}

const createPage = (payload?: Partial<Page>) => ({
  id: uuidv4(),
  title: "",
  ...payload,
});

const PageWrapper = styled(Layout.Column)`
  ${bordered};
  max-width: ${theme.spacing * 100}px;
  width: 100%;
`;

function Page({
  page,
  isFocused,
  onFocus,
  pageCount,
  onChange,
  pageNum,
}: {
  page: Page;
  onFocus?: () => void;
  isFocused?: boolean;
  pageCount?: number;
  onChange?: (page: Page) => void;
  pageNum?: number;
}) {
  // const [title, setTitle] = React.useState(page.title);
  const [isTitleFocused, setIsTitleFocused] = React.useState(false);

  const [isContentFocused, setIsContentFocused] = React.useState(false);

  const tooltipRef = React.useRef<TooltipElement>(null);

  const toolbar = isFocused && <RichTextInput.Toolbar />;

  // React.useEffect(
  //   function handlePageChange() {
  //     if (onChange) {
  //       onChange({ ...page, title });
  //     }
  //   },
  //   [onChange, title, page]
  // );

  return (
    <PageContainer>
      <Pressable
        // focusOn="none"
        isFocused={isTitleFocused || isContentFocused}
        name={`Page_${pageNum}`}
        onBlur={() => {
          tooltipRef.current?.hide();
        }}
      >
        {(pressableProps) => (
          <Layout.Column>
            <Surface spacingSize={1}>
              <Layout.Row alignItems="center">
                <Layout.Box greedy>
                  <TextInput
                    value={page.title}
                    onChangeText={(text) =>
                      onChange?.({ ...page, title: text })
                    }
                    fullWidth
                    placeholder={
                      pressableProps.hovered || pressableProps.focused
                        ? "Title your page"
                        : ""
                    }
                    onFocus={() => {
                      setIsTitleFocused(true);
                      tooltipRef.current?.hide();
                    }}
                    onBlur={() => {
                      setIsTitleFocused(false);
                    }}
                  />
                </Layout.Box>

                <Space />

                <Tooltip
                  ref={tooltipRef}
                  // id={`Page_Tooltip_${pageNum}`}
                  placement="left"
                  content={
                    <Menu elevation={1}>
                      <Menu.Item>
                        <Layout.Row alignItems="center">
                          <Icon icon={Icons.Printer} size={Icon.size.small} />

                          <Space />

                          <Menu.Text>Print</Menu.Text>
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
                    <Layout.Box
                      opacity={
                        pressableProps.hovered || pressableProps.focused ? 1 : 0
                      }
                    >
                      <IconButton
                        size="small"
                        icon={Icons.ThreeDotsVertical}
                        onPress={() => {
                          tooltipProps.onPress();
                        }}
                      />
                    </Layout.Box>
                  )}
                </Tooltip>
              </Layout.Row>

              <Space spacingSize={1} />

              <RichTextInput
                name={`page-${page.id}`}
                defaultValue={page.content}
                placeholder={
                  pressableProps.hovered || pressableProps.focused
                    ? "Write your content"
                    : ""
                }
                isFocused={isFocused}
                onFocus={() => {
                  setIsContentFocused(true);
                  tooltipRef.current?.hide();
                }}
                onBlur={() => {
                  setIsContentFocused(false);
                }}
                onChangeText={(text) => onChange?.({ ...page, content: text })}
                footer={
                  <>
                    <Space spacingSize={1} />

                    <RichTextInput.Footer>
                      {isNumber(pageCount) && isNumber(pageNum) && (
                        <RichTextInput.Footer.PageNumberItem
                          pageNum={pageNum}
                          pageCount={pageCount}
                        />
                      )}

                      {(pressableProps.hovered || pressableProps.focused) && (
                        <RichTextInput.Footer.WordCountItem />
                      )}
                    </RichTextInput.Footer>
                  </>
                }
              />
            </Surface>
          </Layout.Column>
        )}
      </Pressable>
    </PageContainer>
  );
}

const initialValue = JSON.stringify([
  {
    type: "heading",
    children: [
      {
        text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      },
    ],
  },
  {
    type: "subheading",
    children: [
      {
        text: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      },
    ],
  },
  {
    type: "label",
    children: [
      {
        text: "It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      },
    ],
  },
  {
    type: "caption",
    children: [
      {
        text: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "",
      },
    ],
  },
]);

function RichTextEdtiorExample() {
  const [isTableOfContentsVisible, setIsTableOfContentsVisible] =
    React.useState(false);

  const [pages, setPages] = React.useState<Page[]>([
    createPage({ content: initialValue }),
  ]);

  const [focusedPageIndex, setFocusedPageIndex] = React.useState<
    number | undefined
  >();

  const addPage = () => setPages((prevPages) => [...prevPages, createPage()]);

  const insertPage = (index: number) =>
    setPages((prevPages) => [
      ...prevPages.slice(0, index),
      createPage(),
      ...prevPages.slice(index),
    ]);

  const AddPageButton = ({ pageIndex }: { pageIndex: number }) => (
    <IconButton icon={Icons.Plus} onPress={() => insertPage(pageIndex)} />
  );

  const addPageButton = (
    <Button
      // mode="contained"
      onPress={addPage}
    >
      {(buttonProps) => (
        <Button.Container {...buttonProps}>
          <Layout.Row alignItems="center" spacingSize={[1, 0]}>
            <Icon
              color={buttonProps.color}
              background={buttonProps.background}
              icon={Icons.Plus}
            />

            <Space />

            <Button.Text color={buttonProps.color}>Add Page</Button.Text>
          </Layout.Row>
        </Button.Container>
      )}
    </Button>
  );

  const titleBar = (
    <TitleBar>
      <Pressable>
        {(pressableProps) => (
          <Layout.Row alignItems="center" spacingSize={1}>
            <IconButton
              icon={
                isTableOfContentsVisible
                  ? Icons.ArrowBarLeft
                  : Icons.ArrowBarRight
              }
              onPress={() =>
                setIsTableOfContentsVisible(!isTableOfContentsVisible)
              }
            />

            <Space />

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

            <IconButton icon={Icons.ThreeDotsVertical} />
          </Layout.Row>
        )}
      </Pressable>
    </TitleBar>
  );

  const pagesContent = (
    <Container>
      <Tooltip.Provider>
        {/* <Layout.Box spacingSize={[1, 0]}>
         <Text.Title>Train of Thought</Text.Title> 
      </Layout.Box> */}

        <Space spacingSize={0.5} />

        <Layout.Row justifyContent="center">
          <AddPageButton pageIndex={0} />
        </Layout.Row>

        {pages.map((page, index) => (
          <React.Fragment key={page.id}>
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
          </React.Fragment>
        ))}

        <Space spacingSize={0.5} />
      </Tooltip.Provider>
    </Container>
  );

  const tableOfContents = (
    <Layout.Row>
      <Layout.Column spacingSize={1}>
        <Text.SubHeader>Table of Contents</Text.SubHeader>

        {pages.map((page, index) => (
          <React.Fragment key={`TableOfContents_Page_${page.id}`}>
            {index > 0 && <Space spacingSize={0.5} />}

            <Button focusOnPress={false} focusable={false}>
              <Layout.Row alignItems="center">
                <Text.Label>
                  {index + 1}. {page.title || "Untitled"}
                </Text.Label>
              </Layout.Row>
            </Button>
          </React.Fragment>
        ))}
      </Layout.Column>

      <Divider vertical />
    </Layout.Row>
  );

  return (
    <Layout.Column greedy>
      {titleBar}

      <Layout.Row greedy>
        {isTableOfContentsVisible && tableOfContents}

        {pagesContent}
      </Layout.Row>
    </Layout.Column>
  );
}

export default RichTextEdtiorExample;
