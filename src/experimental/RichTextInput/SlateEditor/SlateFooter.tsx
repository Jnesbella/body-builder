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

function countWords(s: string) {
  s = s.replace(/(^\s*)|(\s*$)/gi, ""); //exclude  start and end white-space
  s = s.replace(/[ ]{2,}/gi, " "); //2 or more space to 1
  s = s.replace(/\n /, "\n"); // exclude newline with a start spacing
  return s.split(" ").filter(function (str: string) {
    return str != "";
  }).length;
  //return s.split(' ').filter(String).length; - this can also be used
}

function WordCountItem() {
  const editor = useSlate();
  const wordsCount = countWords(Editor.getText(editor));

  return (
    <FooterItem>
      <FooterText>{wordsCount} words</FooterText>
    </FooterItem>
  );
}

function CharacterCountItem() {
  const editor = useSlate();
  const characterCount = Editor.getTextLength(editor);

  return (
    <FooterItem>
      <FooterText>{characterCount} characters</FooterText>
    </FooterItem>
  );
}

export interface PageNumberItemProps {
  pageNum: number;
  pageCount: number;
}

function PageNumberItem({ pageNum, pageCount }: PageNumberItemProps) {
  return (
    <Layout.Row>
      <FooterItem>
        <FooterText>
          Page {pageNum} of {pageCount}
        </FooterText>
      </FooterItem>
    </Layout.Row>
  );
}

export interface SlateFooterProps {
  disabled?: boolean;
  children?: React.ReactNode;
}

function SlateFooter({ children }: SlateFooterProps) {
  return <Layout.Row>{children}</Layout.Row>;
}

SlateFooter.Text = FooterText;
SlateFooter.Item = FooterItem;
SlateFooter.WordCountItem = WordCountItem;
SlateFooter.CharacterCountItem = CharacterCountItem;
SlateFooter.PageNumberItem = PageNumberItem;

export default SlateFooter;
