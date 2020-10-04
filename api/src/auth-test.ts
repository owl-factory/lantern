import { authenticate, parseToken } from "./utilities/auth";

exports.handler = async function(event, context, callback) {
  const token = parseToken(event.headers);
  const user = await authenticate(token);
  const isLoggedIn = !!user;
  callback(null, {
    statusCode: 200,
    body: JSON.stringify(user)
    });
}
