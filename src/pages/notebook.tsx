import { Page } from "components/design";
import { NotebookList } from "nodes/notebooks";
import { NotebookModal } from "nodes/notebooks/components/NotebookModal";
import React from "react";

/**
 * A test page for testing out the Notebook module
 */
export function NotebookPage() {
  const [ selectedNotebook, setSelectedNotebook ] = React.useState<string>("");

  return (
    <Page>
      <h1>Notebook Testing</h1>
      <NotebookList onSelect={setSelectedNotebook}/>
      <NotebookModal />
    </Page>
  );
}

export default NotebookPage;
