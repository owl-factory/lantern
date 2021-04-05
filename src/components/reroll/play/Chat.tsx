import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import { DispatchEvent } from "types";
import { Input, TextArea } from "../..";
import { GameServer } from "../../../client";

export interface MessageType {
  name: string;
  content: string;
}

export interface ChatProps {
  server: GameServer;
}


function Message({ message }: { message: MessageType }) {
  return (
    <>
      <b>{message.name}</b><br/>
      {message.content}
      <hr/>
    </>
  );
}

export const Chat = observer((props: ChatProps) => {
  const { server } = props;

  function sendMessage(values: MessageType) {
    // message.
    server?.fireTextMessage(values);
  }

  const messageBlock: JSX.Element[] = [];

  server.gameState.messages.forEach((message: MessageType, index: number) => {
    messageBlock.push(<Message message={message} key={index}/>);
  });

  return (
    <div>
      <h2> Chat</h2>
      {messageBlock}
      <Formik
        initialValues={{name: "", content: ""}}
        onSubmit={(values: MessageType) => sendMessage(values)}
      >
      {() => (
        <Form>
          <Input name="name"/>
          <TextArea name="content"/>
          <button type="submit">Submit</button>
        </Form>
      )}
      </Formik>
    </div>
  );
});
