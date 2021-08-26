import React from "react";
import { Modal } from "bootstrap";

export function setupModal(
  ref: React.MutableRefObject<string | Element | undefined>,
  options?: Partial<Modal.Options>
) {
  return {
    show: buildShowModal(ref, options),
    hide: buildHideModal(ref),
  };
}

export function buildShowModal(
  ref: React.MutableRefObject<string | Element | undefined>,
  options?: Partial<Modal.Options>
) {
  if (!options) {
    // TODO - set default options
  }

  return () => {
    const modalElement = ref.current;
    // console.log(modalElement)
    const modal = new Modal(modalElement as (string | Element), options);
    modal.show();
  };
}

export function buildHideModal(ref: React.MutableRefObject<string | Element | undefined>) {
  return () => {
    const modalElement = ref.current;
    const modal = Modal.getInstance(modalElement as (string | Element));
    modal?.hide();
  };
}
