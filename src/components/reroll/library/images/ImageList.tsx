import { Col, Row } from "components/style";
import { Card, CardBody } from "components/style/card";
import { observer } from "mobx-react-lite";
import React from "react";
import { ImageDocument } from "types/documents";
import style from "./ImageList.module.scss";

export enum ListFormat {
  Thumbnails,
  Icons,
}

interface ImageThumbnailProps {
  image: ImageDocument;
  onClick: (image: ImageDocument) => void
}

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

export const ImageList = observer((props: any): JSX.Element => {
  const imageThumbnails: JSX.Element[] = [];

  const onClick = props.onClick === undefined ? (() => {return;}) : props.onClick;

  props.imageController.imageList.forEach((imageID: string) => {
    const image = props.imageController.images[imageID];
    if (!image) { return; }
    switch(props.listFormat) {
      case ListFormat.Thumbnails:
      case undefined:
        imageThumbnails.push(<ImageThumbnail key={image.id} image={image} onClick={onClick}/>);
        break;
      case ListFormat.Icons:
        imageThumbnails.push(<ImageIcon key={image.id} image={image} onClick={onClick}/>);
        break;
    }
  });
  return (
    <Row>
      {imageThumbnails}
    </Row>
  );
});
