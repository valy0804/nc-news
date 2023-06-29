const db = require("../db/connection");

exports.selectAllCommentsByArticleId = (
  article_id,
  sort_by = "created_at",
  order = "desc"
) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY ${sort_by} ${order}`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      } else return rows;
    });
};
