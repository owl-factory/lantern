import { Typography } from "@material-ui/core"
// import mongodb from "mongodb"
import * as React from "react"
import Page from "../components/Page"
// import { number } from "prop-types"

/**
 * Adds two numbers and returns the sum. A simple function for testing Jest
 * @param a A value to add
 * @param b A value to add
 */
export function testJest(a: number, b: number): number {
  return a + b;
}

/**
 * A playground for Laura's development so we don't bump into each other <3
 */
function LauraPlayground() {

  function init(): void {
    
  }

  function getAll() {
    // mongodb.
  }

  return (
    <Page>
      <Typography variant="h3" paragraph>
        Laura's Playground!
      </Typography>
      <Typography paragraph>
        Here's where Laura is going to be doing her testing. &lt;3
      </Typography>


    </Page>
  )
}

export default LauraPlayground;