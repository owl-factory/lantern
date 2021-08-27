import React from "react";

interface CardHeaderProps {
  className?: string;
  children: any;
}

/**
 * Renders a standard bootstrap 5 card header
 * @param className Any additional classes to apply to the card header
 * @param children The contents of the card header
 * @returns A Bootstrap 5 card header
 */
export function CardHeader(props: CardHeaderProps) {
  return (
    <div className="card-header">{props.children}</div>
  );
}
