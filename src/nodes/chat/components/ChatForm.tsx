import { Input, Select } from "components/form";
import { Auth } from "controllers/auth";
import { Form, Formik, FormikHelpers } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import { ChatController } from "../controllers/ChatController";
import { ChatFormValues } from "../types/form";

/**
 * Submits the chat message to the ChatController, adding the message and running any other handling
 * @param values The form values containing the message and who the sender is
 * @param formik The formik helper values, for updating the form after the fact
 */
function onSubmit(values: ChatFormValues, formik: FormikHelpers<ChatFormValues>) {
  try {
    ChatController.post(values);
    formik.setFieldValue("message", "");
  } catch (e) {
    console.error(e);
  }
}

/**
 * Renders the form to add a new message to the chat
 */
export const ChatForm = observer(() => {
  const options = [
    <option value="">{Auth.user?.displayName || "Guest"}</option>,
  ];

  for (const actor of ChatController.actors) {
    options.push(<option value={actor.ref}>{actor.name}</option>);
  }

  return (
    <div>
      <Formik
      initialValues={{as: "", message: ""}}
      onSubmit={onSubmit}
    >
      {() => (
        <Form>
          <Select name="as">
            {options}
          </Select>
          <Input type="textarea" name="message"/>
          <button type="submit">Submit</button>
        </Form>
      )}
      </Formik>
    </div>
  );
});
