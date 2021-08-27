import React from "react";

interface ButtonGroupProps {
  children: any;
  ariaLabel?: string;
}

/**
 * Creates a button group to wrap buttons together into a single pill
 * @param ariaLabel The readability label for the button group
 * @param children The contents of the button group. Usually buttons.
 * @returns Returns a button group
 */
export function ButtonGroup(props: ButtonGroupProps) {
  return (
    <div className="btn-group" role="group" aria-label={props.ariaLabel}>
      {props.children}
    </div>
  );
}
