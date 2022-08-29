import { observer } from "mobx-react-lite";
import React from "react";
import { ChatController } from "../controllers/ChatController";
import styles from "../styles/ChatLog.module.scss";
import { ChatMessage } from "./ChatMessage";

/**
 * Renders the messages from the chat controller
 */
export const ChatMessages = observer(() => {
  const messageElements: JSX.Element[] = [];
  const messages = ChatController.messages;

  for (const message of messages) {
    messageElements.push(<ChatMessage key={message.postedAt.valueOf()} message={message}/>);
  }

  return (
    <div className={styles.chatLog}>
      {messageElements}
    </div>
  );
});
