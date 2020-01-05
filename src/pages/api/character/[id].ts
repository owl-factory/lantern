import { defaultResponse, search } from "../base";
import characters from "./character.json";

export default function(req: any, res: any) {

  const response = search(characters, [{id: req.query.id}, {alias: req.query.id}], false);
  res.status(200).json(response);
}
