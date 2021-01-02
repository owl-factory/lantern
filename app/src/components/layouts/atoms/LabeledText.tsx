import React from "react";
import { findValue } from ".";

export function LabeledText(props: any) {
  const text = findValue("text", props);
  if (!text) { return <></>; }

  const label = findValue("label", props);
  return (
    <div>
      <span>{label}</span>&nbsp;
      <span>{text}</span>
    </div>
  )
}