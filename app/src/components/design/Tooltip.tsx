import React from "react";
import { Tooltip as BSTooltip, OverlayTrigger } from "react-bootstrap";
import { idify } from "../../utilities/tools";

// Where the tooltip will be placed in relation to the children
type TooltipPlacement = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  children: JSX.Element; // The children of the overlay trigger
  placement?: TooltipPlacement; // Where the tooltip will be place in relation to the children
  title: string; // The text of the tooltip
}

/**
 * Renders a tooltip when the given children are hovered over
 * @param {ReactNode} props.children The children of the overlay trigger
 * @param {TooltipPlacement} props.placement Where the tooltip will be place in relation to the children
 * @param {string} props.title The title of the tooltip
 */
export default function Tooltip(props: TooltipProps): JSX.Element {
  const placement = props.placement || "top";
  return (
    <OverlayTrigger
      placement={placement}
      overlay={<BSTooltip id={"tooltip-" + idify(props.title)}>{props.title}</BSTooltip>}
    >
      {props.children}
    </OverlayTrigger>    
  )
}
