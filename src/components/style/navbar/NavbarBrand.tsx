import React from "react";

interface BrandProps {
  children: any;
  href?: string;
}

/**
 * Creates and returns a Bootstrap 5 navbar brand
 * @param children The contents of the brand
 * @param href The target URL of the brand
 * @returns A navbar brankd
 */
export function NavbarBrand(props: BrandProps) {
  return (
    <a className="navbar-brand" href={`${props.href || "#"}`}>
      {props.children}
    </a>
  );
}
