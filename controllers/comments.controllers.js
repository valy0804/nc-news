const { selectAllCommentsByArticleId } = require("../models/comments.models");

exports.getAllCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  selectAllCommentsByArticleId(article_id)
    .then((comments) => {
      res.send({ comments });
    })
    .catch(next);
};
