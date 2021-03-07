// TODO - move this to Server

import { connect } from "mongoose";

global.fetch = require("cross-fetch");

/**
 * Sets up the database initially. Will only work for the backend. 
 */
export function databaseSetup(): void {
  const connectionString = process.env.MONGO_CONNECTION_STRING || "";

  if (connectionString === "") {
    throw Error("No Mongo Connection String supplied.");
  }

  connect(
    connectionString,
    {useNewUrlParser: true, useUnifiedTopology: true}
  );
}
