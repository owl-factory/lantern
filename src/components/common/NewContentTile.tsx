import { TileWrapper } from "../common/wrappers";

/**
 * Renders a single character tile
 * @param props
 */
function NewContentTile(props: any) {
  return (
    <TileWrapper href={props.href}>
      <h5>
        + New {props.children}
      </h5>
    </TileWrapper>
  );
}

export default NewContentTile;
