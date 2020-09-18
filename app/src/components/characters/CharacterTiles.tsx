import React from "react";
import NewContentTile from "../common/NewContentTile";
import { TileWrapper } from "../common/wrappers";
import { Row } from "react-bootstrap";

/**
 * Renders the character tiles
 * @param props
 */
function CharacterTiles(props: any) {
  const tiles: JSX.Element[] = [];

  props.contents.forEach((item: any) => {
    tiles.push(<CharacterTile item={item} key={item.id}/>);
  });

  if (props.includeNew === true) {
    tiles.push(<NewContentTile href="#">Character</NewContentTile>);
  }

  return (
    <Row>{tiles}</Row>
  );
}

/**
 * Renders a single character tile
 * @param props
 */
function CharacterTile(props: any) {
  return (
    <TileWrapper href="#">
      <h6>
        {props.item.name}
      </h6>
      <p>
        {props.item.game.length > 0 ? "From" : ""} { props.item.game }
      </p>
    </TileWrapper>
  );
}


export default CharacterTiles;
