import { ContextMenuBuilderOutput } from "../../../model/design/contextMenu";
import { ContextDropdownMenu } from "./ContextDropdown";
import { Dropdown, ButtonGroup } from "react-bootstrap";
import Tooltip from "../Tooltip";
import { ContextButtons } from "./ContextButtons";

interface ContextMenuProps extends ContextMenuBuilderOutput {
  context: any;
}

/**
 * Renders the button for opening a dropdown menu
 */
function ContextDropdownButton(props: any) {
  return (
    <Tooltip title="More">
      <Dropdown.Toggle 
        split 
        id={`dropdown-toggle`}
      >
        ...
      </Dropdown.Toggle>
    </Tooltip>
  );
}

/**
 * Renders the context menu
 * @param props Information for how to render the context buttons and de
 */
export default function ContextMenu(props: ContextMenuProps) {
  const buttonMenu = <ContextButtons {...props}/>;
  const dropdownMenu = <ContextDropdownMenu {...props}/>;

  return (
    <Dropdown alignRight={true} drop="down">
      <ButtonGroup >
        {buttonMenu}

        <ContextDropdownButton/>
      </ButtonGroup>
      {dropdownMenu}
    </Dropdown>
  );
}