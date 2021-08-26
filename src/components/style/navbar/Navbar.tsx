import React from "react";

interface NavbarProps {
  bg?: string;
  className?: string;
  children: any;
  expand?: string;
  variant?: string;
}

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

export function Navbar(props: NavbarProps) {
  return (
    <div className={`navbar ${buildClasses(props)} ${props.className || ""}`}>
      {props.children}
    </div>
  );
}
