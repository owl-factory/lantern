import { Button } from "@owl-factory/components/button";
import { isClient } from "@owl-factory/utilities/client";
import { FileData } from "controllers/data/FileData";
import { Form, Formik, FormikProps } from "formik";
import React from "react";
import { mimetypeToTypeMap } from "types/enums/files/mimetypes";
import { FileType } from "types/enums/files/type";

interface FormValues {
  file: File | null;
  fileInput: string;
  auxData: Record<string, unknown>;
}

const INITIAL_VALUES = {
  file: null,
  fileInput: "",
  auxData: {},
};

let img: any;
if (isClient) {
  img = new Image();
}

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
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
): void {
  if (event.currentTarget.files === null) {
    setFieldValue("file", null);
    setFieldValue("auxData", {});
    setLoading(false);
    return;
  }
  const file: File = event.currentTarget.files[0];
  setFieldValue("file", file);
  setLoading(false);

  const fileType: FileType = (mimetypeToTypeMap as Record<string, FileType>)[file.type];
  switch(fileType) {
    case FileType.Image:
      setLoading(true);
      img.src = window.URL.createObjectURL(file);
      img.onload = () => {
        const auxData = {
          width: img.width,
          height: img.height,
        };
        setFieldValue("auxData", auxData);
        setLoading(false);
      };
  }

}

/**
 * A form for uploading a file
 */
export function FileUploadForm() {
  const [loading, setLoading] = React.useState(false);

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
              onChange={(event) => { onChange(event, props.setFieldValue, setLoading); }}/>
            <Button type="button" onClick={props.resetForm}>Reset</Button>
            <Button type="submit" disabled={loading}>Upload</Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
