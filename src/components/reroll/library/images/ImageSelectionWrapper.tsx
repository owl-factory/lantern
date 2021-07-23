import { ImageController } from "client/library";
import { Modal } from "components/design";
import React from "react";
import { ImageDocument } from "types/documents";
import { ImageSelectionForm } from ".";
import style from "./ImageSelectionWrapper.module.scss";

interface ImageSelectionWrapperProps {
  children: JSX.Element;
  imageController: ImageController;
  onSubmit: (image: ImageDocument, method: string) => Promise<unknown>;
  onSave: (result: unknown) => void;
}

/**
 * Renders a clickable wrapper around an image that opens a modal with a list of methods to allow
 * changing the image.
 *
 * @param children The image to render
 * @param imageController The image manager containing our images and other information
 * @param onSubmit The action to run when the submit button is clicked
 * @param onSave The post-submit success action to run. This may be closing a modal, for example
 */
export function ImageSelectionWrapper({ children, imageController, onSubmit, onSave }: ImageSelectionWrapperProps) {
const [ modal, setModal ] = React.useState(false);

  function closeModal() { setModal(false); }
  function postSave(result: unknown) { onSave(result); closeModal(); }
  return (
    <div>
      <div className={`${style.profileImageWrapper}`} onClick={() => (setModal(true))}>
        <div className={`${style.profileHoverWrapper}`}>
          Change Image
        </div>
        {children}
      </div>
      <Modal open={modal} handleClose={closeModal}>
        <ImageSelectionForm imageController={imageController} onSubmit={onSubmit} onSave={postSave}/>
      </Modal>
    </div>
  )
}