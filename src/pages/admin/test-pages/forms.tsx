import { ErrorMessage, Formik, Form as FormikForm, FormikProps } from "formik";
import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import * as Yup from "yup";
import {
  Checkbox,
  Date,
  DateTime,
  Input,
  RadioButton,
  Select,
  Switch,
  TextArea,
  Time,
} from "../../../components/design/forms/Forms";
import Page from "../../../components/design/Page";

/**
 * Renders a test form for verifying that all of the functionality and design works as intended
 */
export function TestForm(): JSX.Element {
  const selectData = [
    {label: "Dungeons and Dragons 5th Edition", value: "dnd-5e"},
    {label: "Pathfinder 2", value: "pathfinder2"},
    {label: "Rainbows", value: "rainbows"},
  ];

  const initialValues = {
    email: "",
    firstName: "",
    lastName: "",
    gamesystem: "",
    isActive: "",
    difficulty: "",
    isAirConditioningOn: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object ({
        firstName: Yup.string()
          .max(15, "Must be 15 characters or less")
          .required("Required"),
        lastName: Yup.string()
          .max(20, "Must be 20 characters or less")
          .required("Required"),
      })}
      onSubmit={(values: typeof initialValues) => {
        alert(JSON.stringify(values, null, 2));
      }}
    >
      {(props: FormikProps<typeof initialValues>) => (
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
              <Select multiple name="selectTest2" label="Multiselect Test" options={selectData}/>
            </Form.Group>

            <Form.Group as={Col}>
              <Select multiple name="selectTest2" label="Multiselect Test" options={selectData}/>
            </Form.Group>
          </Row>

          <h2>Checkboxes</h2>
          <Row>
            <Form.Group as={Col}>
              <Checkbox name="isActive">
                <Form.Check.Label>Is Active?</Form.Check.Label>
              </Checkbox>

              {props.values.isActive}
              <Checkbox name="isPublished">
                <Form.Check.Label>Is Published?</Form.Check.Label>
              </Checkbox>
            </Form.Group>
          </Row>

          <h2>Radio Buttons</h2>
          <Row>
            <Form.Group as={Col}>
              <RadioButton id="base1" name="difficulty" value="easy">
                <Form.Check.Label>Easy</Form.Check.Label>
              </RadioButton>

              <RadioButton id="base2" name="difficulty" value="hard">
                <Form.Check.Label>Hard</Form.Check.Label>
              </RadioButton>
            </Form.Group>
          </Row>

          <h2>Switches</h2>
          <Row>
            <Form.Group as={Col}>
              <Switch name="isAirConditioningOn" label="Air Conditioning"/>
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

          <Row>
            <Form.Group as={Col}>
              <Button type="submit">Submit</Button>
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
function TestForms(): JSX.Element {
  return (
    <Page>
      <h1>Test Forms</h1>

      <br/>

      <TestForm/>
    </Page>
  );
}

export default TestForms;
