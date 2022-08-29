import { Page } from "components/design";
import { observer } from "mobx-react-lite";
import { Chat } from "nodes/chat";
import React from "react";

/**
 * Renders a development page for testing the chat node
 */
function ChatDevPage() {
  return (
    <Page>
      <Chat/>
    </Page>
  );
}

export default observer(ChatDevPage);
