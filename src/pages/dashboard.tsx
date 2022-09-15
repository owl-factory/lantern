import { Page } from "components/design";
import Link from "next/link";
import React from "react";
import { Box, Button, Flex } from "@chakra-ui/react";
import { AlertController } from "@owl-factory/alerts";
import { Auth } from "controllers/auth";
import { signOut } from "utilities/auth";
import { observer } from "mobx-react-lite";

const Dashboard = observer(() => {
  const [ name, setName ] = React.useState("");

  // UseEffect prevents issue with hydration
  React.useEffect(() => {
    setName(Auth.user?.name || "");
  }, []);

  return (
    <Page>
      <h3>Welcome back {name}!</h3>

      <Button onClick={() => signOut()}>Log Out</Button>
      {/* Recent Games */}
      <RecentGames/>

      {/* Characters */}
      <h4>My Characters</h4>

      <h4>Temp Profile Stuff</h4>
      <Button onClick={() =>AlertController.success("Testing")}>Test Alerts</Button>
      <Button onClick={() => {console.log(Auth);}}>Test Auth</Button>
    </Page>
  );
});

export default Dashboard;

const RecentGames = observer(() => {

  const campaigns: JSX.Element[] = [];
  for (const ref of []) {
    const campaign = undefined;
    if (!campaign) { continue; }
    let src = "";
    if ((campaign as any).banner && (campaign as any).banner.src) { src = (campaign as any).banner.src; }
    campaigns.push(
      <Box key={(campaign as any).ref}>
        <Box>
          <img src={src}/>
          <h5>{(campaign as any).name}</h5>
          <Link href={`/campaigns/${(campaign as any).ref}`}>
            Visit
          </Link>
        </Box>
      </Box>
    );
  }

  return (
    <div>
      <h4>
        Recent Games
        <Link href="/campaigns/new" passHref>
          <Button className="float-end">
            Create New Game
          </Button>
        </Link>

        <Link href="/sst" passHref>
          <Button className="float-end">
            Server Side Props Test
          </Button>
        </Link>
      </h4>
      <br/>
      <Flex>
        {campaigns}
      </Flex>
    </div>
  );
});

// export async function getServerSideProps(ctx: NextPageContext) {
//   return await handleAPI(ctx, getDashboardPage);
// }
