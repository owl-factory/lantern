import { AlertController } from "@owl-factory/components/alert";
import { Button } from "@owl-factory/components/button";
import { Input } from "@owl-factory/components/form";
import { rest } from "@owl-factory/https/rest";
import { Page } from "components/design";
import { Auth } from "controllers/auth";
import { ErrorMessage, Form, Formik, FormikHelpers } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import { PasswordChangeFormValues } from "types/forms/user";
import { passwordFormValidationSchema } from "utilities/validation/users/passwords";

/**
 * Renders a form for changing the current user's password
 */
function ChangePasswordForm() {
  const [ err, setError ] = React.useState("");

  async function onSubmit(values: PasswordChangeFormValues, formik: FormikHelpers<PasswordChangeFormValues>) {
    if (!Auth.isLoggedIn) { return; }

    try {
      const result = await rest.patch(`/api/users/password`, values as any);
      setError("");

      if (!result.success) {
        const message = (result.data as any).error;
        if (typeof message === "object") { formik.setErrors(message); }
        else { setError(message); }
        return;
      }

      formik.resetForm();
      AlertController.success("The password was successfully updated");
    } catch (e) {
      setError(e as string);
    }
    return;
  }

  return (
    <>
      <h2>Change Password</h2><hr/>
      <Formik
        initialValues={{ oldPassword: "", newPassword: "", newPasswordConfirmation: "" }}
        validationSchema={passwordFormValidationSchema}
        onSubmit={onSubmit}
      >
        <Form>
          {err} { err ? <br/> : <></> }
          <ErrorMessage name="global"/>

          <label>Old Password</label>
          <Input type="password" name="oldPassword"/>
          <ErrorMessage name="oldPassword"/><br/>

          <label>New Password</label>
          <Input type="password" name="newPassword"/>
          <ErrorMessage name="newPassword"/><br/>

          <label>Confirm New Password</label>
          <Input type="password" name="newPasswordConfirmation"/>
          <ErrorMessage name="newPasswordConfirmation"/><br/>
          <br/>

          <Button type="submit">Update Password</Button>
        </Form>
      </Formik>

      <hr/>
    </>
  );
}

/**
 * Renders the page for managing and changing a user's preferences
 */
function Preferences() {
  return (
    <Page>
      <ChangePasswordForm/>
    </Page>
  );
}

export default observer(Preferences);
