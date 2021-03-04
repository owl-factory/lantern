import React from "react";

export function FloatingLabel(props: any): JSX.Element {
  return (
    <div className="form-floating">
      {props.children}
      <label htmlFor={props.for}>{props.label}</label>
    </div>
  );
}
