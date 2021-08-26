import React from "react";

interface CardProps {
  className?: string;
  children: any;

}

export function Card(props: any) {
  return (
    <div className={`card ${props.className}`}>
      {props.children}
    </div>
  );
}
