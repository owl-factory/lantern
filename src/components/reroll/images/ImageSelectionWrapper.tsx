import { Modal, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { FileDocument } from "types/documents";
import { AssetUploadSource } from "types/enums/files/createMethod";
import { ImageSelectionForm } from ".";
import style from "./ImageSelectionWrapper.module.scss";

interface ImageSelectionWrapperProps {
  children: JSX.Element;
  onSubmit: (image: Partial<FileDocument>, method: AssetUploadSource) => Promise<unknown>;
  onSave?: (result: unknown) => void;
}

/**
 * Renders a clickable wrapper around an image that opens a modal with a list of methods to allow
 * changing the image.
 *
 * @param children The image to render
 * @param onSubmit The action to run when the submit button is clicked
 * @param onSave The post-submit success action to run. This may be closing a modal, for example
 */
export function ImageSelectionWrapper({ children, onSubmit, onSave }: ImageSelectionWrapperProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  function postSave(result: unknown) { if (onSave) {onSave(result);} onClose(); }
  return (
    <div>
      <div className={`${style.profileImageWrapper}`} onClick={onOpen}>
        <div className={`${style.profileHoverWrapper}`}>
          Change Image
        </div>
        {children}
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ImageSelectionForm onSubmit={onSubmit} onSave={postSave}/>
      </Modal>
    </div>
  );
}
