require("dotenv").config({
  path: require("path").resolve(__dirname, "../../server/.env")
});

const serverless = require("serverless-http");

const app = require("../../server/app");

module.exports.handler = serverless(app);