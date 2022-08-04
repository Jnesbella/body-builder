import * as React from "react";
import {
  RichTextInput,
  Layout,
  Surface,
  theme,
  TextInput,
  Space,
  Icon,
  bordered,
  IconButton,
  Tooltip,
  Pressable,
  Menu,
  TooltipElement,
  setRef,
} from "@jnesbella/body-builder";
import * as Icons from "react-bootstrap-icons";
import styled from "styled-components/native";
import { isNumber } from "lodash";
import { LayoutChangeEvent, LayoutRectangle } from "react-native";
import { PaperlessPage as Page } from "./paperlessTypes";

const PaperlessPageContainer = styled(Layout.Box)`
  overflow: hidden;
`;

export interface PaperlessPageElement {
  layout?: LayoutRectangle;
}

// interface Page {
//   id: string;
//   title: string;
//   content?: string;
//   index?: number;
// }

export interface PaperlessPageProps {
  page: Page;
  onFocus?: () => void;
  isFocused?: boolean;
  pageCount?: number;
  onChange?: (page: Page) => void;
  pageNum?: number;
}

const PaperlessPage = React.forwardRef<
  PaperlessPageElement,
  PaperlessPageProps
>(
  (
    {
      page,
      isFocused,
      // onFocus,
      pageCount,
      onChange,
      pageNum,
    },
    ref
  ) => {
    const [isTitleFocused, setIsTitleFocused] = React.useState(false);

    const [isContentFocused, setIsContentFocused] = React.useState(false);

    const tooltipRef = React.useRef<TooltipElement>(null);

    const [layout, setLayout] = React.useState<LayoutRectangle>();

    const element: PaperlessPageElement = {
      layout,
    };

    React.useEffect(function handleRef() {
      setRef(ref, element);
    });

    return (
      <PaperlessPageContainer
      // onLayout={(event) => setLayout(event.nativeEvent.layout)}
      >
        <Pressable
          isFocused={isTitleFocused || isContentFocused}
          name={`Page_${pageNum}`}
          onBlur={() => {
            tooltipRef.current?.hide();
          }}
          // focusOnPress
          // focusable={false}
          focusOn="none"
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
                    id={`Page_Tooltip_${pageNum}`}
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
                          pressableProps.hovered || pressableProps.focused
                            ? 1
                            : 0
                        }
                      >
                        <IconButton
                          size="small"
                          icon={Icons.ThreeDotsVertical}
                          onPress={() => {
                            tooltipProps.onPress();
                          }}
                          isFocused={tooltipProps.focused}
                          onBlur={() => {
                            tooltipProps.onBlur();
                          }}
                          // focusable={false}
                          // focusOn="none"
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
                  onChangeText={(text) =>
                    onChange?.({ ...page, content: text })
                  }
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
      </PaperlessPageContainer>
    );
  }
);

export default PaperlessPage;
