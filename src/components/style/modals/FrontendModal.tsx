import React from "react";
import { Modal } from "bootstrap";
import { ModalProps } from "./Modal";

/**
 * The base component for rendering a Bootstrap 5 Modal.
 * NOTE: FRONT-END ONLY! Access through ./Modal.tsx
 * @param props.children The contents of this modal
 * @param props.open Boolean. True if this modal should be open. False if closed
 * @param props.handleClose A function with the sole purpose setting the props.open value to false, closing the modal
 * @returns Returns a component that renders a modal when the open value is set to true
 */
export default function FrontEndModal(props: ModalProps) {
  const ref = React.useRef<HTMLDivElement>();
  const modalElement = ref.current;

  // Adds the event listener to ensure that handleClose/open are kept in sync with the modal state
  modalElement?.addEventListener(
    "hidden.bs.modal",
    props.handleClose
  );

  // Ensures that the state of props.open affects the Bootstrap open/close state
  React.useEffect(() => {
    if (props.open) {
      const modal = new Modal(modalElement as (string | Element), {});
      modal.show();
    } else {
      const modal = Modal.getInstance(modalElement as (string | Element));
      modal?.hide();
    }
  }, [props.open]);

  return (
    <div ref={ref as React.Ref<HTMLDivElement>} className="modal" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          {props.children}
        </div>
      </div>
    </div>
  );
}

