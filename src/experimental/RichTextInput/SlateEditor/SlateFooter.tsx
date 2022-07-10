import * as React from "react";
import styled from "styled-components/native";
import * as Icons from "react-bootstrap-icons";

import { Divider, Layout, Text } from "../../../components";
import { useSlate } from "slate-react";
import { Editor } from "./slate";

// const Container = styled.div`
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   justify-content: flex-start;
// `;

const FooterItem = styled(Layout.Box).attrs({
  spacingSize: [1, 0],
})``;

const FooterText = styled(Text.Caption).attrs({})``;

export interface SlateFooterProps {
  disabled?: boolean;
}

function SlateFooter({}: SlateFooterProps) {
  const editor = useSlate();
  const characterCount = Editor.getTextLength(editor);
  const wordsCount = 0;

  return (
    <Layout.Row>
      <FooterItem>
        <FooterText>Page 1 of 10</FooterText>
      </FooterItem>

      <FooterItem>
        <FooterText>{wordsCount} words</FooterText>
      </FooterItem>

      <FooterItem>
        <FooterText>{characterCount} characters</FooterText>
      </FooterItem>
    </Layout.Row>
  );
}

export default SlateFooter;
