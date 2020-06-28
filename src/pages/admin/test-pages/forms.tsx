import React from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import {
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

import { Formik, Field, Form as FormikForm, ErrorMessage, } from "formik";
import * as Yup from "yup";

export function TestForm(props: any) {
  const selectData = [
    {label: "Dungeons and Dragons 5th Edition", value: "dnd-5e"},
    {label: "Pathfinder 2", value: "pathfinder2"},
    {label: "Rainbows", value: "rainbows"},
  ];

  return (
    <Formik
      initialValues={{
        email: "",
        firstName: "",
        lastName: "",
        gamesystem: "",
        isActive: "",
        difficulty: "",
        isAirConditioningOn: "",
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
      {(props: any) => (
        <FormikForm>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>First Name</Form.Label>
              <Input aria-label="First Name" name="firstName"/>
              <ErrorMessage name="firstName"/>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Last Name</Form.Label>
              <Input aria-label="Last Name" name="lastName"/>
              <ErrorMessage name="lastName"/>
            </Form.Group>
          </Row>

          <h2>Select Inputs</h2>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>Game System</Form.Label>
              <Select name="gamesystem" options={selectData}/>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Game System</Form.Label>
              <Select name="gamesystem" options={selectData}/>
            </Form.Group>
          </Row>

          <Row>
            <Form.Group as={Col}>
              <Multiselect name="selectTest2" label="Multiselect Test" options={selectData}/>
            </Form.Group>

            <Form.Group as={Col}>
              <Multiselect name="selectTest2" label="Multiselect Test" options={selectData} defaultValue={[]}/>
            </Form.Group>
          </Row>

          <h2>Checkboxes</h2>
          <Row>
            <Form.Group as={Col}>
              <Checkbox name="isActive">
                <Form.Check.Label>Is Active?</Form.Check.Label>
              </Checkbox>
            
              <Checkbox name="isPublished">
                <Form.Check.Label>Is Published?</Form.Check.Label>
              </Checkbox>
            </Form.Group>
          </Row>

          <h2>Radio Buttons</h2>
          <Row>
            <Form.Group as={Col}>
              <RadioButton id="base1" name="difficulty" value="easy">
                <Form.Check.Label>Yes</Form.Check.Label>
              </RadioButton>
            
              <RadioButton id="base2" name="difficulty" value="hard">
                <Form.Check.Label>No</Form.Check.Label>
              </RadioButton>
            </Form.Group>
          </Row>

          <h2>Switches</h2>
          <Row>
            {/* TODO - this doesn't work */}
            <Form.Group as={Col}>
              <Switch name="isAirConditioningOn">
                <Form.Check.Label>Air Conditioning</Form.Check.Label>
              </Switch>
            </Form.Group>
          </Row>

          <h2>Dates</h2>
          <Row>
            <Form.Group as={Col}>
              <Date name="dateTest" label="Date Test" />
            </Form.Group>

            <Form.Group as={Col}>
              <Date name="dateTest" label="Date Test" />
            </Form.Group>
          </Row>

          <h2>Date Time</h2>
          <Row>
            <Form.Group as={Col}>
              <DateTime name="datetime" label="Date Time Test"/>
            </Form.Group>

            <Form.Group as={Col}>
              <DateTime name="datetime" label="Date Time Test"/>
            </Form.Group>
          </Row>

          <h2>Time</h2>
          <Row>
            <Form.Group as={Col}>
              <Time name="time" label="Time Test"/>
            </Form.Group>

            <Form.Group as={Col}>
              <Time name="time" label="Time Test"/>
            </Form.Group>
          </Row>

          <h2>TextArea</h2>
          <Row>
            <Form.Group as={Col}>
              <TextArea name="textarea" rows={2} label="Text Area"/>
            </Form.Group>

            <Form.Group as={Col}>
              <TextArea name="textarea" rows={2} label="Text Area"/>
            </Form.Group>
          </Row>
        </FormikForm>
      )}
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
