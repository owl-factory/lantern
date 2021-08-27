import React from "react";

interface NavbarProps {
  bg?: "dark" | "light";
  className?: string;
  children: any;
  expand?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "dark" | "light";
}

/**
 * Creates a single of classes based off of several values in the Navbar props
 * @param props A collection of the same navbar props to extract the needed fields. Because I'm lazy
 * @returns A string of multiple classes
 */
function buildClasses(props: NavbarProps) {
  let className = "";
  switch((props.variant || "").toLowerCase()) {
    case "dark":
      className += "navbar-dark ";
      break;
    case "light":
    default:
      className += "navbar-light ";
      break;
  }

  switch((props.bg || "").toLowerCase()) {
    case "dark":
      className += "bg-dark ";
      break;
    default:
      className += "bg-light ";
      break;
  }

  if (props.expand) {
    className += `navbar-expand-${props.expand.toLowerCase()} `;
  }

  return className;
}

/**
 * Creates a bootstrap 5 navbar off of the given options
 * @param bg The dark mode of the background. Either "dark" or "light"
 * @param className Any additional classes to apply to the navbar
 * @param children The contents of the Navbar
 * @param expand The breakpoint at which the navbar should expand or contract
 * @param variant The dark mode of the foreground. Either "dark" or "light"
 * @returns A navbar and it's children
 */
export function Navbar(props: NavbarProps) {
  return (
    <div className={`navbar ${buildClasses(props)} ${props.className || ""}`}>
      {props.children}
    </div>
  );
}
