import { AppBar, Box, createMuiTheme, Tab, Tabs, Typography } from "@material-ui/core";
import React from "react";

function SheetTabs(props: any) {
  /** Theme object used by MaterialUI throughout the entire app. */
  const theme = createMuiTheme({

    palette: {
      primary: {
        main: "#62172D",
      },
      secondary: {
        main: "#215d6c",
      },
      type: "dark",
    },
  });

  const tabs: JSX.Element[] = [];
  for (let i = 0; i < props.tabs.length; i++) {
    tabs.push(
      <Tab
        label={props.tabs[i]}
        onClick={() => props.setState({tab: i})}
      />
      ,
    );
  }

  return (
    <div>
      <AppBar position="static">
        <Tabs value={props.state.tab} aria-label="simple tabs example">
          {tabs}
        </Tabs>
      </AppBar>
      <hr/>
    </div>
  );
}

export default SheetTabs;
