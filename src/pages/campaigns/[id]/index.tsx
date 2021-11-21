import { Page } from "components/design";
import { NextPageContext } from "next";
import Link from "next/link";
import React from "react";
import { getSession, requireClientLogin } from "utilities/auth";
import { rest } from "utilities/request";
import { ImageSelectionWrapper } from "components/reroll/library/images/ImageSelectionWrapper";
import { CampaignDocument, ImageDocument, UserDocument } from "types/documents";
import { ImageManager } from "controllers/data/image";
import { observer } from "mobx-react-lite";
import { InitialProps } from "types/client";
import { AssetUploadSource } from "types/enums/assetSource";
import { CampaignDataController, CampaignManager } from "controllers/data/campaign";
import { UserController, UserManager } from "controllers/data/user";
import { Ref64 } from "types";

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
    const onSubmit = async (newBanner: Partial<ImageDocument>, method: AssetUploadSource) => {
      // TODO - Save banner
      const result = CampaignDataController.updateBanner(campaign.ref, newBanner, method);
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
  campaign: CampaignDocument;
  player: UserDocument;
}

/**
 * Renders a single player for the campaign page.
 * @param campaign The current campaign being viewed
 * @param player A player for the current game
 */
const Player = observer((props: PlayerProps) => {
  const [ avatar, setAvatar ] = React.useState(props.player?.avatar.src);

  return (
    <div>
      <img src={props.player.avatar.src} width="30px" height="30px"/>
      {props.player.name || props.player.username}&nbsp;
      {props.player.ref === props.campaign.ownedBy?.ref ? "(GM) ": ""}
      <Link href={`/profile/${props.player.username}`}><a>Profile</a></Link>
    </div>
  );
});

interface PlayersProps {
  campaign: CampaignDocument;
  players: UserDocument[];
}

/**
 * Renders the list of players in this campaign
 * @param campaign The current campaign
 */
const Players = observer(({ campaign, players }: PlayersProps) => {
  const playerElements: JSX.Element[] = [];
  players.forEach((player: UserDocument) => {
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
  const [ campaign, setCampaign ] = React.useState(props.campaign);
  const [ players, setPlayers ] = React.useState<UserDocument[]>([]);
  const [ isOwner ] = React.useState(calculateIfUserIsOwner());

  // Initializes the managers on page load
  React.useEffect(() => {
    CampaignManager.load();
    ImageManager.load();
    UserManager.load();

    CampaignManager.set(props.campaign);

    const playerIDs: string[] = [];
    campaign.players?.forEach((player: { ref: Ref64 }) => {
      playerIDs.push(player.ref);
    });
    UserController.readMissing(playerIDs)
    .then(() => {
      const newPlayers = UserManager.getMany(playerIDs);
      setPlayers(newPlayers);
    });
  }, []);

  // Updates the campaign each time the campaign is updated
  React.useEffect(() => {
    const newCampaign = CampaignManager.get(props.campaign.ref);
    if (newCampaign) { setCampaign(newCampaign); }
  }, [CampaignManager.updatedAt, CampaignManager.get(props.campaign.ref)?.updatedAt]);

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

CampaignView.getInitialProps = async (ctx: NextPageContext) => {
  const session = getSession(ctx);
  if (!requireClientLogin(session, ctx)) { return {}; }

  const result = await rest.get<CampaignViewResponse>(`/api/campaigns/${ctx.query.id}`);

  return { key: ctx.query.id, session, campaign: result.data.campaign, message: result.message };
};

export default observer(CampaignView);
