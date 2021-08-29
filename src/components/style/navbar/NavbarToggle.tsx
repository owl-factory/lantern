import React from "react";
import { Button } from "../buttons";

export function NavbarToggle() {
  return (
    <Button
      type="button"
      className="navbar-toggler"
      data-bs-toggle="collapse"
      data-bs-target="#navbarToggleCollapse"
      aria-controls="navbarToggleCollapse"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </Button>
  );
}
