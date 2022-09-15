import { Modal, useDisclosure } from "@chakra-ui/react";
import { Button } from "@owl-factory/components/button";
import { Card, CardBody, CardHeader } from "@owl-factory/components/card";
import { observer } from "mobx-react-lite";
import React from "react";
import { MdClose } from "react-icons/md";
import { FileDocument } from "types/documents";

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
export function FileDetails(): JSX.Element {
  const [ image, setImage ] = React .useState<Partial<FileDocument>>({ ref: "" } as FileDocument);

  return (
    <Card>
      <CardHeader>
        <b>{image.name}</b>
        <a href="#" className="clickable" style={{float: "right"}}><MdClose  /></a>
      </CardHeader>
      <CardBody>
        <img style={{maxWidth: "100%"}} height="auto" src={image.src}/><br/>
        {/* <Button onClick={deleteImage}>Delete</Button> */}
      </CardBody>
    </Card>
  );
}

