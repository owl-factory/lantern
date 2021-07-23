import { Modal } from "components/design";
import { observer } from "mobx-react-lite";
import React from "react";
import { ImageDocument } from "types/documents";
import { ImageForm } from "./ImageForm";

/**
 * Renders a form for creating an image, be it linking from an external site or
 * uploading a brand new image
 */
export const ImageCreationForm = observer(({imageController, onSave}: any) => {
  const tabs = [
    "link",
    "upload",
  ];

  const onSubmit = async (image: ImageDocument, method: string) => {
    imageController.createImage(image, method)
    .then(() => {
      if (onSave) {
        onSave();
      }
    })
    .catch((error: string) => {
      console.error(error);
    });
  }

  return (
    <ImageForm
      defaultTab="link"
      imageController={imageController}
      onSubmit={onSubmit}
      tabs={tabs}
    />
  );
});

/**
 * Renders the ImageCreationForm within a modal
 */
export const ImageCreationFormModal = observer(({ imageController, open, handleClose }: any) => {
  
  return (
    <Modal open={open} handleClose={handleClose}>
      <ImageCreationForm imageController={imageController} onSave={handleClose}/>
    </Modal>
  )
});
