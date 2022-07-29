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
  shadow,
  bordered,
  IconButton,
  Portal,
  Tooltip,
  Pressable,
  log,
} from "@jnesbella/body-builder";
import { v4 as uuidv4 } from "uuid";
import * as Icons from "react-bootstrap-icons";
import { ScrollView } from "react-native";
import styled from "styled-components/native";
import { isNumber } from "lodash";

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
  // ${shadow};
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
      <Pressable isFocused={isTitleFocused || isContentFocused}>
        {(pressableProps) => (
          <Layout.Column>
            {/* <Layout.Box spacingSize={[0.5, 0]}>
        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          fullWidth
        />
      </Layout.Box> */}

            {/* <Space spacingSize={0.5} /> */}

            <Surface spacingSize={1}>
              <Layout.Row alignItems="center">
                <Layout.Box greedy>
                  <TextInput
                    value={page.title}
                    // onChangeText={setTitle}
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
                    }}
                    onBlur={() => {
                      setIsTitleFocused(false);
                    }}
                  />
                </Layout.Box>

                <Space />

                <Layout.Box opacity={pressableProps.hovered ? 1 : 0}>
                  <IconButton icon={Icons.ThreeDotsVertical} />
                </Layout.Box>
              </Layout.Row>

              {/* <Layout.Box spacingSize={[0, 1]}>
          <Divider />
        </Layout.Box> */}

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
                }}
                onBlur={() => {
                  setIsContentFocused(false);
                }}
                // toolbar={toolbar}
                onChangeText={(text) => onChange?.({ ...page, content: text })}
                footer={
                  <>
                    <Space spacingSize={1} />

                    {/* {toolbar}

              <Space spacingSize={0.5} /> */}

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

  return (
    // <ScrollView contentContainerStyle={{ flex: 1 }}>
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
    // </ScrollView>
  );
}

export default RichTextEdtiorExample;
