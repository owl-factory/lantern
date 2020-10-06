import { Card, Button } from "react-bootstrap";
import Link from "next/link";
import { ContentTypeTable } from "./Table";
import { GameSystem } from "@reroll/model/dist/documents/GameSystem";

interface EntityCardProps {
  gameSystem: GameSystem;
  contentTypes: any; //EntityType[];
}

/**
 * Renders a card with a table for entities
 * @param props.gameSystem The game system of the entities to render
 * @param props.entities The array of entities to render into the card
 */
export function ContentTypeCard(props: EntityCardProps) {
  const gameSystemAlias = props.gameSystem.alias || props.gameSystem._id;

  return (
    <Card>
      <Card.Header>
        <>Content Types</>
        <Link href={"/admin/game-systems/" + gameSystemAlias + "/content-types/new"}  passHref>
          <Button size="sm" style={{float:"right"}}>Add Content Type</Button>
        </Link>
        <Link href={"/admin/game-systems/" + gameSystemAlias + "/content-types"}  passHref>
          <Button size="sm" style={{float:"right"}}>Search Content Types</Button>
        </Link>
      </Card.Header>

      <Card.Body>
        <ContentTypeTable contentTypes={props.contentTypes} pageState={{page: 1, perPage: 10, totalCount: 10}}/>
      </Card.Body>
    </Card>
  )
}