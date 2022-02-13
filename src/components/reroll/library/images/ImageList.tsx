import { Col, Row } from "@owl-factory/components/flex";
import { Card, CardBody } from "@owl-factory/components/card";
import { observer } from "mobx-react-lite";
import React from "react";
import { ImageDocument } from "types/documents";
import style from "./ImageList.module.scss";
import { ImageCache } from "controllers/cache/ImageCache";

export enum ListFormat {
  Thumbnails,
  Icons,
}

interface ImageThumbnailProps {
  image: Partial<ImageDocument>;
  onClick: (image: Partial<ImageDocument>) => void
}

/**
 * Renders an icon and name of an image
 * @param image The image document to render an icon for
 * @param onClick A function to run when clicked
 */
function ImageIcon({ image, onClick }: ImageThumbnailProps) {
  return (
    <Col xs={12}>
      <div className={style.icon} onClick={() => {onClick(image);}}>
        <img style={{height: "auto", width: "auto"}} src={image.src}/>
        &nbsp;
        {image.name}
      </div>
      <hr/>
    </Col>
  );
}

/**
 * Renders a thumbnail and name of an image
 * @param image The image document to render a thumbnail for
 * @param onClick A function to run on click
 */
function ImageThumbnail({ image, onClick }: ImageThumbnailProps) {
  return (
    <Col xs={6} sm={4} md={3} lg={2}>
      <Card onClick={() => {onClick(image);}}>
        <CardBody >
          {image.name} <br/>
          <img style={{maxWidth: "100%"}} height="auto" src={image.src}/>
        </CardBody>
      </Card>
    </Col>
  );
}

interface ImageListProps {
  listFormat: ListFormat;
  onClick: (image: Partial<ImageDocument>) => void;
}

/**
 * Renders a list of images in one of two formats.
 * TODO - rename the dang formats to something you can understand xD
 * @param listFormat The method to list the images
 * @param onClick The action to run when the image tile is clicked
 * @returns Returns a list of images as either Icons or Thumbnails
 */
function $ImageList(props: ImageListProps): JSX.Element {
  const [ images, setImages ] = React.useState<Partial<ImageDocument>[]>([]);

  const imageThumbnails: JSX.Element[] = [];
  const onClick = props.onClick === undefined ? (() => {return;}) : props.onClick;

  // Updates the list of images when the image manager changes
  React.useEffect(() => {
    setImages(ImageCache.getPage());
  }, [ImageCache.lastTouched]);

  images.forEach((image: Partial<ImageDocument>) => {
    if (!image) { return; }
    switch(props.listFormat) {
      case ListFormat.Thumbnails:
      case undefined:
        imageThumbnails.push(<ImageThumbnail key={image.ref} image={image} onClick={onClick}/>);
        break;
      case ListFormat.Icons:
        imageThumbnails.push(<ImageIcon key={image.ref} image={image} onClick={onClick}/>);
        break;
    }
  });
  return (
    <Row>
      {imageThumbnails}
    </Row>
  );
}

export const ImageList = observer($ImageList);
