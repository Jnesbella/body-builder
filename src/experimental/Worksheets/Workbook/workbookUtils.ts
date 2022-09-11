import * as React from "react";

import { Worksheet, Workbook } from "../worksheetsTypes";

import {
  WorkbookNode,
  WorkbookNodeTitle,
  WorkbookNodeDefault,
  WorkbookNodeGrip,
  WorkbookNodeSpace,
} from "./workbookTypes";

export function getWorkbookLayout(workbook: Workbook) {
  const { sheets } = workbook;
  const sheetsById: Record<Worksheet["name"], Worksheet> = {};

  const nodes: WorkbookNode[] = [];
  const stickyHeaderIndices: number[] = [];

  const pushTitleNode = (sheet: Worksheet) => {
    const titleNode: WorkbookNodeTitle = {
      type: "title",
      sheet: sheet.name,
    };
    nodes.push(titleNode);

    stickyHeaderIndices.push(nodes.length);
  };

  const pushSpaceNode = () => {
    const spaceNode: WorkbookNodeSpace = {
      type: "space",
    };
    nodes.push(spaceNode);
  };

  const pushGripNode = (sheet: Worksheet, rowIndex: number) => {
    const gripNode: WorkbookNodeGrip = {
      type: "grip",
      sheet: sheet.name,
      rowIndex,
    };
    nodes.push(gripNode);
  };

  const pushDefaultNode = (sheet: Worksheet, rowIndex: number) => {
    const defaultNode: WorkbookNodeDefault = {
      type: "default",
      sheet: sheet.name,
      rowIndex,
    };
    nodes.push(defaultNode);
  };

  const mapSheet = (sheet: Worksheet) => {
    sheetsById[sheet.name] = sheet;
  };

  sheets.forEach((sheet) => {
    mapSheet(sheet);

    // pushTitleNode(sheet)
    pushSpaceNode();

    sheet.rows.forEach((_row, rowIndex) => {
      if (rowIndex > 0) {
        pushGripNode(sheet, rowIndex);
      }

      pushDefaultNode(sheet, rowIndex);
    });

    pushSpaceNode();
  });

  const getSheet = (node: WorkbookNode) => {
    let sheet: Worksheet | null = null;

    if ("sheet" in node) {
      sheet = sheetsById[node.sheet];
    }

    return sheet;
  };

  return { nodes, stickyHeaderIndices, getSheet };
}
