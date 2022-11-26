import * as React from "react";
import {
  Layout,
  Pressable,
  Surface,
  IconButton,
  theme,
  Space,
} from "@jnesbella/body-builder";
import styled from "styled-components/native";
import * as Icons from "react-bootstrap-icons";

import NavigationMenu from "./NavigationMenu";
import { useAppActions, useListChannels } from "../../hooks";

import Channel from "../channels";
import { getChannelIcon } from "../channels/channels-utils";

const OPEN_WIDTH = 300;

const NavBarContainer = styled(Surface)`
  z-index: ${theme.zIndex.aboveAll};
`;

export interface NavigationProps {
  children?: React.ReactNode;
}

function Navigation({}: NavigationProps) {
  const [isPinnedOpen, setIsPinnedOpen] = React.useState(false);

  const { data: channels } = useListChannels();

  const allChannel = channels?.find((channel) => channel.id === "all");

  const setSearch = useAppActions((actions) => actions.setSearch);

  return (
    <NavBarContainer>
      <Pressable greedy>
        {(pressableProps) => (
          <Layout.Column
            style={{ width: isPinnedOpen ? OPEN_WIDTH : undefined }}
            greedy
          >
            <Layout.Column spacingSize={1}>
              <IconButton
                icon={Icons.List}
                onPress={() => setIsPinnedOpen(!isPinnedOpen)}
                focusOn="none"
                focusable={false}
              />

              {allChannel && (
                <React.Fragment>
                  <Space />

                  <IconButton
                    icon={getChannelIcon(allChannel)}
                    onPress={() => setSearch(allChannel)}
                    focusOn="none"
                    focusable={false}
                  />
                </React.Fragment>
              )}
            </Layout.Column>

            <NavigationMenu
              isVisible={pressableProps.hovered}
              isPinnedOpen={isPinnedOpen}
              width={OPEN_WIDTH}
            />
          </Layout.Column>
        )}
      </Pressable>
    </NavBarContainer>
  );
}

export default Navigation;
