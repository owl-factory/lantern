import { search } from "../base";
import news from "./blog.json";

export default function getBlogPosts(req: any, res: any) {
  const response = search(news, {});
  res.status(200).json(response);
}
