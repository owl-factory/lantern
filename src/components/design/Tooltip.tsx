import React, { ReactNode } from "react";
import { Tooltip as BSTooltip, OverlayTrigger } from "react-bootstrap";
import { def, idify } from "../../helpers/tools";

// Where the tooltip will be placed in relation to the children
type TooltipPlacement = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  children: ReactNode; // The children of the overlay trigger
  placement?: TooltipPlacement; // Where the tooltip will be place in relation to the children
  text: string; // The text of the tooltip
}

/**
 * Renders a tooltip when the given children are hovered over
 * @param {ReactNode} props.children The children of the overlay trigger
 * @param {TooltipPlacement} props.children Where the tooltip will be place in relation to the children
 * @param {string} props.text The text of the tooltip
 */
export default function Tooltip(props: TooltipProps) {
  const placement = def<TooltipPlacement>(props.placement, "bottom");
  return (
    <OverlayTrigger
      placement={placement}
      overlay={<BSTooltip id={"tooltip-" + idify(props.text)}>{props.text}</BSTooltip>}
    >{props.children}</OverlayTrigger>    
  )
}
