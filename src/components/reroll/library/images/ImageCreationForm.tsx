import { Modal } from "components/design";
import { observer } from "mobx-react-lite";
import React from "react";
import { ImageDocument } from "types/documents";
import { rest } from "utilities/request";
import { ImageForm } from "./forms/ImageForm";


export const ImageUploadForm = observer(({imageManager, onSave}: any) => {
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

export const ImageUploadFormModal = observer(({ imageManager, open, handleClose }: any) => {
  
  return (
    <Modal open={open} handleClose={handleClose}>
      <ImageUploadForm imageManager={imageManager} onSave={handleClose}/>
    </Modal>
  )
});
