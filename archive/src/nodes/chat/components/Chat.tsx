import React from "react";
import { ChatForm } from "./ChatForm";
import { ChatMessages } from "./ChatMessages";

/**
 * Renders the chat module
 */
export function Chat() {
  return (
    <div>
      <ChatMessages/>
      <ChatForm/>
    </div>
  );
}
