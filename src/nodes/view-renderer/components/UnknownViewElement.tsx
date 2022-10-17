import React from "react";
import { ElementType } from "../enums/elementType";
import { SheetElementProps } from "../types";
import { GenericElementDescriptor } from "../types/elements";
// import {
//   SheetBox,
//   SheetButton,
//   SheetCheckbox,
//   SheetColumn,
//   SheetError,
//   SheetInline,
//   SheetLabel,
//   SheetLoop,
//   SheetNumberInput,
//   SheetOption,
//   SheetPage,
//   SheetPageable,
//   SheetPrefab,
//   SheetRadioButton,
//   SheetRow,
//   SheetSelect,
//   SheetTable,
//   SheetTableCell,
//   SheetTableRow,
//   SheetTabs,
//   SheetTextArea,
//   SheetTextInput,
// } from "./elements";


/**
 * Determines which sheet element to render based on the descriptor element type given
 * @param element The element descriptor
 * @returns The JSX for the appropriate sheet element
 */
export function SheetElement(props: SheetElementProps<GenericElementDescriptor>) {
  // try {
  //   switch (props.element?.element) {
  //     // Inputs
  //     case ElementType.Checkbox:
  //       return <SheetCheckbox {...props} element={props.element as CheckboxDescriptor}/>;
  //     case ElementType.NumberInput:
  //       return <SheetNumberInput {...props} element={props.element as NumberInputDescriptor}/>;
  //     case ElementType.TextInput:
  //       return <SheetTextInput {...props} element={props.element as TextInputDescriptor}/>;
  //     case ElementType.Option:
  //       return <SheetOption {...props} element={props.element as OptionDescriptor}/>;
  //     case ElementType.Radio:
  //       return <SheetRadioButton {...props} element={props.element as RadioButtonDescriptor}/>;
  //     case ElementType.Select:
  //       return <SheetSelect {...props} element={props.element as SelectDescriptor}/>;
  //     case ElementType.TextArea:
  //       return <SheetTextArea {...props} element={props.element as TextAreaDescriptor}/>;

  //     // Layout
  //     case ElementType.Box:
  //       return <SheetBox {...props} element={props.element as BoxDescriptor}/>;
  //     case ElementType.Column:
  //       return <SheetColumn {...props} element={props.element as ColumnDescriptor}/>;
  //     case ElementType.Inline:
  //       return <SheetInline {...props} element={props.element as InlineDescriptor}/>;
  //     case ElementType.Label:
  //       return <SheetLabel {...props} element={props.element as LabelDescriptor}/>;
  //     case ElementType.Row:
  //       return <SheetRow {...props} element={props.element as RowDescriptor}/>;
  //     case ElementType.Table:
  //       return <SheetTable {...props} element={props.element as TableDescriptor}/>;
  //     case ElementType.TableCell:
  //       return <SheetTableCell {...props} element={props.element as TableCellDescriptor}/>;
  //     case ElementType.TableRow:
  //       return <SheetTableRow {...props} element={props.element as TableRowDescriptor}/>;

  //     // Required
  //     case ElementType.AllFields:
  //       return <SheetAllFields {...props} element={props.element as AllFieldsDescriptor}/>;
  //     case ElementType.ProfileEditor:
  //       return <SheetProfile {...props} element={props.element as ProfileEditorDescriptor}/>;
  //     case ElementType.TokenEditor:
  //       return <SheetToken {...props} element={props.element as TokenEditorDescriptor}/>;

  //     // Utilities
  //     case ElementType.Button:
  //       return <SheetButton {...props} element={props.element as ButtonDescriptor}/>;
  //     case ElementType.Collapse:
  //       return <SheetCollapse {...props} element={props.element as CollapseDescriptor}/>;
  //     case ElementType.Loop:
  //       return <SheetLoop {...props} element={props.element as LoopDescriptor}/>;
  //     case ElementType.Pageable:
  //       return <SheetPageable {...props} element={props.element as PageableDescriptor}/>;
  //       case ElementType.Prefab:
  //         return <SheetPrefab {...props} element={props.element as PrefabDescriptor}/>;
  //     case ElementType.Tabs:
  //       return <SheetTabs {...props} element={props.element as TabsDescriptor}/>;
  //     case ElementType.Page:
  //       return <SheetPage {...props} element={props.element as PageDescriptor}/>;

  //     // Other
  //     case ElementType.Error:
  //       return <SheetError {...props} element={props.element as ErrorDescriptor}/>;
  //   }
  // } catch (e) {
  //   return <SheetError {...props} element={props.element as ErrorDescriptor}/>;
  // }
  return <>Unknown Element</>;
}
