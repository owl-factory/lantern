import { Form, Formik } from "formik";
import React from "react";
import { Input, TextArea } from "../..";

export interface MessageType {
  author: string;
  text: string;
}

interface ChatProps {
 

}

export function addMessage() {

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

export function Chat(props: any) {
  function sendMessage(values: any) {
    const newState = { ...props.data };
    newState.messages.push(values);
    const keys = Object.keys(props.channels);
    keys.forEach((key:string) => {
      console.log(key)
      const channel = props.channels[key];
      channel.send({message: values});
    });
    props.setGameState(newState);
  }

  const messageBlock: JSX.Element[] = [];
  props.data.messages.forEach((message: MessageType, index: number) => {
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
