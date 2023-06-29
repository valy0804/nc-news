const express = require("express");

const { getAllTopics } = require("./controllers/topic.controllers.js");
const { getApi } = require("./controllers/api.controllers.js");
const {
  handleCustomErrors,
  handleServerErrors,
  handlePsqlErrors,
} = require("./errors.js");
const {
  getArticleById,
  getAllArticles,
} = require("./controllers/articles.controllers.js");
const {
  getAllCommentsByArticleId,
} = require("./controllers/comments.controllers.js");

const app = express();

app.get("/api/topics", getAllTopics);

app.get("/api", getApi);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getAllCommentsByArticleId);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrors);

module.exports = app;
