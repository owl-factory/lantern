import { Button } from "@chakra-ui/react";
import { AlertController } from "@owl-factory/alerts";
import { isClient } from "@owl-factory/utilities/client";
import { Form, Formik, FormikProps } from "formik";
import { uploadAsset } from "nodes/assets/utilities/submit";
import React from "react";
import { mimetypeToTypeMap } from "types/enums/files/mimetypes";
import { FileType } from "types/enums/files/type";


const INITIAL_VALUES = {
  file: null,
  fileInput: "",
  auxData: {},
};

let img: any;
if (isClient) {
  img = new Image();
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

async function onSubmit(values: any) {
  try {
    const asset = await uploadAsset(values);
    AlertController.success(`${asset.name} was successfully uploaded`);
  } catch (e) {
    AlertController.error(e as string);
  }
}

/**
 * A form for uploading a file
 */
export function AssetUploadForm() {
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
            <Button type="button" onClick={() => props.resetForm()}>Reset</Button>
            <Button type="submit" disabled={loading}>Upload</Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
