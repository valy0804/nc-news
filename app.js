const express = require("express");

const { getAllTopics } = require("./controllers/topic.controllers.js");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors.js");

const app = express();

app.use(express.json());

app.get("/api/topics", getAllTopics);

app.get("/api");

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrors);

module.exports = app;
