import { observer } from "mobx-react-lite";
import React from "react";
import { ImageDocument } from "types/documents";
import { ImageController } from "client/library";
import { ImageForm } from "./ImageForm";

const tabs = [
  "link",
  "upload",
  "list",
];

interface ImageSelectionFormProps {
  imageController: ImageController;
  onSubmit: (image: ImageDocument, method: string) => Promise<unknown>;
  onSave: (result: unknown) => void;
}

/**
 * Renders a form to select an image
 * @param imageController The image manager containing and managing all of the images
 * @param setUser The function to update the user when a new profile image is selected
 * @param onSave The function to run after the profile image is changed
 */
export const ImageSelectionForm = observer(({imageController, onSubmit, onSave}: ImageSelectionFormProps) => {

  /**
   * Submits an image selection to the server
   * @param image The new image document to submit
   * @param method The method of selecting a new image
   */
  async function submit(image: ImageDocument, method: string): Promise<void> {
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
      imageController={imageController}
      onSubmit={submit}
      tabs={tabs}
    />
  );
});
