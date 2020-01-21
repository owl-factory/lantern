import { Card, CardContent, Grid } from "@material-ui/core";
import Link from "next/link";

/**
 * A single tile inside of a row
 * @param props The children to render inside
 */
export function TileWrapper(props: any) {
  return (
    <Grid item xl={2} lg={3} md={4} sm={6} xs={12}>
      <CardWrapper href={props.href}>
        {props.children}
      </CardWrapper>
    </Grid>
  );
}

/**
 * A page-wide tile inside of a row
 * @param props The children to render inside
 */
export function FullWrapper(props: any) {
  return (
    <Grid item xs={12}>
      <CardWrapper href={props.href}>
        {props.children}
      </CardWrapper>
    </Grid>
  );
}

/**
 * An internal card wrapper that places contents within a standard card
 * @param props 
 */
function CardWrapper(props: any) {
  const cardWrapper = (
    <Card>
      <CardContent>
        {props.children}
      </CardContent>
    </Card>
  );

  if (props.href !== undefined) {
    return (
      <Link href={props.href} passHref>
        {cardWrapper}
      </Link>
    );
  }

  return cardWrapper;
}
