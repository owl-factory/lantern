import { Button } from "@owl-factory/components/button";
import { Input } from "@owl-factory/components/form";
import { Page } from "components/design";
import { FileData } from "controllers/data/FileData";
import { Formik, Form, FormikProps, FormikBag, FormikHelpers } from "formik";
import React from "react";
import { uploadImage } from "utilities/image-upload";

interface FormValues {
  file: File | null;
  fileInput: string;
}

const INITIAL_VALUES = {
  file: null,
  fileInput: "",
};

async function onSubmit(values: FormValues) {
  // TODO - Validate
  try {
    await FileData.upload(values as any);
  } catch (e: any) {
    console.error(e);
  }
}

/**
 * Places the file into a Formik form value, as Formik doesn't normally support file uploads
 * @param event The onChange event that triggered the call
 * @param setFieldValue A function that sets a value in the Formik form
 */
function onChange(
  event: React.ChangeEvent<HTMLInputElement>,
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void
): void {
  if (event.currentTarget.files === null) {
    setFieldValue("file", null);
    return;
  }
  setFieldValue("file", event.currentTarget.files[0]);
}

function FileUploadForm() {
  return (
    <Formik
      initialValues={INITIAL_VALUES}
      onSubmit={onSubmit}
    >
      {(props: FormikProps<any>) => (
        <Form>
          <div className="mb-3">
            <label htmlFor="file" className="form-label">Default file input example</label>
            <input
              type="file"
              name="fileInput"
              onChange={(event) => {onChange(event, props.setFieldValue)}}/>
            {/* <input type="file" name="form2" onChange={uploadTest}/> */}
            <Button type="button" onClick={props.resetForm}>Reset</Button>
            <Button type="submit">Upload</Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default function FileUploadPage() {
  return (
    <Page>
      <h1>Upload a File</h1>
      <FileUploadForm/>
    </Page>
  );
}
