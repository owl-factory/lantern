import React from "react";
import dynamic from "next/dynamic";

// Where the tooltip will be placed in relation to the children
type TooltipPlacement = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  children: JSX.Element; // The children of the overlay trigger
  placement?: TooltipPlacement; // Where the tooltip will be place in relation to the children
  title: string; // The text of the tooltip
}

const FrontEndTooltip = dynamic(
  () => import('./FrontEndTooltip'),
  { loading: () => <h1>...</h1>, ssr: false},
);

/**
 * Renders a tooltip when the given children are hovered over. SSR safe
 * @param {ReactNode} props.children The children of the overlay trigger
 * @param {TooltipPlacement} props.placement Where the tooltip will be place in relation to the children
 * @param {string} props.title The title of the tooltip
 */
export function Tooltip(props: TooltipProps): JSX.Element {
  return (
    <FrontEndTooltip {...props}/>
  );
}
