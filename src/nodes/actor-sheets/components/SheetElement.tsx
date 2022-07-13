import React from "react";
import {
  BackgroundDescriptor,
  BorderDescriptor,
  CheckboxDescriptor,
  CollapseDescriptor,
  ColumnDescriptor,
  InlineDescriptor,
  LabelDescriptor,
  NumberInputDescriptor,
  OptionDescriptor,
  PageDescriptor,
  PageableDescriptor,
  PrefabDescriptor,
  RadioButtonDescriptor,
  RowDescriptor,
  SelectDescriptor,
  TableCellDescriptor,
  TableDescriptor,
  TableRowDescriptor,
  TabsDescriptor,
  TextAreaDescriptor,
  TextInputDescriptor,
} from "nodes/actor-sheets/types/elements";
import { GenericSheetElementDescriptor } from "nodes/actor-sheets/types/elements/generic";
import {
  SheetBackground,
  SheetBorder,
  SheetCollapse,
  SheetColumn,
  SheetInline,
  SheetLabel,
  SheetNumberInput,
  SheetOption,
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
import { SheetElementProps } from "../types";
import { SheetLoop } from "./elements/Loop";
import { ButtonDescriptor } from "../types/elements/button";
import { SheetButton } from "./elements/Button";
import { SheetElementType } from "../enums/sheetElementType";
import { LoopDescriptor } from "../types/elements/loop";
import { SheetTable } from "./elements/Table";
import { SheetTableCell } from "./elements/TableCell";
import { SheetTableRow } from "./elements/TableRow";
import { SheetTabs } from "./elements/Tabs";

/**
 * Determines which sheet element to render based on the descriptor element type given
 * @param element The element descriptor
 * @returns The JSX for the appropriate sheet element
 */
export function SheetElement(props: SheetElementProps<GenericSheetElementDescriptor>) {
  switch (props.element?.element) {
    case SheetElementType.Pageable:
      return <SheetPageable {...props} element={props.element as PageableDescriptor}/>;
    case SheetElementType.Tabs:
      return <SheetTabs {...props} element={props.element as TabsDescriptor}/>;
    case SheetElementType.Page:
      return <SheetPage {...props} element={props.element as PageDescriptor}/>;
    case SheetElementType.Row:
      return <SheetRow {...props} element={props.element as RowDescriptor}/>;
    case SheetElementType.Column:
      return <SheetColumn {...props} element={props.element as ColumnDescriptor}/>;
    case SheetElementType.Background:
      return <SheetBackground {...props} element={props.element as BackgroundDescriptor}/>;
    case SheetElementType.Border:
      return <SheetBorder {...props} element={props.element as BorderDescriptor}/>;
    case SheetElementType.Inline:
      return <SheetInline {...props} element={props.element as InlineDescriptor}/>;
    case SheetElementType.Label:
      return <SheetLabel {...props} element={props.element as LabelDescriptor}/>;
    case SheetElementType.Button:
      return <SheetButton {...props} element={props.element as ButtonDescriptor}/>;
    case SheetElementType.Checkbox:
      return <SheetCheckbox {...props} element={props.element as CheckboxDescriptor}/>;
    case SheetElementType.Radio:
     return <SheetRadioButton {...props} element={props.element as RadioButtonDescriptor}/>;
    case SheetElementType.NumberInput:
      return <SheetNumberInput {...props} element={props.element as NumberInputDescriptor}/>;
    case SheetElementType.Table:
      return <SheetTable {...props} element={props.element as TableDescriptor}/>;
    case SheetElementType.TableCell:
      return <SheetTableCell {...props} element={props.element as TableCellDescriptor}/>;
    case SheetElementType.TableRow:
      return <SheetTableRow {...props} element={props.element as TableRowDescriptor}/>;
    case SheetElementType.Collapse:
      return <SheetCollapse {...props} element={props.element as CollapseDescriptor}/>;
    case SheetElementType.TextInput:
      return <SheetTextInput {...props} element={props.element as TextInputDescriptor}/>;
    case SheetElementType.TextArea:
      return <SheetTextArea {...props} element={props.element as TextAreaDescriptor}/>;
    case SheetElementType.Select:
      return <SheetSelect {...props} element={props.element as SelectDescriptor}/>;
    case SheetElementType.Option:
      return <SheetOption {...props} element={props.element as OptionDescriptor}/>;

    case SheetElementType.Loop:
      return <SheetLoop {...props} element={props.element as LoopDescriptor}/>;

    case SheetElementType.Prefab:
      return <SheetPrefab {...props} element={props.element as PrefabDescriptor}/>;
  }
  return <></>;
}
