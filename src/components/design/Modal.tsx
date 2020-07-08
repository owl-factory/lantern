import React, { ReactNode } from "react";
import { Modal as BSModal } from "react-bootstrap";

// TODO - add flag for "You may have unsaved changes!" before closing

interface ModalProps {
  children?: ReactNode; // The children to place within the modal
  dirty?: boolean; // True if this modal has been touched
}

/**
 * Registers a new modal and an open function linked together, allowing for
 * multiple modals to be created and used without interfering with each other.
 */
function registerModal(): [(props: any) => (ReactNode | null), () => (void)] {
  const [open, setOpen] = React.useState(false);

  /**
   * Opens the modal
   */
  function handleOpen() {
    setOpen(true);
  }

  /**
   * Closes the modal
   */
  function handleClose(isDirty?: boolean) {
    if (isDirty === true) {
      if (!confirm("Are you sure you want to close? You might lose data?")) {
        return;
      }
    }
    setOpen(false);
  }

  /**
   * Renders a modal with the given settings and passed props
   * @param props.children The content of the modal to be ren
   * @param props.dirty Boolean if this modal has been touched
   */
  function Modal(props: ModalProps): JSX.Element | null {
    return (
        <BSModal
          show={open}
          onHide={handleClose}
        >
          {props.children}
        </BSModal>
    );
  }

  return [Modal, handleOpen];
}

export default registerModal;
