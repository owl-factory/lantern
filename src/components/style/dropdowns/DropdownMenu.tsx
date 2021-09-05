import React from "react";
import { Button, ButtonGroup } from "../buttons";

interface DropdownProps {
  ariaLabel?: string;
  children: React.ReactChild | React.ReactChildren;
  id: string;
  title: string;
}

/**
 * Creates a dropdown menu
 * @param props.ariaLabel The readability label for the menu
 * @param props.children The dropdown item or items of the dropdown menu
 * @param props.id The id of the dropdown menu
 * @param props.title The title of the dropdown menu, or what appears on the button to drop it
 * @returns Returns a dropdown menu
 */
export function DropdownMenu(props: DropdownProps): JSX.Element {
  return (
    <ButtonGroup>
      <Button className="dropdown-toggle" type="button" id={props.id} data-bs-toggle="dropdown" aria-expanded="false">
        {props.title}
      </Button>
      <ul className="dropdown-menu" aria-labelledby={props.ariaLabel}>
        {props.children}
      </ul>
    </ButtonGroup>
  );
}
