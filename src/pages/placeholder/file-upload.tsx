import { Button } from "@owl-factory/components/button";
import { Input } from "@owl-factory/components/form";
import { Page } from "components/design";
import { FileData } from "controllers/data/FileData";
import { Formik, Form, FormikProps, FormikBag, FormikHelpers } from "formik";
import React from "react";
import { uploadImage } from "utilities/image-upload";

const INITIAL_VALUES = {
  file: null,
  fileInput: ""
};

async function uploadHandler(event: any, bag: FormikHelpers<any>) {
  console.log(event)
  try {
    await FileData.upload(event);
  } catch (e: any) {
    console.error(e);
  }
  // if (event.target.files && event.target.files.length === 1) {
  //   const image = event.target.files[0];
  //   uploadImage(image).then(e => {console.log(e);});
  // }
}

function uploadTest(event: any) {
  console.log(event)
}

function FileUploadForm() {
  return (
    <Formik
      initialValues={INITIAL_VALUES}
      onSubmit={uploadHandler}
    >
      {(props: FormikProps<any>) => (
        <Form>
          <div className="mb-3">
            <label htmlFor="file" className="form-label">Default file input example</label>
            <input type="file" name="fileInput" onChange={(event) => {props.setFieldValue("file", event.currentTarget.files[0])}}/>
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
