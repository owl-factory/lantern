import { Page } from "components";
import { NextPageContext } from "next";
import { rest } from "utilities";


export default function InviteHandler(props: any) {
  console.log(props)
  function JoinSuccess () {
    if (props.data.newlyJoined) {
      return <>You have already joined this game.</>;
    } else {
      return <>You've joined this game! (TODO - get game!)</>;
    }
  }

  function JoinFail() {
    return <>This game may not exist or the code is invalid.</>;
  }

  return (
    <Page>
      { props.success ?
        <JoinSuccess/> : <JoinFail/>
      }<br/>
      Still in development
    </Page>
  )
}

InviteHandler.getInitialProps = async (ctx: NextPageContext) => {
  const res = await rest.patch(
    `/api/campaigns/${ctx.query.id}/invite`,
    { inviteKey: ctx.query.inviteKey }
  );

  return res;
};
