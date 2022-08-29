import { Tooltip } from "@owl-factory/components/tooltip";
import React from "react";
import { ChatMessage } from "../types/message";

interface ChatMessageProps {
  message: ChatMessage;
}

/**
 * Renders a single message
 * @param message The message doc object to render
 */
export function ChatMessage(props: ChatMessageProps): JSX.Element {
  return (
    <div className="message">
      <hr/>
      <b>{props.message.name}</b>&nbsp;
      <Tooltip title={props.message.fullDate}>
        <span className="message-date" >
          {props.message.readableDate}
        </span>
      </Tooltip><br/>
      {props.message.text}
    </div>
  );
}
