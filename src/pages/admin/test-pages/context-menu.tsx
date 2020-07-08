import React from "react";
import Page from "../../../components/design/Page";
import { ContextMenuBuilder } from "../../../helpers/design/contextMenu";
import { MdEdit, MdViewList, MdAttachFile, MdClose } from "react-icons/md";
import ContextMenu from "../../../components/design/ContextMenu";
import { Dropdown } from "react-bootstrap";

// Used to create a generic context type for examples
interface ContextType {
  name: string;
}

/**
 * Renders a test page for Context Menus
 */
export default function TestContextMenu() {
  const contextMenuBuilder1 = new ContextMenuBuilder()
    .addHeader("Testing Dropdown!")
    .addItem("View", <MdViewList/>, (context: ContextType) => {alert("View " + context.name)})
    .addItem("Edit", <MdEdit/>, (context: ContextType) => {alert("Editing " + context.name)})
    .addDivider()
    .addItem("Publish", <MdAttachFile/>, (context: ContextType) => {alert("Publish " + context.name)})
    .addItem("Delete", <MdClose/>, (context: ContextType) => {alert("Delete " + context.name)})

  const context = {name: "Test Gamesystem"};

  return (
    <Page>
      <h2>Context Menus!</h2>
      <h3>Context Menu</h3>
      <ContextMenu {...contextMenuBuilder1.renderConfig()} context={context}>
        <Dropdown.Toggle id="dropdown-a">Test Me!</Dropdown.Toggle>
      </ContextMenu>
    </Page>
  )
}