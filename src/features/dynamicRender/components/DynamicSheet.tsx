import { useContext } from "react";
import { DynamicContext } from "../context/dynamicContext";
import { ParsedNode } from "../types/render";
import { parseNodeChildren } from "../utils/render";
import { TextInput } from "./form/TextInput";

/**
 * Renders the Sheet portion of a DynamicRender
 */
export function DynamicSheet() {
  const { markup } = useContext(DynamicContext);

  const layout = markup.layout;
  if (layout === undefined) return <></>;

  const parsedNodes = parseNodeChildren(layout.childNodes);
  const children = parsedNodes.map((node: ParsedNode) => <node.Component key={node.key} {...node.props} />);
  return (
    <>
      {children}
      <TextInput />
      <TextInput />
    </>
  );
}
