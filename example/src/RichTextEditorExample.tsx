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
        <TextInput
          placeholder="Title your page"
          value={page.title}
          // onChangeText={setTitle}
          onChangeText={(text) => onChange?.({ ...page, title: text })}
          fullWidth
        />

        {/* <Layout.Box spacingSize={[0, 1]}>
          <Divider />
        </Layout.Box> */}

        <Space spacingSize={2} />

        <RichTextInput
          defaultValue={page.content}
          placeholder="Write your content"
          isFocused={isFocused}
          onFocus={onFocus}
          // toolbar={toolbar}
          onChangeText={(text) => onChange?.({ ...page, content: text })}
          footer={
            <>
              <Space />

              {/* {toolbar}

              <Space spacingSize={0.5} /> */}

              <RichTextInput.Footer>
                {isNumber(pageCount) && isNumber(pageNum) && (
                  <RichTextInput.Footer.PageNumberItem
                    pageNum={pageNum}
                    pageCount={pageCount}
                  />
                )}

                <RichTextInput.Footer.WordCountItem />
              </RichTextInput.Footer>
            </>
          }
        />
      </Surface>
    </Layout.Column>
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
        <Layout.Box spacingSize={[1, 0]}>
          {/* <Text.Title>Train of Thought</Text.Title> */}
        </Layout.Box>

        <Layout.Row justifyContent="center">
          <AddPageButton pageIndex={0} />
        </Layout.Row>

        {pages.map((page, index) => (
          <React.Fragment key={page.id}>
            <Layout.Box spacingSize={[4, 1]}>
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

        <Space />
      </Tooltip.Provider>
    </Container>
    // </ScrollView>
  );
}

export default RichTextEdtiorExample;
