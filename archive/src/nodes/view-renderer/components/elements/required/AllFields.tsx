import { AllFieldsAttributes } from "nodes/view-renderer/types/attributes";
import { RenderProps } from "nodes/view-renderer/types/renderProps";
import React from "react";

/**
 * Renders the AllFields element for use within a View
 * @param renderID The ID of the render that this View element uses
 * @param element The element descriptor that defines this element
 * @param properties Any current render state
 */
 export function ViewAllFields(props: RenderProps<AllFieldsAttributes>) {
  return (
    <>Fields</>
  );
}
