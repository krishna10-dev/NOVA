const serverless = require("serverless-http");
const app = require("../../server/app");

module.exports.handler = serverless(app, {
  request(req) {
    // Netlify passes the full internal path like /.netlify/functions/api/auth/register
    // but Express routes are mounted at /api/auth/register
    // Strip the /.netlify/functions/api prefix so Express sees the correct path
    req.url = req.url.replace(/^\/.netlify\/functions\/api/, "") || "/";
  }
});