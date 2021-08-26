import React from "react";

interface BrandProps {
  children: any;
  href?: string;
}

export function NavbarBrand(props: BrandProps) {
  return (
    <a className="navbar-brand" href={`${props.href || "#"}`}>
      {props.children}
    </a>
  );
}
