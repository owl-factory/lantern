import { ErrorMessage } from "formik";
import React from "react";
import { Alert } from "react-bootstrap";

interface ErrorProps {
  name: string; // The name of the field with the error
}

/**
 * Renders an error message using Formik and Bootstrap
 * @param props See ErrorProps
 */
export function Error(props: ErrorProps): JSX.Element {
  return (
    <ErrorMessage name={props.name}>
      {(message: string) => (
        <Alert variant="danger">{message}</Alert>
      )}
    </ErrorMessage>
  );
}
