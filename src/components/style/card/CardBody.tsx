import React from "react";

interface CardBodyProps {
  className?: string;
  children: any;
}

/**
 * Renders a standard bootstrap 5 card body
 * @param className Any additional classes to apply to the card body
 * @param children The contents of the card body
 * @returns A Bootstrap 5 card body
 */
export function CardBody(props: CardBodyProps) {
  return (
    <div className={`card-body ${props.className}`}>
      {props.children}
    </div>
  );
}
