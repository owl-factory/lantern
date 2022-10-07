import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { AssetUploadForm } from "components/reroll/assets/AssetUploadForm";
import React from "react";

interface UploadAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
}


/**
 * Renders a modal for uploading an asset
 * @param isOpen Boolean. True if the modal is open and should be rendered
 * @param onClose A function that closes the modal
 */
export function UploadAssetModal(props: UploadAssetModalProps) {
  return (

    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>
            Upload Files
            <ModalCloseButton/>
          </ModalHeader>
          <ModalBody>
            <AssetUploadForm/>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
}
