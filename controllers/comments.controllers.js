const {
  selectAllCommentsByArticleId,
  insertComment,
} = require("../models/comments.models");

const { checkIfUsernameExists } = require("../models/users.models");
const { checkArticleIdExists } = require("../models/articles.models");

exports.getAllCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  selectAllCommentsByArticleId(article_id)
    .then((comments) => {
      res.send({ comments });
    })
    .catch(next);
};

exports.addComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  const addCommentPromises = [];

  if (article_id) {
    addCommentPromises.push(checkArticleIdExists(article_id));
  }
  if (username) {
    addCommentPromises.push(checkIfUsernameExists(username));
  }

  Promise.all(addCommentPromises)
    .then(() => insertComment(article_id, username, body))
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
