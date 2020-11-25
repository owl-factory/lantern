import { Button, Card } from "react-bootstrap";
import Link from "next/link";
import { EntityTypeTable } from "./Table";
import { GameSystem } from "@reroll/model/dist/documents/GameSystem";
import { EntityType } from "@reroll/model/dist/documents";

interface EntityCardProps {
  gameSystem: GameSystem;
  entityTypes: EntityType[]; //EntityType[];
}

/**
 * Renders a card with a table for entities
 * @param props.gameSystem The game system of the entities to render
 * @param props.entities The array of entities to render into the card
 */
export function EntityTypeCard(props: EntityCardProps): JSX.Element {
  const gameSystemAlias = props.gameSystem.alias || props.gameSystem._id;

  return (
    <Card>
      <Card.Header>
        <>Entity Types</>
        <Link href={"/admin/game-systems/" + gameSystemAlias + "/entity-types/new"}  passHref>
          <Button size="sm" style={{float:"right"}}>Add Entity Type</Button>
        </Link>
        <Link href={"/admin/game-systems/" + gameSystemAlias + "/entity-types"}  passHref>
          <Button size="sm" style={{float:"right"}}>Search Entity Types</Button>
        </Link>
      </Card.Header>

      <Card.Body>
        <EntityTypeTable entityTypes={props.entityTypes} pageState={{page: 1, perPage: 10, totalCount: 10}}/>
      </Card.Body>
    </Card>
  );
}
