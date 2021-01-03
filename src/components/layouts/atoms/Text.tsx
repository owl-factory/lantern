import React from "react";
import { findValue } from ".";

export function Text(props: any) {
  const text = findValue("text", props);
  return (<span>{text}</span>)
}