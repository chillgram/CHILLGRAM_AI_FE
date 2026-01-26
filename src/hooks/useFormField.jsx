import { useState, useCallback } from "react";

export function useFormField(initialValue = "") {
  const [value, setValue] = useState(initialValue);
  const [touched, setTouched] = useState(false);

  const onChange = useCallback((v) => {
    setValue(v);
    setTouched(true);
  }, []);

  return {
    value,
    setValue,
    touched,
    setTouched,
    onChange,
  };
}
