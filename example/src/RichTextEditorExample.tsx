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
} from "@jnesbella/body-builder";
import { v4 as uuidv4 } from "uuid";
import * as Icons from "react-bootstrap-icons";
import { ScrollView } from "react-native";
import styled from "styled-components/native";

const Container = styled(ScrollView).attrs({
  background: theme.colors.backgroundInfo,
  greedy: true,
})`
  ${background};
  ${greedy};
`;

interface Page {
  id: string;
  index: number;
  title: string;
  content?: string;
}

const createPage = (index: number, payload?: Partial<Page>) => ({
  id: uuidv4(),
  index,
  title: "",
  ...payload,
});

function Page({
  page,
  isFocused,
  onFocus,
}: {
  page: Page;
  onFocus?: () => void;
  isFocused?: boolean;
}) {
  const [title, setTitle] = React.useState(page.title);

  return (
    <Layout.Column>
      <Space />

      {/* <Layout.Box spacingSize={[0.5, 0]}>
        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          fullWidth
        />
      </Layout.Box> */}

      {/* <Space spacingSize={0.5} /> */}

      <Surface spacingSize={0.5}>
        <TextInput
          placeholder="Title your page"
          value={title}
          onChangeText={setTitle}
          fullWidth
        />

        <Space spacingSize={0.5} />

        <RichTextInput
          defaultValue={page.content}
          placeholder="Write your content"
          isFocused={isFocused}
          onFocus={onFocus}
        />
      </Surface>
    </Layout.Column>
  );
}

function RichTextEdtiorExample() {
  const [pages, setPages] = React.useState<Page[]>([createPage(0)]);

  const [focusedPageIndex, setFocusedPageIndex] = React.useState<
    number | undefined
  >();

  return (
    // <ScrollView contentContainerStyle={{ flex: 1 }}>
    <Container>
      <Layout.Box spacingSize={[1, 0]}>
        <Text.Title>Train of Thought</Text.Title>
      </Layout.Box>

      <Layout.Row justifyContent="center">
        <Button
          // mode="contained"
          onPress={() =>
            setPages((prevPages) => [
              ...prevPages,
              createPage(prevPages.length),
            ])
          }
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
      </Layout.Row>

      {pages.map((page, index) => (
        <Page
          key={page.id}
          page={page}
          isFocused={focusedPageIndex === index}
          onFocus={() => setFocusedPageIndex(index)}
        />
      ))}

      <Space />
    </Container>
    // </ScrollView>
  );
}

export default RichTextEdtiorExample;
