import { defaultResponse, search } from "../base";
import contents from "./content.json";

export default function(req: any, res: any) {

  const response = search(contents, {});
  res.status(200).json(response);
}
