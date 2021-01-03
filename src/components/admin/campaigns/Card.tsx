import { Button, Card } from "react-bootstrap";
import Link from "next/link";
import { CampaignTable } from "./Table";
import { Campaign, GameSystem } from "../../../types/documents";

interface CampaignCardProps {
  gameSystem: GameSystem;
  campaigns: Campaign[]; // Campaign[];
}

/**
 * Renders out a card containing common links and table for campaigns
 * @param props.gameSystem The game system that the campaign card represents
 */
export function CampaignCard(props: CampaignCardProps): JSX.Element {
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
        <CampaignTable campaigns={props.campaigns} pageState={{page: 1, perPage: 10, totalCount: 10}}/>
      </Card.Body>
    </Card>
  );
}
