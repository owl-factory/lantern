import { Formik, Form as FormikForm } from "formik";
import gql from "graphql-tag";
import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import * as Yup from "yup";
import { Checkbox, Error, Input, Select, TextArea } from "../../design/forms/Forms";
import GameSystemModel from "../../../models/database/gameSystems";
import { FormixFormProps } from "../../../models/design/form";
import ThemeModel from "../../../models/database/themes";

/**
 * Renders the cost input iff the isPurchasable flag is set
 * @param isPurchasable boolean. True if the cost should be rendered, false if not
 */
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

/**
 * The props used for the GameSystemForm
 * @param themes An array of themes for a selection
 */
interface GameSystemFormProps extends FormixFormProps<GameSystemModel> {
  themes: ThemeModel[];
}

/**
 * Renders the game system form with functionality for new and existing game systems
 * @param initialValues The initial values of the form
 * @param onSubmit The action to run on submit
 * @param themes An array of themes for a selection
 */
export default function GameSystemForm(props: GameSystemFormProps) {
  const themeKeys: string[] = [];

  props.themes.forEach((theme: ThemeModel) => {
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
          .test("validCost", "A valid cost must be provided", function (value: number | null | undefined) {
            if (this.parent.isPurchasable !== true) { return true }
            if (value && value < 0) { return false; }
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
