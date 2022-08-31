import { Page } from "components/design";
import { NextPageContext } from "next";
import Link from "next/link";
import React from "react";
import { rest } from "@owl-factory/https";
import { ImageSelectionWrapper } from "components/reroll/images/ImageSelectionWrapper";
import { CampaignDocument, FileDocument, UserDocument } from "types/documents";
import { observer } from "mobx-react-lite";
import { InitialProps } from "types/client";
import { AssetUploadSource } from "types/enums/files/createMethod";
import { Ref64 } from "@owl-factory/types";
import { CampaignData } from "controllers/data/CampaignData";
import { UserData } from "controllers/data/UserData";
import { getCampaignPage } from "src/pages/api/campaigns/[ref]";
import { handleAPI } from "@owl-factory/https";
import { getUniques } from "@owl-factory/utilities/arrays";

interface BannerProps {
  campaign: CampaignDocument;
  isOwner: boolean;
}

/**
 * Renders the campaign banner. Also renders the ability to set a new banner image, if the user is the owner
 * @param campaign The campaign document
 * @param setCampaign Function to set the campaign with a new campaign, if applicable
 * @param isOwner True if the current user is the owner. False otherwise.
 */
const Banner = observer(({ campaign, isOwner }: any) => {
  let image = <img src={campaign.banner.src}/>;

  if(isOwner) {
    /**
     * Wraps the function to set the campaign banner image to pass in the campaign
     * @param image The new image document to use as the banner image
     * @param method The method to set the new image
     */
    const onSubmit = async (newBanner: Partial<FileDocument>, method: AssetUploadSource) => {
      // TODO - Save banner
    };

    image = (
      <ImageSelectionWrapper onSubmit={onSubmit} >
        {image}
      </ImageSelectionWrapper>
    );
  }
  return image;
});

interface PlayerProps {
  campaign: Partial<CampaignDocument>;
  player: Partial<UserDocument>;
}

/**
 * Renders a single player for the campaign page.
 * @param campaign The current campaign being viewed
 * @param player A player for the current game
 */
const Player = observer((props: PlayerProps) => {
  return (
    <div>
      <img src={props.player?.avatar?.src} width="30px" height="30px"/>
      {props.player.name || props.player.username}&nbsp;
      {props.player.ref === props.campaign.ownedBy?.ref ? "(GM) ": ""}
      <Link href={`/profile/${props.player.username}`}><a>Profile</a></Link>
    </div>
  );
});

interface PlayersProps {
  campaign: Partial<CampaignDocument>;
  players: Partial<UserDocument>[];
}

/**
 * Renders the list of players in this campaign
 * @param campaign The current campaign
 */
const Players = observer(({ campaign, players }: PlayersProps) => {
  const playerElements: JSX.Element[] = [];
  players.forEach((player: Partial<UserDocument>) => {
    playerElements.push(
      <Player key={player.ref} campaign={campaign} player={player}/>
    );
  });

  return (
    <div>
      <h2>Players</h2>
      {playerElements}
    </div>
  );
});

interface CampaignViewProps extends InitialProps {
  campaign: CampaignDocument;
}

/**
 * Renders a single campaign and the information inside
 * @param campaign The campaign to view
 */
function CampaignView(props: CampaignViewProps): JSX.Element {
  if (!props.campaign) { console.log(props.campaign); return <Page>The campaign was not found.</Page>; }

  const [ campaign, setCampaign ] = React.useState<Partial<CampaignDocument>>(props.campaign);
  const [ players, setPlayers ] = React.useState<Partial<UserDocument>[]>([]);
  const [ isOwner ] = React.useState(calculateIfUserIsOwner());

  // Initializes the managers on page load
  React.useEffect(() => {
    CampaignData.set(props.campaign);

    const playerIDs: string[] = [];
    campaign.players?.forEach((player: { ref: Ref64 }) => {
      playerIDs.push(player.ref);
    });
    UserData.load(playerIDs);
  }, []);

  React.useEffect(() => {
    const playerRefs = getUniques(campaign.players, "ref");
    setPlayers(UserData.getMany(playerRefs));

  }, [UserData.lastTouched]);

  // Updates the campaign each time the campaign is updated
  React.useEffect(() => {
    const newCampaign = CampaignData.get(props.campaign.ref);
    if (newCampaign) { setCampaign(newCampaign); }
  }, [CampaignData.lastTouched]);

  /**
   * Determines if the current player is the owner of the profile page.
   * Required to catch issue where unlogged players would cause an issue with the logic
   * TODO - move elsewhere & make generic
   */
   function calculateIfUserIsOwner() {
    if (!props.session) { return false; }
    if (campaign.ownedBy && props.session.user.ref === campaign.ownedBy.ref) { return true; }
    return false;
  }

  if (!campaign) { return <Page>Error</Page>; }

  return (
    <Page>
      <Banner campaign={campaign} setCampaign={setCampaign} isOwner={isOwner}/>
      <h1>{campaign.name}</h1>
      <Players campaign={campaign} players={players}/>
    </Page>
  );
}

interface CampaignViewResponse {
  campaign: CampaignDocument;
}

export async function getServerSideProps(ctx: any) {
  return await handleAPI(ctx, getCampaignPage);
}

export default observer(CampaignView);
