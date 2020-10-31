import { Card, Button } from "react-bootstrap";
import Link from "next/link";
import { GameSystem } from "@reroll/model/dist/documents/GameSystem";
import { CampaignTable } from "./Table";

interface CampaignCardProps {
  gameSystem: GameSystem;
  campaigns: any; // Campaign[];
}

/**
 * Renders out a card containing common links and table for campaigns
 * @param props.gameSystem The game system that the campaign card represents
 */
export function CampaignCard(props: CampaignCardProps) {
  const gameSystemAlias = props.gameSystem.alias || props.gameSystem._id;

  return (
    <Card>
      <Card.Header>
        <>Campaigns</>
        <Link href={`/admin/game-systems/${gameSystemAlias}/campaigns/new`} passHref>
          <Button size="sm" style={{float:"right"}}>Add Campaign</Button>
        </Link>

        <Link href={`/admin/game-systems/${gameSystemAlias}/campaigns`} passHref>
          <Button size="sm" style={{float:"right"}}>Search Campaigns</Button>
        </Link>
      </Card.Header>

      <Card.Body>
        <CampaignTable campaigns={props.campaigns} pageState={{page: 1, perPage: 10}}/>
      </Card.Body>
    </Card>
  );
}