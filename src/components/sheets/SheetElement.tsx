import React from "react";
import { PageElementType } from "types/enums/pageElementType";
import {
  BackgroundElementDescriptor,
  BorderElementDescriptor,
  CheckboxElementDescriptor,
  ColumnElementDescriptor,
  InlineElementDescriptor,
  LabelElementDescriptor,
  NumberInputElementDescriptor,
  PageElementDescriptor,
  PageableElementDescriptor,
  PrefabElementDescriptor,
  RadioButtonElementDescriptor,
  RadioElementDescriptor,
  RowElementDescriptor,
  SelectElementDescriptor,
  TextAreaElementDescriptor,
  TextInputElementDescriptor,
} from "types/sheetElementDescriptors";
import { GenericSheetElementDescriptor } from "types/sheetElementDescriptors/generic";
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

interface SheetElementProps {
  element: GenericSheetElementDescriptor
}

/**
 * Determines which sheet element to render based on the descriptor element type given
 * @param element The element descriptor
 * @returns The JSX for the appropriate sheet element
 */
export function SheetElement(props: SheetElementProps) {
  switch (props.element?.element) {
    case PageElementType.Pageable:
      return <SheetPageable element={props.element as PageableElementDescriptor}/>;
    case PageElementType.Page:
      return <SheetPage element={props.element as PageElementDescriptor}/>;
    case PageElementType.Row:
      return <SheetRow element={props.element as RowElementDescriptor}/>;
    case PageElementType.Column:
      return <SheetColumn element={props.element as ColumnElementDescriptor}/>;
    case PageElementType.Background:
      return <SheetBackground element={props.element as BackgroundElementDescriptor}/>;
    case PageElementType.Border:
      return <SheetBorder element={props.element as BorderElementDescriptor}/>;
    case PageElementType.Inline:
      return <SheetInline element={props.element as InlineElementDescriptor}/>;
    case PageElementType.Label:
      return <SheetLabel element={props.element as LabelElementDescriptor}/>;
    case PageElementType.Checkbox:
      return <SheetCheckbox element={props.element as CheckboxElementDescriptor}/>;
    case PageElementType.Radio:
      return <SheetRadio element={props.element as RadioElementDescriptor}/>;
    case PageElementType.RadioButton:
     return <SheetRadioButton element={props.element as RadioButtonElementDescriptor}/>;
    case PageElementType.NumberInput:
      return <SheetNumberInput element={props.element as NumberInputElementDescriptor}/>;
    case PageElementType.TextInput:
      return <SheetTextInput element={props.element as TextInputElementDescriptor}/>;
    case PageElementType.TextArea:
      return <SheetTextArea element={props.element as TextAreaElementDescriptor}/>;
    case PageElementType.Select:
      return <SheetSelect element={props.element as SelectElementDescriptor}/>;

    case PageElementType.Prefab:
      return <SheetPrefab element={props.element as PrefabElementDescriptor}/>;
  }
  return <></>;
}
