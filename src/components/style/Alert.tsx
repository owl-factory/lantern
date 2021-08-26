import React from "react";

interface AlertProps {
  children: any;
  variant: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark";
}

export function Alert(props: AlertProps) {
  return (
    <div className={`alert alert-${props.variant}`}>
      {props.children}
    </div>
  );
}
