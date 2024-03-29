import { observer } from "mobx-react-lite";
import React from "react";
import { FileDocument } from "types/documents";
import { AssetUploadSource } from "types/enums/files/createMethod";
import { ImageForm } from "./ImageForm";

const tabs = [
  "link",
  "upload",
  "list",
];

interface ImageSelectionFormProps {
  onSubmit: (image: Partial<FileDocument>, method: AssetUploadSource) => Promise<unknown>;
  onSave: (result: unknown) => void;
}

/**
 * Renders a form to select an image
 * @param setUser The function to update the user when a new profile image is selected
 * @param onSave The function to run after the profile image is changed
 */
export const ImageSelectionForm = observer(({onSubmit, onSave}: ImageSelectionFormProps) => {

  /**
   * Submits an image selection to the server
   * @param image The new image document to submit
   * @param method The method of selecting a new image
   */
  async function submit(image: Partial<FileDocument>, method: AssetUploadSource): Promise<void> {
    onSubmit(image, method)
    .then((result: unknown) => {
      onSave(result);
    })
    .catch((err: Error) => {
      console.error(err);
    });
  }

  return (
    <ImageForm
      defaultTab="link"
      onSubmit={submit}
      tabs={tabs}
    />
  );
});
