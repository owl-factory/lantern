import { observer } from "mobx-react-lite";
import React from "react";
import { SheetElementProps } from "../../types";
import { ErrorDescriptor } from "nodes/actor-sheets/types/elements/error";

/**
 * Renders a error message in the event that an element notably failed
 * @param element The error element description
 */
export const SheetError = observer((props: SheetElementProps<ErrorDescriptor>) => {
  return (
    <div>
      <label style={{ fontWeight: "bold", color: "red" }}>
        {props.element.error}
      </label>
    </div>
  );
});
