import { Card, CardContent, Grid, Typography } from "@material-ui/core";

/**
 * Renders the content tiles
 * @param props
 */
function ContentTiles(props: any) {
  const tiles: JSX.Element[] = [];

  props.contents.forEach((item: any) => {
    tiles.push(
      <Grid item xl={2} lg={3} sm={4} xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">
              {item.name}
            </Typography>
            <Typography variant="body1">
              Next Game: { (new Date).toString() }
            </Typography>
          </CardContent>
        </Card>
      </Grid>,
    );
  });

  return (
    <Grid container>{tiles}</Grid>
  );
}

export default ContentTiles;
