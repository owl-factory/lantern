import React from "react";

interface ButtonGroupProps {
  children: any;
  ariaLabel?: string;
}

export function ButtonGroup(props: ButtonGroupProps) {
  return (
    <div className="btn-group" role="group" aria-label={props.ariaLabel}>
      {props.children}
    </div>
  );
}
