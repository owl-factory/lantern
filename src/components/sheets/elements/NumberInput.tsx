import { useField } from "formik";
import React from "react";
import { NumberInputElement } from "types/layouts/numberInputElement";
import style from "../styling/Input.module.scss";

interface SheetNumberInputProps {
  element: NumberInputElement;
}

export function SheetNumberInput(props: SheetNumberInputProps) {
  // Makes Formik work right
  const [ field ] = useField(props.element);
  return (
    <div>
      <input
        type="number"
        className={`${style.actorSheetInput}`}
        {...field}
      />
    </div>
  );
}
