import { Formik, Form as FormikForm } from "formik";
import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import * as Yup from "yup";
import { Checkbox, Error, Input, TextArea } from "../../design/forms/Forms";
import { FormixFormProps } from "../../../model/design/form";
import { ModuleInput } from "@reroll/model/dist/inputs/ModuleInput";

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
 * Renders the game system form with functionality for new and existing game systems
 * @param initialValues The initial values of the form
 * @param onSubmit The action to run on submit
 * @param themes An array of themes for a selection
 */
export default function ModuleForm(props: FormixFormProps<ModuleInput>) {

  return (
    <Formik 
      initialValues={props.initialValues}
      onSubmit={props.onSubmit}
      validationSchema={Yup.object({
        name: Yup.string()
          .required("Required")
          .max(100, "Maximum of 100 characters"),
        alias: Yup.string()
          .max(20, "Maximum of 20 characters"),
        description: Yup.string()
          .max(1000, "Maximum of 1000 characters"),  
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
              <Form.Label>Module Name</Form.Label>
              <Input name="name" />
              <Error name="name"/>
            </Form.Group>

            {/* URL Key */}
            <Form.Group as={Col}>
              <Form.Label>URL Alias</Form.Label>
              <Input name="alias"/>
              <Error name="alias"/>
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
