import Tooltip from "components/design/Tooltip";
import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import { MessageDoc } from "types";
import { Select, TextArea } from "../..";
import { GameServer } from "../../../client";

interface ChatProps {
  server: GameServer;
}

function MessageTime({ createdAt }: {createdAt?: Date}) {
  if (!createdAt) { return <></>; }

  const createdAtDate = new Date(createdAt);
  const caDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: "numeric",
    year: "numeric",
    hour12: true,
    hour: "numeric",
    minute: "2-digit",
    // dayPeriod: "short",
  }
  ).format(createdAtDate);
  const now = new Date();
  let output = ``;
  // Happened longer than a day ago
  if ((now.valueOf() - createdAtDate.valueOf()) > 24 * 60 * 60 * 1000) {
    output = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: "numeric",
      year: "numeric",
    }
    ).format(createdAtDate);
  } else {
    output = new Intl.DateTimeFormat('en-US', {
      hour12: true,
      hour: "numeric",
      minute: "2-digit",
      // dayPeriod: "short",
    }
    ).format(createdAtDate);
  }

  return (
    <Tooltip title={caDate}>
      <span className="message-date" >
        {output}
      </span>
    </Tooltip>
  );
}

function shouldSmooth(message: MessageDoc, previousMessages: MessageDoc[], index: number) {
  if (index === 0) { return false; }

  let count = 0;
  let smooth = false;
  console.log(`${message.name}: ${message.content}`)
  for(let i = index - 1; i >= 0; i--) {
    count++;
    if (count > 4) { return smooth; }
    const previousMessage = previousMessages[i];

    if (previousMessage.name !== message.name) { return smooth; }
    if (((message.createdAt as Date).valueOf() - (previousMessage.createdAt as Date).valueOf()) > 10 * 60 * 1000) {
      return smooth;
    }

    if (!previousMessage.isSmoothed) { smooth = true; }
  }
  return smooth;
}

/**
 * Renders a single message
 * @param message The message doc object to render
 */
function Message({ messages, index }: { messages: MessageDoc[], index: number }): JSX.Element {
  const message = messages[index];
  if (typeof message.createdAt === "string") { message.createdAt = new Date(message.createdAt); }

  const smooth = shouldSmooth(message, messages, index);
  if (smooth) {
    message.isSmoothed = true;
    return (
      <div className="message">
        {message.content}
      </div>
    );
  }

  return (
    <div className="message">
      <hr/>
      <b>{message.name}</b>&nbsp;
      <MessageTime createdAt={message.createdAt}/><br/>
      {message.content}
    </div>
  );
}

/**
 * Renders the chat block
 */
export const Chat = observer((props: ChatProps) => {
  const { server } = props;
  if (!server.isReady) { return <></>}

  function sendMessage(values: MessageDoc) {
    // message.
    server?.fireTextMessage(values);
  }

  const messageBlock: JSX.Element[] = [];
  const sendAsOptions = [
    { value: '', label: server.user.name }
  ];
  console.log(sendAsOptions)

  server.state.messages.forEach((_: MessageDoc, index: number) => {
    messageBlock.push(<Message messages={server.state.messages} index={index} key={index}/>);
  });

  return (
    <div className="play-messages">
      <h2>Chat</h2>
      {messageBlock}
      <Formik
        initialValues={{sendAs: "", content: ""} as MessageDoc}
        onSubmit={(values: MessageDoc) => sendMessage(values)}
      >
      {() => (
        <Form>
          <Select name="sendAs" options={sendAsOptions} includeEmpty={false} valueKey="value"/>
          <TextArea name="content"/>
          <button type="submit">Submit</button>
        </Form>
      )}
      </Formik>
    </div>
  );
});
