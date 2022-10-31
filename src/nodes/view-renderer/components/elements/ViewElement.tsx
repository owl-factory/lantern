import { ElementType } from "nodes/view-renderer/enums/elementType";
import { RenderProps } from "nodes/view-renderer/types/renderProps";
import { ViewCheckbox, ViewInput, ViewOption, ViewRadio, ViewSelect, ViewTextArea } from "./inputs";
import { ViewBox, ViewColumn, ViewInline, ViewLabel, ViewRow, ViewTable, ViewTableCell, ViewTableRow } from "./layout";
import { ViewAllFields, ViewProfileEditor, ViewTokenEditor } from "./required";
import { ViewButton, ViewCollapse, ViewLoop, ViewPageable, ViewPrefab, ViewTabs } from "./utility";
import { ViewError } from "./ViewError";

/**
 * Renders an unknown element for use within a View
 * @param renderID The ID of the render that this View element uses
 * @param element The element descriptor that defines this element
 * @param properties Any current render state
 */
 export function ViewElement(props: RenderProps<any>) {
  try {
    switch (props.element?.type) {
      // Inputs
      case ElementType.Checkbox:
        return <ViewCheckbox {...props}/>;
      case ElementType.Input:
        return <ViewInput {...props}/>;
      case ElementType.Option:
        return <ViewOption {...props} />;
      case ElementType.Radio:
        return <ViewRadio {...props} />;
      case ElementType.Select:
        return <ViewSelect {...props} />;
      case ElementType.TextArea:
        return <ViewTextArea {...props} />;

      // Layout
      case ElementType.Box:
        return <ViewBox {...props} />;
      case ElementType.Column:
        return <ViewColumn {...props} />;
      case ElementType.Inline:
        return <ViewInline {...props} />;
      case ElementType.Label:
        return <ViewLabel {...props} />;
      case ElementType.Row:
        return <ViewRow {...props} />;
      case ElementType.Table:
        return <ViewTable {...props} />;
      case ElementType.TableCell:
        return <ViewTableCell {...props} />;
      case ElementType.TableRow:
        return <ViewTableRow {...props} />;

      // Required
      case ElementType.AllFields:
        return <ViewAllFields {...props} />;
      case ElementType.ProfileEditor:
        return <ViewProfileEditor {...props} />;
      case ElementType.TokenEditor:
        return <ViewTokenEditor {...props} />;

      // Utilities
      case ElementType.Button:
        return <ViewButton {...props} />;
      case ElementType.Collapse:
        return <ViewCollapse {...props} />;
      case ElementType.Loop:
        return <ViewLoop {...props} />;
      case ElementType.Pageable:
        return <ViewPageable {...props} />;
        case ElementType.Prefab:
          return <ViewPrefab {...props} />;
      case ElementType.Tabs:
        return <ViewTabs {...props} />;

      // Other
      case ElementType.Error:
        return <ViewError {...props} />;
    }
  } catch (e) {
    return <ViewError {...props} />;
  }
  return <>{ props.element?.type}</>;
}
