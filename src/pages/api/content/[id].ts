import { defaultResponse, search } from "../base";
import content from "./content.json";

export default function(req: any, res: any) {

  const response = search(content, [{id: req.query.id}, {alias: req.query.id}], false);
  res.status(200).json(response);
}
