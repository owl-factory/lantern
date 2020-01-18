import { Card, CardContent, Grid } from "@material-ui/core";

function ContentTiles(props: any) {
  const tiles: JSX.Element[] = [];

  props.contents.forEach((item: any) => {
    tiles.push(
      <Grid item lg={2} md={3} sm={4} xs={12}>
        <Card>
          <CardContent>
            {item.name}
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
