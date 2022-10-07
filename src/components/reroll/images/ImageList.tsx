import { observer } from "mobx-react-lite";
import React from "react";
import { FileDocument } from "types/documents";
import style from "./ImageList.module.scss";
import { Box, Flex } from "@chakra-ui/react";
import { ListFormat } from "components/pages/library";



interface ImageThumbnailProps {
  image: Partial<FileDocument>;
  onClick: (image: Partial<FileDocument>) => void
}

/**
 * Renders an icon and name of an image
 * @param image The image document to render an icon for
 * @param onClick A function to run when clicked
 */
function ImageIcon({ image, onClick }: ImageThumbnailProps) {
  return (
    <Box>
      <div className={style.icon} onClick={() => {onClick(image);}}>
        <img style={{height: "auto", width: "auto"}} src={image.src}/>
        &nbsp;
        {image.name}
      </div>
      <hr/>
    </Box>
  );
}

/**
 * Renders a thumbnail and name of an image
 * @param image The image document to render a thumbnail for
 * @param onClick A function to run on click
 */
function ImageThumbnail({ image, onClick }: ImageThumbnailProps) {
  return (
    <Box>
      <Box onClick={() => {onClick(image);}}>
        <Box >
          {image.name} <br/>
          <img style={{maxWidth: "100%"}} height="auto" src={image.src}/>
        </Box>
      </Box>
    </Box>
  );
}

interface ImageListProps {
  listFormat: any;
  onClick: (image: Partial<FileDocument>) => void;
}

/**
 * Renders a list of images in one of two formats.
 * TODO - rename the dang formats to something you can understand xD
 * @param listFormat The method to list the images
 * @param onClick The action to run when the image tile is clicked
 * @returns Returns a list of images as either Icons or Thumbnails
 */
function $ImageList(props: ImageListProps): JSX.Element {
  const [ images, setImages ] = React.useState<Partial<FileDocument>[]>([]);

  const imageThumbnails: JSX.Element[] = [];
  const onClick = props.onClick === undefined ? (() => {return;}) : props.onClick;

  images.forEach((image: Partial<FileDocument>) => {
    if (!image) { return; }
    switch(props.listFormat) {
      // case ListFormat.Thumbnails:
      case undefined:
        imageThumbnails.push(<ImageThumbnail key={image.ref} image={image} onClick={onClick}/>);
        break;
      // case ListFormat.Icons:
      //   imageThumbnails.push(<ImageIcon key={image.ref} image={image} onClick={onClick}/>);
      //   break;
    }
  });
  return (
    <Flex>
      {imageThumbnails}
    </Flex>
  );
}

export const ImageList = observer($ImageList);
