import { Box } from "@chakra-ui/react";
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
    <Box>
      <Box>
        <b>{image.name}</b>
        <a href="#" className="clickable" style={{float: "right"}}><MdClose  /></a>
      </Box>
      <Box>
        <img style={{maxWidth: "100%"}} height="auto" src={image.src}/><br/>
        {/* <Button onClick={deleteImage}>Delete</Button> */}
      </Box>
    </Box>
  );
}

