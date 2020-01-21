import {  Grid, Typography } from "@material-ui/core";
import session from "../../pages/api/session.json";
import NewContentTile from "../common/NewContentTile";
import { TileWrapper } from "../common/wrappers";

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
    <Grid container>{tiles}</Grid>
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
      <Typography variant="h6">
        {props.item.name}
      </Typography>
      <Typography variant="body1">
        {props.item.game.length > 0 ? "From" : ""} { props.item.game }
      </Typography>
    </TileWrapper>
  );
}


export default CharacterTiles;
