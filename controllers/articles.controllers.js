const {
  selectArticleById,
  selectAllArticles,
  updateArticleVotesById,
} = require("../models/articles.models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  const { topic, sort_by, order } = req.query;
  selectAllArticles(topic, sort_by, order)
    .then((articles) => {
      const articlesWithCommentCount = articles.map((article) => {
        return {
          ...article,
          comment_count: article.comment_count || 0,
        };
      });
      res.status(200).send({ articles: articlesWithCommentCount });
    })
    .catch(next);
};

exports.editArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  if (typeof inc_votes !== "number") {
    return next({ status: 400, msg: "Bad request" });
  }

  updateArticleVotesById(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
