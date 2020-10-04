import { Card, Button } from "react-bootstrap";
import Link from "next/link";
import { GameSystem } from "@reroll/model/dist/documents/GameSystem";
import { ContentTable } from "./Table";

interface ContentCardProps {
  gameSystem: GameSystem;
  content: any; //Content[];
}

/**
 * Renders a card containing the content table
 * 
 * @param props.gameSystem The game system this content belongs to
 * @param props.content The array of content to render out into a table
 */
export function ContentCard(props: ContentCardProps) {
  const gameSystemAlias = props.gameSystem.alias || props.gameSystem._id;

  return (
    <Card>
      <Card.Header>
        <>Content</>
        <Link href={`/admin/game-systems/${gameSystemAlias}/content/new`} passHref>
          <Button size="sm" style={{float:"right"}}>Add Content</Button>
        </Link>

        <Link href={`/admin/game-systems/${gameSystemAlias}/content`} passHref>
          <Button size="sm" style={{float:"right"}}>Search Content</Button>
        </Link>
      </Card.Header>

      <Card.Body>
        <ContentTable content={props.content} pageState={{page: 1, perPage: 10, totalCount: 10}}/>
      </Card.Body>
    </Card>
  );
}