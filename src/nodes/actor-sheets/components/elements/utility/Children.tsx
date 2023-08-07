import { SheetElementProps } from "nodes/actor-sheets/types";
import React from "react";
import { SheetElement } from "../../SheetElement";

/**
 * Renders out the children of a sheet element in a consistent way. This removes the need to loop in
 * every element that has children and prevents duplicate code
 */
export function SheetChildren(props: SheetElementProps<any>) {
  const elements = props.element.children || [];
  const children: JSX.Element[] = [];

  for (const element of elements) {
    const key = props.properties._prefix + element.$key;
    children.push(
      <SheetElement
        key={key}
        $key={key}
        renderID={props.renderID}
        element={element}
        properties={props.properties}
      />
    );
  }

  return (
    <>{children}</>
  );
}
