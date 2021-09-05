import React from "react";
import { TooltipProps } from "./Tooltip";
import { Tooltip } from "bootstrap";

/**
 * Renders a tooltip when the given children are hovered over
 * @param {ReactNode} props.children The children of the overlay trigger
 * @param {TooltipPlacement} props.placement Where the tooltip will be place in relation to the children
 * @param {string} props.title The title of the tooltip
 */
export function FrontEndTooltip(props: TooltipProps): JSX.Element {
  React.useEffect(() => {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new Tooltip(tooltipTriggerEl);
    });
  });

  const placement = props.placement || "top";
  return (
    <span
      className="d-inline-block"
      tabIndex={0}
      data-bs-toggle="tooltip"
      data-bs-placement={placement}
      title={props.title}
    >
      {props.children}
    </span>
  );
}

export default FrontEndTooltip;
