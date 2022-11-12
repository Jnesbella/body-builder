import * as React from "react";
import {
  Layout,
  Pressable,
  Surface,
  IconButton,
  theme,
} from "@jnesbella/body-builder";
import styled from "styled-components/native";
import * as Icons from "react-bootstrap-icons";

import NavigationMenu from "./NavigationMenu";

const NavBarContainer = styled(Surface)`
  z-index: ${theme.zIndex.aboveAll};
`;

export interface NavigationProps {
  children?: React.ReactNode;
}

function Navigation({}: NavigationProps) {
  const [isPinnedOpen, setIsPinnedOpen] = React.useState(false);
  const width = 300;

  return (
    <NavBarContainer>
      <Pressable greedy>
        {(pressableProps) => (
          <Layout.Column
            style={{ width: isPinnedOpen ? width : undefined }}
            greedy
          >
            <Layout.Row spacingSize={1}>
              <IconButton
                icon={Icons.List}
                focusOn="none"
                focusable={false}
                onPress={() => setIsPinnedOpen(!isPinnedOpen)}
              />
            </Layout.Row>

            <NavigationMenu
              isVisible={pressableProps.hovered}
              isPinnedOpen={isPinnedOpen}
              width={width}
            />
          </Layout.Column>
        )}
      </Pressable>
    </NavBarContainer>
  );
}

export default Navigation;
