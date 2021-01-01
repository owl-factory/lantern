import React from "react";

export function Text(props: any) {
  const text = props.atom.staticValues.text || undefined;
  return (<span>{text}</span>)
}