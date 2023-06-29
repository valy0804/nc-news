const { selectAllCommentsByArticleId } = require("../models/comments.models");

exports.getAllCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;
  const queries = [selectAllCommentsByArticleId(article_id, sort_by, order)];
  if (article_id) queries.push(selectAllCommentsByArticleId(article_id));

  Promise.all(queries)
    .then(([comments]) => {
      res.send({ comments });
    })
    .catch(next);
};
