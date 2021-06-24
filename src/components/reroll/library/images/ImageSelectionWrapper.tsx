import { Modal } from "components/design";
import React from "react";
import { ImageSelectionForm } from ".";
import style from "./ImageSelectionWrapper.module.scss";


export function ImageSelectionWrapper({ children, imageManager, onSubmit, onSave }: any) {
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
        <ImageSelectionForm imageManager={imageManager} onSubmit={onSubmit} onSave={postSave}/>
      </Modal>
    </div>
  )
}