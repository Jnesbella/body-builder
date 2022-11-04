import * as React from "react";
import { useQuery } from "react-query";

function Suspend() {
  const [promise] = React.useState(
    new Promise(() => {
      // TODO
    })
  );

  const doFetch = () => promise;

  const {} = useQuery("test", doFetch, { suspense: true });

  return null;
}

export default Suspend;
