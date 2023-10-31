import { ElementType } from "types/enums/xml/elementType";
import { XMLElementAPI } from "types/interfaces/XMLElementAPI";
import React from "react";
import { Box } from "../components/layout/Box";
import { Input } from "../components/input/Input";
import { Button } from "../components/utility/Button";
import { Label } from "../components/layout/Label";

/**
 * Renders a list of elements into JSX without adding additional React components as overhead
 * @param elements A list of element objects to parse
 * @param key The previous element's key
 * @returns An array of rendered JSX.Elements
 */
export function renderChildren(elements: XMLElementAPI[], key: string) {
  const renderedChildren: JSX.Element[] = [];
  const elementTypeCounts = new Map<ElementType, number>();

  for (const element of elements) {
    const elementTypeCount = elementTypeCounts.get(element.type) ?? 0;

    const elementKey = getElementKey(element);
    const Component = getElementComponent(element);

    const fullKey = `${key}_${elementKey}#${elementTypeCount}`;

    renderedChildren.push(<Component key={fullKey} element={element} />);

    elementTypeCounts.set(element.type, elementTypeCount + 1);
  }

  return renderedChildren;
}

/**
 * Maps an element and it's type to a key
 * @param element The element to map
 * @returns The key associated with the element type
 */
function getElementKey(element: XMLElementAPI): string {
  return elementKeyMapping[element.type] ?? `unsupported:${element.type}`;
}

/**
 * Maps an element and it's type to a component function
 * @param element The element to map
 * @returns The functional component associated with the element type
 */
function getElementComponent(element: XMLElementAPI): typeof Box {
  return elementMapping[element.type] ?? (() => <>Nope!</>);
}

const elementMapping: Record<number, typeof Box> = {
  [ElementType.Input]: Input,
  [ElementType.Box]: Box,
  [ElementType.Label]: Label,
  [ElementType.Button]: Button,
};

const elementKeyMapping: Record<number, string> = {
  [ElementType.Input]: "input",
  [ElementType.Box]: "box",
  [ElementType.Label]: "label",
  [ElementType.Button]: "button",
};


