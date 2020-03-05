import { buildSchema, graphql } from "graphql";

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const root = { hello: () => "Hello world!" };

export default function(req: any, res: any) {
  graphql(schema, "{ hello }", root).then((response) => {
    res.status(200).json(response);
  });
}
