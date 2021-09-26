
import { Button } from "components/style";
import React from "react";
import { ImageDocument } from "types/documents";
import { ImageDetailsModal, ImageList, ListFormat } from "components/reroll/library/images";
import { ImageCreationFormModal } from "./forms/ImageCreationForm";

interface ImageListProps {
  listFormat?: ListFormat;
}

/**
 * Renders the library list containing a user's images.
 * @param listFormat The method by which the list is rendered.
 */
export function LibraryImageList(props: ImageListProps): JSX.Element {
  const [ modal, setModal ] = React.useState(false);
  const [ imageDetailsModal, setImageDetailsModal ] = React.useState("");

  function closeModal() { setModal(false); }
  function closeImageDetailsModal() { setImageDetailsModal(""); }

  return (
    <div style={{marginTop: "20px"}}>
      <div>
        <h2>Images</h2>
        <Button type="button" onClick={() => setModal(true)}>+</Button>
        <ImageList
        onClick={(image: ImageDocument) => setImageDetailsModal(image.id as string)}
          listFormat={props.listFormat || ListFormat.Icons}
        />

      </div>
      <ImageDetailsModal
        open={imageDetailsModal !== ""}
        imageID={imageDetailsModal}
        handleClose={closeImageDetailsModal}
      />
      <ImageCreationFormModal open={modal} handleClose={closeModal}/>
    </div>
  );
}
