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
  log,
  ButtonElement,
  useSetRef,
  RichTextInputElement,
} from "@jnesbella/body-builder";
import * as Icons from "react-bootstrap-icons";
import styled from "styled-components/native";
import { isNumber } from "lodash";
import { LayoutChangeEvent, LayoutRectangle } from "react-native";
import { PaperlessPage as Page } from "./paperlessTypes";
import { ReactEditor } from "slate-react";

const PaperlessPageContainer = styled(Layout.Box)`
  overflow: hidden;
`;

export interface PaperlessPageElement extends RichTextInputElement {}

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
  onBlur?: () => void;
}

const PaperlessPage = React.forwardRef<
  PaperlessPageElement,
  PaperlessPageProps
>(({ page, onFocus, onChange, onBlur }, ref) => {
  const [isTitleFocused, setIsTitleFocused] = React.useState(false);

  const [isContentFocused, setIsContentFocused] = React.useState(false);

  const tooltipRef = React.useRef<TooltipElement>(null);

  const [layout, setLayout] = React.useState<LayoutRectangle>();

  // React.useEffect(function handleRef() {
  //   setRef(ref, element);
  // });

  const threeDotsMenuButtonRef = React.useRef<ButtonElement>(null);

  return (
    // <PaperlessPageContainer
    // // onLayout={(event) => setLayout(event.nativeEvent.layout)}
    // >
    <Pressable
      isFocused={isTitleFocused || isContentFocused}
      // id={`Page_${pageNum}`}
      onBlur={() => {
        tooltipRef.current?.hide();
      }}
      // onFocus={() => {
      //   onFocus?.();
      // }}
      // focusOnPress
      // focusable={false}
      // focusOn="none"
    >
      {(pressableProps) => (
        <Layout.Column>
          <Surface spacingSize={1}>
            <Layout.Row alignItems="center">
              <Layout.Box greedy>
                <TextInput
                  value={page.title}
                  onChangeText={(text) => onChange?.({ ...page, title: text })}
                  fullWidth
                  placeholder={
                    pressableProps.hovered || pressableProps.focused
                      ? "Untitled"
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
                onHide={() => {
                  threeDotsMenuButtonRef.current?.blur();
                }}
                placement="left"
                content={(tooltipProps) => (
                  <Menu elevation={1}>
                    {/* <Menu.Item
                        onPress={() => {
                          tooltipProps.hide();
                        }}
                      >
                        <Layout.Row alignItems="center">
                          <Icon icon={Icons.Printer} size={Icon.size.small} />

                          <Space />

                          <Menu.Text>Print</Menu.Text>
                        </Layout.Row>
                      </Menu.Item> */}

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
                  <Layout.Box
                    opacity={
                      pressableProps.hovered || pressableProps.focused ? 1 : 0
                    }
                  >
                    <IconButton
                      ref={threeDotsMenuButtonRef}
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
              ref={ref}
              name={`page-${page.id}`}
              value={page.content}
              placeholder={
                pressableProps.hovered || pressableProps.focused
                  ? "Write here"
                  : ""
              }
              onFocus={() => {
                setIsContentFocused(true);
                tooltipRef.current?.hide();
                onFocus?.();
              }}
              onBlur={() => {
                setIsContentFocused(false);
                onBlur?.();
              }}
              onChange={(content) => onChange?.({ ...page, content })}
            />
          </Surface>
        </Layout.Column>
      )}
    </Pressable>
    // </PaperlessPageContainer>
  );
});

export default PaperlessPage;
