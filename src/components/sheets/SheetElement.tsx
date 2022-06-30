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
import { SheetRadioButton } from "./elements/RadioButton";
import { SheetElementProps } from "./types";

/**
 * Determines which sheet element to render based on the descriptor element type given
 * @param element The element descriptor
 * @returns The JSX for the appropriate sheet element
 */
export function SheetElement(props: SheetElementProps<GenericSheetElementDescriptor>) {
  switch (props.element?.element) {
    case PageElementType.Pageable:
      return <SheetPageable {...props} element={props.element as PageableElementDescriptor}/>;
    case PageElementType.Page:
      return <SheetPage {...props} element={props.element as PageElementDescriptor}/>;
    case PageElementType.Row:
      return <SheetRow {...props} element={props.element as RowElementDescriptor}/>;
    case PageElementType.Column:
      return <SheetColumn {...props} element={props.element as ColumnElementDescriptor}/>;
    case PageElementType.Background:
      return <SheetBackground {...props} element={props.element as BackgroundElementDescriptor}/>;
    case PageElementType.Border:
      return <SheetBorder {...props} element={props.element as BorderElementDescriptor}/>;
    case PageElementType.Inline:
      return <SheetInline {...props} element={props.element as InlineElementDescriptor}/>;
    case PageElementType.Label:
      return <SheetLabel {...props} element={props.element as LabelElementDescriptor}/>;
    case PageElementType.Checkbox:
      return <SheetCheckbox {...props} element={props.element as CheckboxElementDescriptor}/>;
    case PageElementType.Radio:
    case PageElementType.RadioButton:
     return <SheetRadioButton {...props} element={props.element as RadioButtonElementDescriptor}/>;
    case PageElementType.NumberInput:
      return <SheetNumberInput {...props} element={props.element as NumberInputElementDescriptor}/>;
    case PageElementType.TextInput:
      return <SheetTextInput {...props} element={props.element as TextInputElementDescriptor}/>;
    case PageElementType.TextArea:
      return <SheetTextArea {...props} element={props.element as TextAreaElementDescriptor}/>;
    case PageElementType.Select:
      return <SheetSelect {...props} element={props.element as SelectElementDescriptor}/>;

    case PageElementType.Prefab:
      return <SheetPrefab {...props} element={props.element as PrefabElementDescriptor}/>;
  }
  return <></>;
}
