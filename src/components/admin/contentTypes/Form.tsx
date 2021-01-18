import { Formik, Form as FormikForm } from "formik";
import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import * as Yup from "yup";
import { Checkbox, ErrorMessage, Input, Select, TextArea } from "../../design/forms/Forms";
import { FormixFormProps } from "../../../types/design/form";
import { CommonContentType } from "../../../types/documents";

/**
 * The props used for the GameSystemForm
 * @param themes An array of themes for a selection
 */
interface ContentTypeFormProps extends FormixFormProps<CommonContentType> {
  commonContentTypes: CommonContentType[];
}

/**
 * Renders the game system form with functionality for new and existing game systems
 * @param initialValues The initial values of the form
 * @param onSubmit The action to run on submit
 * @param themes An array of themes for a selection
 */
export default function ContentTypeForm(props: ContentTypeFormProps): JSX.Element {
  const commonContentTypeKeys: string[] = [];

  props.commonContentTypes.forEach((commonContentType: CommonContentType) => {
    commonContentTypeKeys.push(commonContentType["_id"] || "undefined");
  });

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
      })}
    >
      {() => (
        <FormikForm>
          <Row>
            {/* Content Type Name */}
            <Form.Group as={Col}>
              <Form.Label>Content Type</Form.Label>
              <Input name="name" />
              <ErrorMessage name="name"/>
            </Form.Group>

            {/* URL Key */}
            <Form.Group as={Col}>
              <Form.Label>URL Alias</Form.Label>
              <Input name="alias"/>
              <ErrorMessage name="alias"/>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Common Content Type</Form.Label>
              <Select
                name="commonContentTypeID"
                options={props.commonContentTypes}
                labelKey="name"
                valueKey="_id"
              />
              <ErrorMessage name="commonContentTypeID"/>
            </Form.Group>

              {/* Is Purchasable */}
            <Form.Group as={Col}>
              <Checkbox name="isTypeOnly">
                <Form.Check.Label>Is Type Only?</Form.Check.Label>
              </Checkbox>
            </Form.Group>
          </Row>

          <Row>
            <Form.Group as={Col}>
              {/* Description */}
              <Form.Label>Description</Form.Label>
              <TextArea name="description" />
              <ErrorMessage name="description"/>
            </Form.Group>

          </Row>

          <Button variant="primary" type="submit">Save</Button>
        </FormikForm>
      )}
    </Formik>
  );
}
