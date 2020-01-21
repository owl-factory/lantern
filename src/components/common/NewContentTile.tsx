import { Typography } from "@material-ui/core";
import { TileWrapper } from "../common/wrappers";

/**
 * Renders a single character tile
 * @param props
 */
function NewContentTile(props: any) {
  return (
    <TileWrapper href={props.href}>
      <Typography variant="h5">
        + New {props.children}
      </Typography>
    </TileWrapper>
  );
}

export default NewContentTile;
