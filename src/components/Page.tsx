import { makeStyles } from "@material-ui/styles";
import React, { ReactNode } from "react";

interface PageProps {
  children: ReactNode;
}

const useStyles = makeStyles({
  mainMargins: {
    margin: 15,
  },
});

/**
 * The page component is used to wrap the content of a page to apply uniform
 * styling such as page margins.
 *
 * @param {ReactNode} children The child elements nested within this element.
 * These are passed automatically
 */
function Page(props: PageProps) {
  const classes = useStyles();
  return (
    <main className={classes.mainMargins}>
      {props.children}
    </main>
  );
}

export default Page;
