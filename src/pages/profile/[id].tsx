import React from "react";
import { Page } from "components/design";
import { NextPageContext } from "next";
import { rest } from "utilities/request";

function RecentPlayer(props: any) {
  return (
    <div>
      <a href="#">
        <img width="30px" height="30px" src="https://s3.amazonaws.com/files.d20.io/images/124832205/XXjsKJx2fi9hi4NK8G3s-A/med.png?1587314227437&size=200x200"/>
        <span style={{paddingLeft: "10px"}}>Laura</span>
      </a>
    </div>
  );
}

export default function Profile(props: any): JSX.Element {
  if (!props.success) {
    console.error(404);
  }

  const myID = "295863299256353286";

  const [ user, setUser ] = React.useState(props.data.user);
  const joinDate = Intl.DateTimeFormat('en', {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(user.createdAt);
  return (
    <Page>
      <div className="row">
        <div className="col-12 col-md-4">
          <img src="https://s3.amazonaws.com/files.d20.io/images/124832205/XXjsKJx2fi9hi4NK8G3s-A/med.png?1587314227437&size=200x200"/>
          <hr/>
          <a href="#">View Your Private Messages</a><br/>
          <a href="#">Topics You Follow</a><br/>
          <a href="#">Give Gift Subscription</a><br/>
          <a href="#">View Wishlists</a><br/>
          <a href="#">View Marketplace Items</a><br/>
          <a href="#">View Topics</a><br/>
          <a href="#">View Replies</a><br/>
          <hr/>
          <h4>Recent Players</h4>
          <RecentPlayer/>
          ...
        </div>

        <div className="col-12 col-md-8">
          <h1>{user.displayName || user.username}</h1>
          <div>
            Member since {joinDate} |
            GM of 0 Games |
            0 hours played
          </div>
          <hr/>
          <span>Achievements</span>
          <div><i>None yet! Check back soon!</i></div>
          <hr/>
          <span>Bio</span>
          <div>{user.bio}</div>
          <hr/>
          <span>Enjoys Playing</span>
          <div>...</div>
          <hr/>
          <span>Actively Seeking Group For</span>
          <div>...</div>
          <hr/>
          { () => (
            user.id === myID ?
            <span>Player Directory</span> :
            null
          )}
        </div>
      </div>


    </Page>
  );
}

Profile.getInitialProps = async (ctx: NextPageContext) => {
  const result = await rest.get(`/api/profile/${ctx.query.id}`);
  return result;
};
