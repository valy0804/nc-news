const db = require("../db/connection");

const { checkArticleIdExists } = require("./articles.models");

exports.selectAllCommentsByArticleId = (article_id) => {
  return checkArticleIdExists(article_id)
    .then(() => {
      return db.query(
        `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
        [article_id]
      );
    })
    .then(({ rows }) => {
      return rows;
    });
};
