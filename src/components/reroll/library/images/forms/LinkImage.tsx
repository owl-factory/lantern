import { Input, Tooltip } from "components/design";
import { Button } from "components/style";
import { Formik, Form as FormikForm } from "formik";
import React from "react";
import { ImageDocument } from "types/documents";

/**
 * Renders the form to link an external image
 * @param props 
 * @returns 
 */
export function LinkImageForm(props: any): JSX.Element {
  let onSubmit: (image: ImageDocument) => void = props.onSubmit;
  if (!props.onSubmit) {
    onSubmit = () => {
      if (props.onSave) {
        props.onSave();
      }
    };
  }

  return (
    <Formik
      initialValues={{ src: "", name: "" }}
      onSubmit={onSubmit}
    >
      { (formik) => (
        <FormikForm>
          <h4>
            Link Image
            <Tooltip title="Save a reference to the image"><span>(?)</span></Tooltip>
          </h4>
          <label>Link</label>
          <Input name="src"/>
          <label>Name</label>
          <Input name="name"/>
          <label>Preview</label>
          <img style={{ width: "100%", height: "auto" }} src={formik.values.src}/><br/>

          <Button type="submit">Save</Button>
        </FormikForm>
      )}
    </Formik>
  );
}