import { useQuery } from "@apollo/react-hooks";
import { Formik, Form as FormikForm } from "formik";
import gql from "graphql-tag";
import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import * as Yup from "yup";
import { Checkbox, Error, Input, Select, TextArea } from "../../design/forms/Forms";


function renderCost(isPurchasable: boolean) {
  if(isPurchasable === true) {
    return (
      <Row>
        <Form.Group as={Col}>
          <Form.Label>Cost</Form.Label>
          <Input type="number" name="cost" />
          <Error name="cost"/>
        </Form.Group>
      </Row>
    );
  }
}

interface Gamesystem {
  name: string;
  key: string;
  description: string;
  isUserCreated: boolean;
  ownerID: string;
  defaultModuleID: string;
  isPublished: boolean;
  isPurchasable: boolean;
  cost: number;
  defaultThemeID: string;
}

interface FormProps {
  initialValues: any;
  onSubmit: () => null;
}

interface GamesystemFormProps extends FormProps {
  initialValues: Gamesystem;
}

export default function GameSystemForm(props: any) {
  const themeKeys: string[] = [];

  props.themes.forEach((theme: any) => {
    themeKeys.push(theme["id"]);
  });

  return (
    <Formik 
      initialValues={props.initialValues}
      onSubmit={props.onSubmit}
      validationSchema={Yup.object({
        name: Yup.string()
          .required("Required")
          .max(100, "Maximum of 100 characters"),
        key: Yup.string()
          .required("Required")
          .max(20, "Maximum of 20 characters"),
        description: Yup.string()
          .max(1000, "Maximum of 1000 characters"),
        defaultThemeID: Yup.string()
          .required("Required")
          .oneOf(themeKeys, "Must be a given theme"),
        cost: Yup.number()
          .test("validCost", "A valid cost must be provided", function (value: number) {
            if (this.parent.isPurchasable !== true) { return true }
            if (value < 0) { return false; }
            return true;
          })
        
      })}
    >
      {(formProps: any) => (
        <FormikForm>
          <Row>
            {/* Gamesystem Name */}
            <Form.Group as={Col}>
              <Form.Label>Gamesystem Name</Form.Label>
              <Input name="name" />
              <Error name="name"/>
            </Form.Group>

            {/* URL Key */}
            <Form.Group as={Col}>
              <Form.Label>URL Key</Form.Label>
              <Input name="key" />
              <Error name="key"/>
            </Form.Group>
          </Row>

          <Row>
            <Form.Group as={Col}>
              {/* Description */}
              <Form.Label>Description</Form.Label>
              <TextArea name="description" />
              <Error name="description"/>
            </Form.Group>

            <Col>
              {/* Default Theme */}
              <Row>
                <Form.Group as={Col}>
                <Form.Label>Default Theme</Form.Label>
                  <Select name="defaultThemeID" options={props.themes} labelKey="name" valueKey="id"/>
                  <Error name="defaultThemeID"/>
                </Form.Group>
              </Row>

              <Row>
                {/* Is Purchasable */}
                <Form.Group as={Col}>
                  <Checkbox name="isPurchasable">
                    <Form.Check.Label>Is Purchasable?</Form.Check.Label>
                  </Checkbox>
                </Form.Group>
              </Row>

              {renderCost(formProps.values.isPurchasable)}
            </Col>
            
          </Row>

          <Button variant="primary" type="submit">Submit!</Button>
        </FormikForm>
      )}
    </Formik> 
  );
}
