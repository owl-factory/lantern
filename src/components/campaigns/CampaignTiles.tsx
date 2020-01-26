import { Grid, Typography } from "@material-ui/core";
import NewContentTile from "../common/NewContentTile";
import { TileWrapper } from "../common/wrappers";

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
    const linkAddress: string = "/campaign/new/";
    tiles.push(<NewContentTile href={linkAddress}>Campaign</NewContentTile>);
  }

  return (
    <Grid container>{tiles}</Grid>
  );
}

/**
 * Renders a single campaign tile
 * @param props
 */
function CampaignTile(props: any) {
  const linkAddress: string = "/campaign/" + props.item.alias;
  return (
    <TileWrapper href={linkAddress}>
      <Typography variant="h6">
        {props.item.name}
      </Typography>
      <Typography variant="body1">
        Next Game: { (new Date).toString() }
      </Typography>
    </TileWrapper>
  );
}

export default CampaignTiles;
