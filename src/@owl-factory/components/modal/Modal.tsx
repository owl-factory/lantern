import React, { ReactNode } from "react";
import dynamic from "next/dynamic";

// Ensures that there are no issues with using Bootstrap in the backend
const FrontendModal = dynamic(
  () => import('./FrontendModal'),
  { loading: () => <></>, ssr: false},
);

export interface ModalProps {
  children?: ReactNode; // The children to place within the modal
  open: boolean;
  handleClose: () => void;
}

/**
 * The base component for rendering a Bootstrap 5 Modal in a SSR environment
 *
 * @param props.children The contents of this modal
 * @param props.open Boolean. True if this modal should be open. False if closed
 * @param props.handleClose A function with the sole purpose setting the props.open value to false, closing the modal
 * @returns Returns a component that renders a modal when the open value is set to true
 */
export function Modal(props: ModalProps): JSX.Element {
  return (
    <FrontendModal {...props} />
  );
}
