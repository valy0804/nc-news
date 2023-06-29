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
  addComment,
} = require("./controllers/comments.controllers.js");

const app = express();

app.use(express.json());

app.get("/api/topics", getAllTopics);

app.get("/api", getApi);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getAllCommentsByArticleId);

app.post("/api/articles/:article_id/comments", addComment);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrors);

module.exports = app;
