import session from "../../pages/api/session.json";
import NewContentTile from "../common/NewContentTile";
import { TileWrapper } from "../common/wrappers";
import { Container } from "react-bootstrap";

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
    const linkAddress: string = "/user/" + session.alias + "/character/new/";
    tiles.push(<NewContentTile href={linkAddress}>Character</NewContentTile>);
  }

  return (
    <Container>{tiles}</Container>
  );
}

/**
 * Renders a single character tile
 * @param props
 */
function CharacterTile(props: any) {
  const linkAddress: string = "/user/" + session.alias + "/character/" + props.item.alias;
  return (
    <TileWrapper href={linkAddress}>
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
