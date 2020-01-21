import { Card, CardContent, Grid, Typography } from "@material-ui/core";

/**
 * Renders the content tiles
 * @param props
 */
function CampaignTiles(props: any) {
  const tiles: JSX.Element[] = [];

  props.contents.forEach((item: any) => {
    tiles.push(<CampaignTile item={item}/>);
  });

  return (
    <Grid container>{tiles}</Grid>
  );
}

function CampaignTile(props: any) {
  return (
    <Grid item xl={2} lg={3} sm={4} xs={12}>
      <Card>
        <CardContent>
          <Typography variant="h6">
            {props.item.name}
          </Typography>
          <Typography variant="body1">
            Next Game: { (new Date).toString() }
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default CampaignTiles;
