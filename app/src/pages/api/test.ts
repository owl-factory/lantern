import { buildFilters } from "../../server/utilities/resolverHelpers"

export default function Test(req: any, res: any) {
  let result = buildFilters({test: { eq: "b"}, blah: { gt: 4, lt: 18}, foo: {bar: { gte: 4}}})
  console.log(result);
  result = buildFilters({or: [{test: { eq: "b"}}]})
  console.log(result);
  return res.status(200).json({"Okay": "yes"})
}