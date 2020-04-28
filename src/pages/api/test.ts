export default function Test(req: any, res: any) {
  res.end(process.env.TEST);
}