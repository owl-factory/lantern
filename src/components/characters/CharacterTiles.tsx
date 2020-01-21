import { Card, CardContent, Grid, Typography } from "@material-ui/core";

/**
 * Renders the content tiles
 * @param props
 */
function CharacterTiles(props: any) {
  const tiles: JSX.Element[] = [];

  props.contents.forEach((item: any) => {
    tiles.push(<CharacterTile item={item}/>);
  });

  return (
    <Grid container>{tiles}</Grid>
  );
}

function CharacterTile(props: any) {
  const linkAddress: string = "/user/" 
  return (
    <Grid item xl={2} lg={3} sm={4} xs={12}>
      <Card>
        <CardContent>
          <Typography variant="h6">
            {props.item.name}
          </Typography>
          <Typography variant="body1">
            {props.item.game.length > 0 ? "From" : ""} { props.item.game }
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default CharacterTiles;
