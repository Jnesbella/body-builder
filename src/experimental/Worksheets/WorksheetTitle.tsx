import * as React from "react";
import { startCase } from "lodash";

import { Layout, Text } from "../../components";

import { useWorksheetState } from "./WorksheetContext";

function WorksheetTitle() {
  const title = useWorksheetState((state) => state.sheet?.name);

  return (
    <Layout.Box spacingSize={[0.5, 0]}>
      <Text.SubHeader>{startCase(title)}</Text.SubHeader>
    </Layout.Box>
  );
}

export default WorksheetTitle;
