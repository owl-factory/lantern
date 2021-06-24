import { Page } from "components/design";
import { Button } from "components/style";
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
import { ImageManager } from "client/library";
import { CampaignDocument, ImageDocument } from "types/documents";

function Banner({ campaign, isOwner, setCampaign }: any) {
  const [ imageManager ] = React.useState(new ImageManager());
  let image = <img src={read<string>(campaign, "banner.src")}/>

  if(isOwner) {
    React.useEffect(() => {
      imageManager.fetchImages();
    }, []);

    const onSave = (result: unknown) => {
      const newCampaign = {...campaign, banner: (result as CampaignDocument).banner }
      setCampaign(newCampaign);
    }

    const onSubmit = async (image: ImageDocument, method: string) => {
      return imageManager.setCampaignBanner(campaign, image, method);
    }

    image = (
      <ImageSelectionWrapper imageManager={imageManager} onSubmit={onSubmit} onSave={onSave}>
        {image}
      </ImageSelectionWrapper>
    );
  }
  return image;
}

function Players({ campaign }: any) {
  const players: JSX.Element[] = [];
  const inviteAddress = `/campaigns/${router.query.id}/invite/${props.campaign.invitationAddress}`;
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
      <h2>Players</h2>
      {players}
      Invite By Link? {props.campaign.allowLinkInvitation ? "Enabled" : "Disabled"}<br/>
      <Button className="btn-sm" type="button" onClick={createInviteLink}>
        Create Invite
      </Button><br/>
      {props.campaign.allowLinkInvitation ?
        <Link href={inviteAddress}>{inviteAddress}</Link> : <></>
      }
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
      {/* <Players/> */}
    </Page>
  );
}

CampaignView.getInitialProps = async (ctx: NextPageContext) => {
  const session = getSession(ctx);
  if (!requireClientLogin(session, ctx)) { return {}; }

  const res = await rest.get(`/api/campaigns/${ctx.query.id}`);
  
  return { session, campaign: (res.data as any).campaign, error: res.message };
};
