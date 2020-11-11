import { Formik, Form as FormikForm } from "formik";
import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import * as Yup from "yup";
import { Error, Input, TextArea, Select, Checkbox } from "../../design/forms/Forms";
import { FormixFormProps } from "../../../model/design/form";
import { CommonContentType } from "@reroll/model/dist/documents/CommonContentType";

/**
 * The props used for the GameSystemForm
 * @param themes An array of themes for a selection
 */
interface ContentTypeFormProps extends FormixFormProps<any> {
  commonContentTypes: CommonContentType[];
}

/**
 * Renders the game system form with functionality for new and existing game systems
 * @param initialValues The initial values of the form
 * @param onSubmit The action to run on submit
 * @param themes An array of themes for a selection
 */
export default function ContentTypeForm(props: ContentTypeFormProps) {
  const commonContentTypeKeys: string[] = [];

  props.commonContentTypes.forEach((commonContentType: CommonContentType) => {
    commonContentTypeKeys.push(commonContentType["_id"]!);
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
      {(formProps: any) => (
        <FormikForm>
          <Row>
            {/* Content Type Name */}
            <Form.Group as={Col}>
              <Form.Label>Content Type</Form.Label>
              <Input name="name" />
              <Error name="name"/>
            </Form.Group>

            {/* URL Key */}
            <Form.Group as={Col}>
              <Form.Label>URL Alias</Form.Label>
              <Input name="alias"/>
              <Error name="alias"/>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Common Content Type</Form.Label>
              <Select 
                name="commonContentTypeID"
                options={props.commonContentTypes}
                labelKey="name"
                valueKey="_id"
              />
              <Error name="commonContentTypeID"/>
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
              <Error name="description"/>
            </Form.Group>
            
          </Row>

          <Button variant="primary" type="submit">Save</Button>
        </FormikForm>
      )}
    </Formik> 
  );
}
