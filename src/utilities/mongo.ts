import { connect } from "mongoose";

global.fetch = require("cross-fetch");

/**
 * Sets up the database initially. Will only work for the backend. 
 */
export function databaseSetup() {
  const connectionString = process.env.MONGO_CONNECTION_STRING || "";

  if (connectionString === "") {
    throw Error("No Mongo Connection String supplied.");
  }

  connect(
    connectionString,
    {useNewUrlParser: true, useUnifiedTopology: true}
  );
}
