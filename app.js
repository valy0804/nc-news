const express = require("express");

const { getAllTopics } = require("./controllers/topic.controllers.js");
const { getApi } = require("./controllers/api.controllers.js");
const { handleCustomErrors, handleServerErrors } = require("./errors.js");

const app = express();

app.get("/api/topics", getAllTopics);

app.get("/api", getApi);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
