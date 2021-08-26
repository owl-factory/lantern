import React from "react";

interface CardBodyProps {
  className?: string;
  children: any;
}

export function CardBody(props: CardBodyProps) {
  return (
    <div className={`card-body ${props.className}`}>
      {props.children}
    </div>
  );
}
