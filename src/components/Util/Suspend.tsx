import * as React from "react";
import { useQuery } from "react-query";

export interface SuspendProps {
  timeout?: number;
  reject?: boolean;
}

function Suspend({ timeout, reject }: SuspendProps) {
  const [promise] = React.useState(
    new Promise((res, rej) => {
      window.setTimeout(() => {
        if (reject) {
          rej(new Error("Suspend rejected"));
        } else {
          res(true);
        }
      }, timeout);
    })
  );

  const queryFn = () => promise;

  const {} = useQuery("test", queryFn, { suspense: true });

  return null;
}

export default Suspend;
