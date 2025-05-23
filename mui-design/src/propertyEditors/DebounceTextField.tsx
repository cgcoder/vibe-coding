import React, { useEffect, useRef, useState } from "react";
import { TextField, type TextFieldProps } from "@mui/material";

interface DebouncedTextFieldProps extends Omit<TextFieldProps, "onChange" | "value"> {
  value: string;
  onChange: (value: string) => void;
  debounceDuration?: number;
}

export const DebouncedTextField: React.FC<DebouncedTextFieldProps> = ({
  value,
  onChange,
  debounceDuration = 300,
  ...rest
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const timeoutRef = useRef<number | undefined>(0);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    if (timeoutRef.current !== undefined) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      if (internalValue !== value) {
        onChange(internalValue);
      }
    }, debounceDuration);

    return () => {
      if (timeoutRef.current !== undefined) {
        clearTimeout(timeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internalValue, debounceDuration]);

  return (
    <TextField
      {...rest}
      value={internalValue}
      onChange={(e) => setInternalValue(e.target.value)}
    />
  );
};