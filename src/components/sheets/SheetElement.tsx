import React from "react";
import { PageElementType } from "types/enums/pageElementType";
import {
  SheetBackground,
  SheetBorder,
  SheetColumn,
  SheetInline,
  SheetLabel,
  SheetNumberInput,
  SheetRow,
  SheetSelect,
  SheetTextArea,
  SheetTextInput,
} from "./elements";
import { SheetCheckbox } from "./elements/Checkbox";
import { SheetPage } from "./elements/Page";
import { SheetPageable } from "./elements/Pageable";
import { SheetPrefab } from "./elements/Prefab";
import { SheetRadio } from "./elements/Radio";
import { SheetRadioButton } from "./elements/RadioButton";

export function SheetElement(props: any) {
  switch (props.element?.element) {
    case PageElementType.Pageable:
      return <SheetPageable element={props.element}/>;
    case PageElementType.Page:
      return <SheetPage element={props.element}/>;
    case PageElementType.Row:
      return <SheetRow element={props.element}/>;
    case PageElementType.Column:
      return <SheetColumn element={props.element}/>;
    case PageElementType.Background:
      return <SheetBackground element={props.element}/>;
    case PageElementType.Border:
      return <SheetBorder element={props.element}/>;
    case PageElementType.Inline:
      return <SheetInline element={props.element}/>;
    case PageElementType.Label:
      return <SheetLabel element={props.element}/>;
    case PageElementType.Checkbox:
      return <SheetCheckbox element={props.element}/>;
    case PageElementType.Radio:
      return <SheetRadio element={props.element}/>;
    case PageElementType.RadioButton:
     return <SheetRadioButton element={props.element}/>;
    case PageElementType.NumberInput:
      return <SheetNumberInput element={props.element}/>;
    case PageElementType.TextInput:
      return <SheetTextInput element={props.element}/>;
    case PageElementType.TextArea:
      return <SheetTextArea element={props.element}/>;
    case PageElementType.Select:
      return <SheetSelect element={props.element}/>;

    case PageElementType.Prefab:
      return <SheetPrefab element={props.element}/>;
  }
  return <></>;
}
