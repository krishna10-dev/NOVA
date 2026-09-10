const serverless = require("serverless-http");
const app = require("../../server/app");

module.exports.handler = serverless(app, {
  request(req) {
    // Netlify passes: /.netlify/functions/api/auth/register
    // Express expects: /api/auth/register
    // So replace /.netlify/functions/api → /api
    req.url = req.url.replace(/^\/.netlify\/functions\/api/, "/api") || "/api";
  }
});