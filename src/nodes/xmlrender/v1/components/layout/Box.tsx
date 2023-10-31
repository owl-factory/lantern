import React from "react";
import { SharedProps } from "../../types/sharedProps";
import { renderChildren } from "../../utilities/render";

export function Box(props: SharedProps) {
  return (
    <div>
      {renderChildren(props.element.children, "temp-box")}
    </div>
  );
}
