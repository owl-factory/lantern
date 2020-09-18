import React from "react";
import NewContentTile from "../common/NewContentTile";
import { TileWrapper } from "../common/wrappers";
import { Row } from "react-bootstrap";

/**
 * Renders the campaign tiles
 * @param props
 */
function CampaignTiles(props: any) {
  const tiles: JSX.Element[] = [];

  props.contents.forEach((item: any) => {
    tiles.push(<CampaignTile key={item.id} item={item}/>);
  });

  if (props.includeNew === true) {
    tiles.push(<NewContentTile href="#">Campaign</NewContentTile>);
  }

  return (
    <Row>{tiles}</Row>
  );
}

/**
 * Renders a single campaign tile
 * @param props
 */
function CampaignTile(props: any) {
  return (
    <TileWrapper href="#">
      <h6>
        {props.item.name}
      </h6>
      <p>
        Next Game: { (new Date).toString() }
      </p>
    </TileWrapper>
  );
}

export default CampaignTiles;
