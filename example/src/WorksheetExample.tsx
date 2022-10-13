import * as React from "react";
import {
  Layout,
  Workbook,
  Worksheet,
  WorksheetScrollView,
  WorksheetColumn,
  WorksheetRow,
  WorksheetCell,
  Info,
} from "@jnesbella/body-builder";

function WorksheetExample() {
  return (
    <Info greedy>
      <Workbook name="workbook 1">
        <WorksheetScrollView>
          <Layout.Box spacingSize={[0, 1]}>
            <Worksheet
              name="sheet 1"
              columns={
                <React.Fragment>
                  <WorksheetColumn
                    column="description"
                    renderCell={WorksheetCell.TextInput}
                  />
                  <WorksheetColumn
                    column="effectiveness"
                    renderCell={WorksheetCell.TextInput}
                  />
                  <WorksheetColumn
                    column="result"
                    renderCell={WorksheetCell.TextInput}
                  />
                </React.Fragment>
              }
            >
              <WorksheetRow row="banana" />
            </Worksheet>
          </Layout.Box>
        </WorksheetScrollView>
      </Workbook>
    </Info>
  );
}

export default WorksheetExample;
