import { parse } from "cookie";
import { authenticate } from "./utilities/auth";

exports.handler = async function(event, context, callback) {
  const cookies = parse(event.headers.cookie);
  const user = authenticate(cookies.nf_jwt, cookies.nf_rft);
  const isLoggedIn = !!user;
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({cookies, user, isLoggedIn})
    });
}
