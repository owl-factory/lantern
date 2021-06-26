import { observer } from "mobx-react-lite";
import React, { Dispatch } from "react";
import { ImageList, LinkImageForm, ListFormat } from "components/reroll/library/images";
import { rest } from "utilities/request";
import { ImageDocument, UserDocument } from "types/documents";
import { UploadImageForm } from "./UploadImage";
import { ImageManager } from "client/library";
import { ImageForm } from "./ImageForm";

const tabs = [
  "link",
  "upload",
  "list",
];

interface ImageSelectionFormProps {
  imageManager: ImageManager;
  onSubmit: (image: ImageDocument, method: string) => Promise<unknown>;
  onSave: (result: unknown) => void;
}

/**
 * Renders a form to select an image
 * @param imageManager The image manager containing and managing all of the images
 * @param setUser The function to update the user when a new profile image is selected
 * @param onSave The function to run after the profile image is changed
 */
export const ImageSelectionForm = observer(({imageManager, onSubmit, onSave}: ImageSelectionFormProps) => {

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
      imageManager={imageManager}
      onSubmit={submit}
      tabs={tabs}
    />
  );
});
