import React from "react";

interface CardProps {
  className?: string;
  children: any;
  onClick?: () => void
}

/**
 * Renders a standard bootstrap 5 card
 * @param className Any additional classes to apply to the card
 * @param children The contents of the card
 * @returns A Bootstrap 5 card
 */
export function Card(props: CardProps) {
  return (
    <div
      className={`card ${props.className}`}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
}
