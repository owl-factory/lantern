import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import { Input, TextArea } from "../..";
import { GameServer } from "../../../client";

export interface MessageType {
  author: string;
  text: string;
}

export interface ChatProps {
  server: GameServer;
}

function Message({ message }: { message: MessageType }) {
  return (
    <>
      <b>{message.author}</b><br/>
      {message.text}
      <hr/>
    </>
  );
}

export const Chat = observer((props: ChatProps) => {
  const { server } = props;
  function sendMessage(values: MessageType) {
    const dispatch = { type: "add message", data: values };
    server?.sendToAll(dispatch);
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
        initialValues={{author: "", text: ""}}
        onSubmit={(values: MessageType) => sendMessage(values)}
      >
      {() => (
        <Form>
          <Input name="author"/>
          <TextArea name="text"/>
          <button type="submit">Submit</button>
        </Form>
      )}
      </Formik>
    </div>
  );
});
