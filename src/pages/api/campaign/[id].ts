import { defaultResponse, search } from "../base";
import campaigns from "./campaign.json";

export default function(req: any, res: any) {

  const response = search(campaigns, [{id: req.query.id}, {alias: req.query.id}], false);
  res.status(200).json(response);
}
