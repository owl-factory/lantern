import { Button } from "@owl-factory/components/button";
import { Card, CardBody, CardHeader } from "@owl-factory/components/card";
import { Modal } from "@owl-factory/components/modal";
import { observer } from "mobx-react-lite";
import React from "react";
import { MdClose } from "react-icons/md";
import { ImageDocument } from "types/documents";
import { ImageData } from "controllers/data/ImageData";

interface ImageDetailsModalProps {
  imageID: string;
  open: boolean
  handleClose: () => void;
}

/**
 * Renders a modal with the details of an image.
 * @param imageID The id of the image to fetch and render details for
 * @param handleClose Handles closing the modal
 */
function $ImageDetailsModal({ imageID, open, handleClose }: ImageDetailsModalProps): JSX.Element | null {
  const [ image, setImage ] = React.useState<Partial<ImageDocument>>({ ref: "" } as ImageDocument);



  // Ensures that this only runs when the imageID changes
  React.useEffect(() => {
    setImage(ImageData.get(imageID) || {});
  }, [ imageID, ImageData.lastTouched ]);



  /**
   * Deletes a single image using the Image Manager and closes the modal
   */
  function deleteImage() {
    handleClose();
  }

  return (
    <Modal open={open} handleClose={handleClose}>
      <Card>
        <CardHeader>
          <b>{image.name}</b>
          <a href="#" className="clickable" style={{float: "right"}} onClick={handleClose}><MdClose  /></a>
        </CardHeader>
        <CardBody>
          <img style={{maxWidth: "100%"}} height="auto" src={image.src}/><br/>
          <Button onClick={deleteImage}>Delete</Button>
        </CardBody>
      </Card>
    </Modal>
  );
}

export const ImageDetailsModal = observer($ImageDetailsModal);
