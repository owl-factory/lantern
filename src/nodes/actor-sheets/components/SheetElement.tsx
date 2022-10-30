import React from "react";
import {
  ButtonDescriptor,
  CheckboxDescriptor,
  CollapseDescriptor,
  ColumnDescriptor,
  ErrorDescriptor,
  InlineDescriptor,
  LabelDescriptor,
  LoopDescriptor,
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
import { SheetElementType } from "../enums/sheetElementType";
import { SheetElementProps } from "../types";
import {
  SheetBox,
  SheetButton,
  SheetCheckbox,
  SheetColumn,
  SheetError,
  SheetInline,
  SheetLabel,
  SheetLoop,
  SheetNumberInput,
  SheetOption,
  SheetPage,
  SheetPageable,
  SheetPrefab,
  SheetRadioButton,
  SheetRow,
  SheetSelect,
  SheetTable,
  SheetTableCell,
  SheetTableRow,
  SheetTabs,
  SheetTextArea,
  SheetTextInput,
} from "./elements";
import { SheetCollapse } from "./elements/utility/Collapse";
import { BoxDescriptor } from "../types/elements/layout/box";
import { SheetAllFields, SheetProfile, SheetToken } from "./elements/required";
import { AllFieldsDescriptor, ProfileEditorDescriptor, TokenEditorDescriptor } from "../types/elements/required";

/**
 * Determines which sheet element to render based on the descriptor element type given
 * @param element The element descriptor
 * @returns The JSX for the appropriate sheet element
 */
export function SheetElement(props: SheetElementProps<GenericSheetElementDescriptor>) {
  try {
    switch (props.element?.element) {
      // Inputs
      case SheetElementType.Checkbox:
        return <SheetCheckbox {...props} element={props.element as CheckboxDescriptor}/>;
      case SheetElementType.NumberInput:
        return <SheetNumberInput {...props} element={props.element as NumberInputDescriptor}/>;
      case SheetElementType.TextInput:
        return <SheetTextInput {...props} element={props.element as TextInputDescriptor}/>;
      case SheetElementType.Option:
        return <SheetOption {...props} element={props.element as OptionDescriptor}/>;
      case SheetElementType.Radio:
        return <SheetRadioButton {...props} element={props.element as RadioButtonDescriptor}/>;
      case SheetElementType.Select:
        return <SheetSelect {...props} element={props.element as SelectDescriptor}/>;
      case SheetElementType.TextArea:
        return <SheetTextArea {...props} element={props.element as TextAreaDescriptor}/>;

      // Layout
      case SheetElementType.Box:
        return <SheetBox {...props} element={props.element as BoxDescriptor}/>;
      case SheetElementType.Column:
        return <SheetColumn {...props} element={props.element as ColumnDescriptor}/>;
      case SheetElementType.Inline:
        return <SheetInline {...props} element={props.element as InlineDescriptor}/>;
      case SheetElementType.Label:
        return <SheetLabel {...props} element={props.element as LabelDescriptor}/>;
      case SheetElementType.Row:
        return <SheetRow {...props} element={props.element as RowDescriptor}/>;
      case SheetElementType.Table:
        return <SheetTable {...props} element={props.element as TableDescriptor}/>;
      case SheetElementType.TableCell:
        return <SheetTableCell {...props} element={props.element as TableCellDescriptor}/>;
      case SheetElementType.TableRow:
        return <SheetTableRow {...props} element={props.element as TableRowDescriptor}/>;

      // Required
      case SheetElementType.AllFields:
        return <SheetAllFields {...props} element={props.element as AllFieldsDescriptor}/>;
      case SheetElementType.ProfileEditor:
        return <SheetProfile {...props} element={props.element as ProfileEditorDescriptor}/>;
      case SheetElementType.TokenEditor:
        return <SheetToken {...props} element={props.element as TokenEditorDescriptor}/>;

      // Utilities
      case SheetElementType.Button:
        return <SheetButton {...props} element={props.element as ButtonDescriptor}/>;
      case SheetElementType.Collapse:
        return <SheetCollapse {...props} element={props.element as CollapseDescriptor}/>;
      case SheetElementType.Loop:
        return <SheetLoop {...props} element={props.element as LoopDescriptor}/>;
      case SheetElementType.Pageable:
        return <SheetPageable {...props} element={props.element as PageableDescriptor}/>;
        case SheetElementType.Prefab:
          return <SheetPrefab {...props} element={props.element as PrefabDescriptor}/>;
      case SheetElementType.Tabs:
        return <SheetTabs {...props} element={props.element as TabsDescriptor}/>;
      case SheetElementType.Page:
        return <SheetPage {...props} element={props.element as PageDescriptor}/>;

      // Other
      case SheetElementType.Error:
        return <SheetError {...props} element={props.element as ErrorDescriptor}/>;
    }
  } catch (e) {
    return <SheetError {...props} element={props.element as ErrorDescriptor}/>;
  }
  return <>:(</>;
}
