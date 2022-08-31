import React from "react";

interface AlertProps {
  children: any;
  variant: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark";
}

/**
 * Creates a standard bootstrap 5 alert
 * @param children The contents of the Alert
 * @param variant The color and style of the Alert
 * @returns Returns a bootstrap 5 alert
 */
export function Alert(props: AlertProps) {
  return (
    <div className={`alert alert-${props.variant}`}>
      {props.children}
    </div>
  );
}
