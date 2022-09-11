import * as React from "react";
import { Flubber, FlubberGripProps } from "../../components";
import { SizeProp } from "../../types";
// import { Flubber, FlubberGripProps, SizeProp } from '@jnesbella/body-builder'

export const SPREADSHEET_GRIP_SIZE: SizeProp = "xsmall";

export interface SpreadsheetGripProps {
  pushAndPull: [string, string];
  children?: React.ReactNode;
  orientation?: FlubberGripProps["orientation"];
  greedy?: FlubberGripProps["greedy"];
  size?: FlubberGripProps["size"];
}

function SpreadsheetGrip({
  pushAndPull,
  orientation,
  greedy,
  size = SPREADSHEET_GRIP_SIZE,
}: SpreadsheetGripProps) {
  const [_push, _pull] = pushAndPull;
  const push = React.useMemo(() => ({ name: _push }), [_push]);
  const pull = React.useMemo(() => ({ name: _pull }), [_pull]);

  return (
    <Flubber.Grip
      pushAndPull={[push, pull]}
      size={size}
      orientation={orientation}
      greedy={greedy}
    />
  );
}

export default SpreadsheetGrip;
