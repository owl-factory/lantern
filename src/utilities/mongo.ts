import { connect } from "mongoose";

global.fetch = require("cross-fetch");

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