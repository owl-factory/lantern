import React, { ReactNode } from "react";
import { Modal as BSModal } from "react-bootstrap";

interface ModalProps {
  children?: ReactNode; // The children to place within the modal
  open: boolean;
  handleClose: () => (void);
}

export function Modal(props: ModalProps) {
  return (
    <BSModal
      show={props.open}
      onHide={props.handleClose}
    >
      {props.children}
    </BSModal>
  );
}
export default Modal;
