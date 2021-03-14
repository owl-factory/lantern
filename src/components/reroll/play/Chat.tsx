import { Form, Formik } from "formik";
import React from "react";
import { Input, TextArea } from "../..";
import { useGameState } from "./GameStateProvider";

export interface MessageType {
  author: string;
  text: string;
}

function Message({ message }: { message: MessageType }) {
  return (
    <>
      <b>{message.author}</b><br/>
      {message.text}
      <hr/>
    </>
  )
}

export function Chat() {
  const [ gameState, gameDispatch ] = useGameState();

  function sendMessage(values: MessageType) {
    const dispatch = { type: "add message", data: values };
    gameState.server?.sendToAll(dispatch);
    gameDispatch(dispatch);
  }

  const messageBlock: JSX.Element[] = [];
  gameState.messages.forEach((message: MessageType, index: number) => {
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
}
