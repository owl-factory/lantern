import { graphql } from "graphql";
import mongo from "mongoose";
import rootSchema from "../../models/schema";

const connectURL = process.env.MONGO_CONNECTION_STRING;
if (connectURL === undefined) {
  throw new Error("MONGO_CONNECTION_STRING is undefined");
}

mongo.connect(connectURL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})
.catch((err) => {
  throw new Error(err);
});

export default async function(req: any, res: any) {
  const query = req.body.query;

  const result = await graphql(rootSchema, query);
  res.status(200).json(result);
}
