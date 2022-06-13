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
  SlateEditorToolbar,
} from "@jnesbella/body-builder";
import { v4 as uuidv4 } from "uuid";

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

function Page({ page }: { page: Page }) {
  const [title, setTitle] = React.useState(page.title);

  return (
    <Layout.Column>
      <Space />

      <Layout.Box spacingSize={[0.5, 0]}>
        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          fullWidth
        />
      </Layout.Box>

      <Space spacingSize={0.5} />

      <Surface spacingSize={0.5}>
        <RichTextInput defaultValue={page.content} />
      </Surface>
    </Layout.Column>
  );
}

function RichTextEdtiorExample() {
  const [pages, setPages] = React.useState<Page[]>([createPage(0)]);

  return (
    <Surface background={theme.colors.backgroundInfo} greedy>
      <Layout.Column>
        <Layout.Box spacingSize={[1, 0]}>
          <Text.Title>Train of Thought</Text.Title>
        </Layout.Box>

        {pages.map((page) => (
          <Page key={page.id} page={page} />
        ))}
      </Layout.Column>
    </Surface>
  );
}

export default RichTextEdtiorExample;
