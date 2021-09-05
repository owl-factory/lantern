import { Page } from "components/design";
import { NextPageContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { getSession, requireClientLogin } from "utilities/auth";
import { getClient } from "utilities/db";
import { query as q } from "faunadb";
import { rest } from "utilities/request";
import { read } from "utilities/objects";
import { ImageSelectionWrapper } from "components/reroll/library/images/ImageSelectionWrapper";
import { ImageController } from "client/library";
import { CampaignDocument, ImageDocument } from "types/documents";
import { Tooltip } from "components/style/tooltips";

/**
 * Renders the campaign banner. Also renders the ability to set a new banner image, if the user is the owner
 * @param campaign The campaign document
 * @param setCampaign Function to set the campaign with a new campaign, if applicable
 * @param isOwner True if the current user is the owner. False otherwise. 
 */
function Banner({ campaign, isOwner, setCampaign }: any) {
  const [ imageController ] = React.useState(new ImageController());
  let image = <img src={read<string>(campaign, "banner.src")}/>

  if(isOwner) {
    React.useEffect(() => {
      imageController.fetchImages();
    }, []);

    /**
     * Handles the post-save then functionality after setting an image. 
     * @param result The result of the imageController set function
     */
    const onSave = (result: unknown) => {
      const newCampaign = {...campaign, banner: (result as CampaignDocument).banner }
      setCampaign(newCampaign);
    }

    /**
     * Wraps the function to set the campaign banner image to pass in the campaign
     * @param image The new image document to use as the banner image
     * @param method The method to set the new image
     */
    const onSubmit = async (image2: ImageDocument, method: string) => {
      return imageController.setCampaignBanner(campaign, image2, method);
    }

    image = (
      <ImageSelectionWrapper imageController={imageController} onSubmit={onSubmit} onSave={onSave}>
        {image}
      </ImageSelectionWrapper>
    );
  }
  return image;
}

/**
 * Renders the list of players in this campaign
 * @param campaign The current campaign
 */
function Players({ campaign }: any) {
  const players: JSX.Element[] = [];
  campaign.players.forEach((player: any) => {
    players.push(
      <div key={player.id}>
        {player.name || player.username}&nbsp;
        {player.id === campaign.ownedBy.id ? "(GM) " : ""}
        <Link href={`/profile/${player.username}`}>Profile</Link>
      </div>
    );
  });
  return (
    <div>
      <Tooltip title="Hi there">
      <h2>Players</h2>
      </Tooltip>
      {players}
    </div>
  );
}

/**
 * Renders a single campaign and the information inside
 * @param props 
 */
export default function CampaignView(props: any): JSX.Element {
  if (!props.campaign) { return <Page error={props.error}>Error</Page>; }
  const [ campaign, setCampaign ] = React.useState(props.campaign);
  const [ isOwner ] = React.useState(calculateIfUserIsOwner());
  const router = useRouter();
  const client = getClient();

  let src = "";
  if (campaign.banner && campaign.banner.src) { src = campaign.banner.src; }

  function createInviteLink() {
    const inviteKey = "testAddress";
    client.query(
      q.Call(
        `create_campaign_invite`,
        [ props.campaign.id, inviteKey ]
      )
    ).then((res) => {
      console.log("tmp")
    });
  }

  /**
   * Determines if the current player is the owner of the profile page.
   * Required to catch issue where unlogged players would cause an issue with the logic
   */
   function calculateIfUserIsOwner() {
    if (!props.session) { return false; }
    if (props.session.user.id === campaign.ownedBy.id) { return true; }
    return false;
  }

  return (
    <Page error={props.error}>
      <Banner campaign={campaign} setCampaign={setCampaign} isOwner={isOwner}/>
      <h1>{campaign.name}</h1>
      <Players campaign={campaign}/>
    </Page>
  );
}

CampaignView.getInitialProps = async (ctx: NextPageContext) => {
  const session = getSession(ctx);
  if (!requireClientLogin(session, ctx)) { return {}; }

  const res = await rest.get(`/api/campaigns/${ctx.query.id}`);

  return { session, campaign: (res.data as any).campaign, error: res.message };
};
