import React from "react";
// import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import {
  BaseCheckbox,
  BaseRadioButton,
  BaseSwitch,
  Checkbox,
  Date,
  DateTime,
  AutoForm,
  Input,
  Multiselect,
  RadioButton,
  Select,
  Switch,
  TextArea,
  Time,
} from "../../../components/design/forms/Forms";
import Page from "../../../components/design/Page";
import { defState } from "../../../helpers/tools";

import { Formik, Field, Form, ErrorMessage, } from "formik";
import * as Yup from "yup";

export function TestForm(props: any) {
  return (
    <Formik
      initialValues={{
        email: "",
        firstName: "",
        lastName: "",
      }}
      validationSchema={Yup.object ({
        firstName: Yup.string()
          .max(15, "Must be 15 characters or less")
          .required("Required"),
        lastName: Yup.string()
          .max(20, "Must be 20 characters or less")
          .required("Required"),
        email: Yup.string()
          .email("Invalid email address")
          .required("Required")
      })}
      onSubmit={(values: any) => {
        alert(JSON.stringify(values, null, 2));
      }}
    >
      <Form>
        <label htmlFor="firstName">First Name</label>
        <Field name="firstName" type="text"/>
        <ErrorMessage name="firstName"/>
        
        <label htmlFor="lastName">Last Name</label>
        <Field name="lastName" type="text"/>
        <ErrorMessage name="lastName"/>

        <label htmlFor="email">Email</label>
        <Field name="email" type="text"/>
        <ErrorMessage name="email"/>

      </Form>
    </Formik>

  );
}

/**
 * Renders a the page to create a new game system
 */
function TestForms() {

  return (
    <Page>
      <h1>Test Forms</h1>

      <br/>

      <TestForm/>
    </Page>
  );
}

export default TestForms;
