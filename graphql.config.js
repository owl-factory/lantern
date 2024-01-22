// TODO make this work with .env file
const AUTH_TOKEN = "y2ui0ijv4i7o0n0dbpn54t09ib6j3rybpdfy9sz0";
module.exports = {
  schema: "http://localhost:3000/api/graphql",
  extensions: {
    endpoints: {
      default: {
        url: "http://localhost:3000/api/graphql",
        headers: { Authorization: AUTH_TOKEN },
      },
    },
  },
};
