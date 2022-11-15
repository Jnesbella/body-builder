import * as React from "react";

function useOnValueChange<TValue>(value: TValue, onChange: () => void) {
  const valueCache = React.useRef(value);

  const valueChanged = value !== valueCache.current;

  React.useEffect(
    function cacheValue() {
      valueCache.current = value;
    },
    [value]
  );

  React.useEffect(
    function setDefaultTagIds() {
      if (valueChanged) {
        onChange();
      }
    },
    [onChange, valueChanged]
  );
}

export default useOnValueChange;
