import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  id?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

/**
 * Renders out a standard button
 * @param props.children The content inside of the button
 * @param props.className The class name to apply to the base of the button
 * @param props.disabled Boolean. Disables the button if this is true
 * @param props.onClick The action to run when the button is clicked
 * @param props.type The type of button that this is, and the default action it will perform
 * @returns A JSX element with a button
 */
export function Button(props: ButtonProps): JSX.Element {
  const className = `btn btn-primary ${props.className}`;
  const type = props.type || "button";
  return (
    <button
      className={className}
      id={props.id}
      onClick={props.onClick}
      disabled={props.disabled}
      type={type}
    >
      {props.children}
    </button>
  );
}
