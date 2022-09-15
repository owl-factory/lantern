
import { Button } from "@owl-factory/components/button";
import React from "react";
import { FileDocument } from "types/documents";
import { ImageList, ListFormat } from "components/reroll/images";
import { ImageCreationForm } from "./forms/ImageCreationForm";
import { Modal } from "@chakra-ui/modal";
import { useDisclosure } from "@chakra-ui/react";

interface ImageListProps {
  listFormat?: ListFormat;
}

/**
 * Renders the library list containing a user's images.
 * @param listFormat The method by which the list is rendered.
 */
export function LibraryImageList(props: ImageListProps): JSX.Element {
  const createModal = useDisclosure();
  const detailModal = useDisclosure();

  const [ detailFile, setDetailFile ] = React.useState<any>(undefined);


  return (
    <div style={{marginTop: "20px"}}>
      <div>
        <h2>Images</h2>
        <Button type="button" onClick={createModal.onOpen}>+</Button>
        <ImageList
          onClick={(image: Partial<FileDocument>) => setDetailFile(image)}
          listFormat={props.listFormat || ListFormat.Icons}
        />

      </div>
      <Modal isOpen={detailModal.isOpen} onClose={detailModal.onClose}>
        {/* <FileDetails
          file={detailFile}
          handleClose={closeImageDetailsModal}
        /> */}
      </Modal>

      <Modal isOpen={createModal.isOpen} onClose={createModal.onClose}>
        <ImageCreationForm onSave={createModal.onClose}/>
      </Modal>
    </div>
  );
}
