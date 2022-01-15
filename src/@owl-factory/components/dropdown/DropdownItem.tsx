import Link from "next/link";
import React from "react";

interface DropdownItemProps {
  children: React.ReactChild;
  href?: string;
  onClick?: () => void;
}

/**
 * Renders a dropdown item for a dropdown menu
 * @param props.children The contents of the dropdown item, primarily text
 * @param props.href The URL to link to, if any
 * @param props.onClick The action to run onClick, if any
 * @returns An item for a dropdown menu
 */
export function DropdownItem(props: DropdownItemProps): JSX.Element {
  const item = (
    <a
      className="dropdown-item" href={`${props.href || "#"}`}
      onClick={props.onClick}
    >
      {props.children}
    </a>
  );

  if (props.href) {
    return (
      <li>
        <Link href={props.href}>
          {item}
        </Link>
      </li>
    );
  }
  return (<li>{item}</li>);
}
