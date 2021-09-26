import { ImageManager } from "client/data/managers";
import { Modal } from "components/style/modals";
import { observer } from "mobx-react-lite";
import React from "react";
import { ImageDocument } from "types/documents";
import { ImageForm } from "./ImageForm";

/**
 * Renders a form for creating an image, be it linking from an external site or
 * uploading a brand new image
 */
export const ImageCreationForm = observer(({onSave}: any) => {
  const tabs = [
    "link",
    "upload",
  ];

  const onSubmit = async (image: ImageDocument, method: string) => {
    // ImageManager.createOne(image, method)
    // .then(() => {
    //   if (onSave) {
    //     onSave();
    //   }
    // })
    // .catch((error: string) => {
    //   console.error(error);
    // });
  };

  return (
    <ImageForm
      defaultTab="link"
      onSubmit={onSubmit}
      tabs={tabs}
    />
  );
});

/**
 * Renders the ImageCreationForm within a modal
 */
export const ImageCreationFormModal = observer(({ open, handleClose }: any) => {
  return (
    <Modal open={open} handleClose={handleClose}>
      <ImageCreationForm onSave={handleClose}/>
    </Modal>
  );
});
