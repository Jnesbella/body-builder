import * as React from "react";
import {
  Layout,
  Text,
  Space,
  Effect,
  FadeInElement,
  theme,
  Divider,
  Menu,
  Icon,
} from "@jnesbella/body-builder";
import { get } from "lodash";
import { Animated } from "react-native";
import styled from "styled-components/native";
import * as Icons from "react-bootstrap-icons";

import { useAppActions, useAppState, useListChannels } from "../../hooks";
import { Channel } from "../../types";

const NavMenuWrapper = styled(Animated.View)<{
  isVisible?: boolean;
  width?: number;
}>`
  z-index: ${theme.zIndex.aboveAll};
  left: ${(props) => (props.isVisible ? 0 : -(props.width || 0))}px;
  transition: left 0.2s;
`;

export interface NavigationMenuProps {
  isVisible?: boolean;
  isPinnedOpen?: boolean;
  width?: number;
}

function NavigationMenu({
  isVisible,
  isPinnedOpen,
  width = 0,
}: NavigationMenuProps) {
  const ref = React.useRef<FadeInElement>(null);

  const { data: channels } = useListChannels();

  const search = useAppState((state) => state.search);

  const setSearch = useAppActions((actions) => actions.setSearch);

  React.useEffect(
    function handleVisiblityChange() {
      if (isVisible || isPinnedOpen) {
        ref.current?.fadeIn();
      } else {
        ref.current?.fadeOut();
      }
    },
    [isVisible, isPinnedOpen]
  );

  const isSelectedChannel = (channel: Channel) => {
    return "id" in search && get(search, "id") === channel.id;
  };

  return (
    <Layout.Column greedy>
      <Effect.FadeIn ref={ref} duration={200} greedy={isPinnedOpen}>
        <NavMenuWrapper
          isVisible={isVisible || isPinnedOpen}
          width={width}
          style={{ flex: 1, position: !isPinnedOpen ? "absolute" : "relative" }}
        >
          <Menu
            elevation={isPinnedOpen ? 0 : 1}
            style={{ width }}
            spacingSize={[0, 1]}
            greedy={isPinnedOpen}
          >
            <Layout.Box spacingSize={[1, 0]}>
              <Text.Title>Channels</Text.Title>
            </Layout.Box>

            {channels?.map((channel) => (
              <Menu.Item
                fullWidth
                key={channel.id}
                selected={isSelectedChannel(channel)}
                onPress={() => setSearch(channel)}
              >
                <Layout.Row alignItems="center">
                  <Icon icon={Icons.Hash} />

                  <Space spacingSize={0.5} />

                  <Menu.Text>{channel.name}</Menu.Text>
                </Layout.Row>
              </Menu.Item>
            ))}

            {/* <Layout.Box greedy={isPinnedOpen} /> */}

            {/* <Layout.Box spacingSize={[0, 1]}>
              <Divider />
            </Layout.Box>

            <Menu.Item fullWidth>
              <Layout.Row alignItems="center">
                <Icon icon={Icons.Plus} />

                <Space spacingSize={0.5} />

                <Menu.Text>New channel</Menu.Text>
              </Layout.Row>
            </Menu.Item> */}
          </Menu>
        </NavMenuWrapper>
      </Effect.FadeIn>
    </Layout.Column>
  );
}

export default NavigationMenu;
