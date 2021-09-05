import { Alert } from "components/style/Alert";
import { ErrorMessage as FormikErrorMessage } from "formik";
import React from "react";

interface ErrorProps {
  name: string; // The name of the field with the error
}

/**
 * Renders an error message using Formik and Bootstrap
 * @param props See ErrorProps
 */
export function ErrorMessage(props: ErrorProps): JSX.Element {
  return (
    <FormikErrorMessage name={props.name}>
      {(message: string) => (
        <Alert variant="danger">{message}</Alert>
      )}
    </FormikErrorMessage>
  );
}
