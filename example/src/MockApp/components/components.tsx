import * as React from "react";
import {
  Layout,
  Text,
  Surface,
  Space,
  Measure,
  theme,
  LayoutBoxProps,
  Divider,
  Icon,
  TextInput,
} from "@jnesbella/body-builder";
import { get } from "lodash";
import * as Icons from "react-bootstrap-icons";
import { useAppState } from "../hooks";

export interface BoxWithPaddingProps {
  maxWidth?: number;
  children?: React.ReactNode;
}

export const BoxWithPadding = ({ maxWidth, children }: BoxWithPaddingProps) => {
  return (
    <Layout.Box greedy style={{ maxWidth }}>
      <Surface greedy>{children}</Surface>
    </Layout.Box>
  );
};

export function MeasureDemo() {
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

export interface LabledBoxProps extends LayoutBoxProps {
  label: string;
}

export function LabledBox({ label, greedy = true, ...rest }: LabledBoxProps) {
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

export function SearchBar() {
  return (
    <Surface fullWidth spacingSize={[2, 1]}>
      <TextInput
        greedy
        placeholder="Search Notes"
        start={
          <Layout.Box spacingSize={[1, 0]}>
            <Icon icon={Icons.Search} color={theme.colors.textPlaceholder} />
          </Layout.Box>
        }
      />
    </Surface>
  );
}

export function ChannelName() {
  const search = useAppState((state) => state.search);

  return (
    <Layout.Column>
      <Surface>
        <Surface background={theme.colors.accent}>
          <Layout.Row alignItems="center" spacingSize={1}>
            <Icon icon={Icons.Hash} />

            <Space />

            <Text.SubHeader>{get(search, "name", "all")}</Text.SubHeader>
          </Layout.Row>
        </Surface>
      </Surface>

      <Divider />
    </Layout.Column>
  );
}
