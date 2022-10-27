import { observer } from "mobx-react-lite";
import { ViewRenderer } from "nodes/view-renderer";
import { TableCellAttributes } from "nodes/view-renderer/types/attributes";
import { RenderProps } from "nodes/view-renderer/types/renderProps";
import { fetchExpressionValues, runExpression } from "nodes/view-renderer/utilities/render/expression";
import React from "react";

/**
 * Renders a table cell for use within a View
 * @param renderID The ID of the render that this View element uses
 * @param element The element descriptor that defines this element
 * @param properties Any current render state
 */
 export const ViewTableCell = observer((props: RenderProps<TableCellAttributes>) => {
  const sources = ViewRenderer.renders[props.renderID].sources;

  const [ className, setClassName ] = React.useState("");
  const [ width, setWidth ] = React.useState(0);

  // Class Name
  React.useEffect(() => {
    runExpression(sources, props.element.attributes.className, props.properties).then((res: string) => {
      setClassName(res);
    });
  }, fetchExpressionValues(sources, props.element.attributes.className) as unknown[]);

  // Width
  React.useEffect(() => {
    runExpression(sources, props.element.attributes.width, props.properties).then((res: string) => {
      const newWidth = parseInt(res);
      if (isNaN(newWidth)) { setWidth(1); }
      setWidth(newWidth);
    });
  }, fetchExpressionValues(sources, props.element.attributes.width) as unknown[]);


  return (
    <td className={`table-cell ${className}`} colSpan={width}>
      <ViewChildren {...props}/>
    </td>
  );
});
