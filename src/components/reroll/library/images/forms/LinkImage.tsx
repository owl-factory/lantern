import { Button } from "components/style";
import { Input } from "components/style/forms";
import { Tooltip } from "components/style/tooltips";
import { Formik, Form as FormikForm } from "formik";
import React from "react";
import { ImageDocument } from "types/documents";

interface LinkImageFormProps {
  onSubmit?: (image: ImageDocument) => Promise<void>;
  onSave?: () => void;
}

/**
 * Renders the form to link an external image
 * @param onSubmit A custom function that takes the new image and runs on submit. Nothing else is run
 * @param onSave A custom function that adds extra handling post-save but without overwriting the
 *  original save function
 */
export function LinkImageForm(props: LinkImageFormProps): JSX.Element {
  let onSubmit: (Image: ImageDocument) => Promise<void>;
  if (props.onSubmit) { onSubmit = props.onSubmit; }
  else {
    onSubmit = async () => {
      // TODO - normal save
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
          <Input type="text" name="src"/>
          <label>Name</label>
          <Input type="text" name="name"/>
          <label>Preview</label>
          <img style={{ width: "100%", height: "auto" }} src={formik.values.src}/><br/>

          <Button type="submit">Save</Button>
        </FormikForm>
      )}
    </Formik>
  );
}
