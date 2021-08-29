import React from "react";

interface NavbarCollapseProps {
  children: any
}

export function NavbarCollapse(props: NavbarCollapseProps) {
  return (
    <div className="collapse navbar-collapse" id="navbarToggleCollapse">
      {props.children}
    </div>
  );
}
