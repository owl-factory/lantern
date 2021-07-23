
import { Button } from "components/style";
import React from "react";
import { ImageDocument } from "types/documents";
import { ImageController } from "client/library";
import { ImageDetailsModal, ImageList, ListFormat } from "components/reroll/library/images";
import { observer } from "mobx-react-lite";
import { ImageCreationFormModal } from "./forms/ImageCreationForm";

interface ImageListProps {
  imageController: ImageController;
  listFormat?: ListFormat;
}

/**
 * Renders the library list containing a user's images.
 * @param imageController The manager containing the images
 * @param listFormat The method by which the list is rendered.
 */
export const LibraryImageList = observer((props: ImageListProps): JSX.Element =>{
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
          imageController={props.imageController}
          onClick={(image: ImageDocument) => setImageDetailsModal(image.id as string)}
          listFormat={props.listFormat}
        />

      </div>
      <ImageDetailsModal
        imageController={props.imageController}
        imageID={imageDetailsModal}
        handleClose={closeImageDetailsModal}
      />
      <ImageCreationFormModal imageController={props.imageController} open={modal} handleClose={closeModal}/>
    </div>
  );
});
