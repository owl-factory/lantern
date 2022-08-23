import { Modal } from "@owl-factory/components/modal";
import { observer } from "mobx-react-lite";
import React from "react";
import { FileDocument } from "types/documents";
import { AssetUploadSource } from "types/enums/files/createMethod";
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

  // TODO - fix image create
  const onSubmit = async (image: Partial<FileDocument>, method: AssetUploadSource) => {
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
