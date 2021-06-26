import { Modal } from "components/design";
import { observer } from "mobx-react-lite";
import React from "react";
import { ImageDocument } from "types/documents";
import { ImageForm } from "./ImageForm";

/**
 * Renders a form for creating an image, be it linking from an external site or
 * uploading a brand new image
 */
export const ImageCreationForm = observer(({imageManager, onSave}: any) => {
  const tabs = [
    "link",
    "upload",
  ];

  const onSubmit = async (image: ImageDocument, method: string) => {
    imageManager.createImage(image, method)
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
      imageManager={imageManager}
      onSubmit={onSubmit}
      tabs={tabs}
    />
  );
});

/**
 * Renders the ImageCreationForm within a modal
 */
export const ImageCreationFormModal = observer(({ imageManager, open, handleClose }: any) => {
  
  return (
    <Modal open={open} handleClose={handleClose}>
      <ImageCreationForm imageManager={imageManager} onSave={handleClose}/>
    </Modal>
  )
});
