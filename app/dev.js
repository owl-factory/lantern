const express = require('express')
const next = require('next')
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = next({dev: true});
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(createProxyMiddleware("/api", {target: "http://localhost:8888", pathRewrite: {"^/api": ""}}));
  server.all('*', (req, res) => {
      handle(req, res)
  });
  server.listen(3000, () => {
      console.log(`> Ready on http://localhost:3000`)
  });
}).catch(err => {
  console.log('An error occurred, unable to start the server');
  console.log(err);
});
