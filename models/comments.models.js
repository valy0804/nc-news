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

exports.insertComment = (article_id, username, body) => {
  if (!body) {
    return Promise.reject({ status: 400, msg: "Missing data" });
  }
  return db
    .query(
      "INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;",
      [article_id, username, body]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeCommentById = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [
      comment_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return { status: 204, msg: "Comment deleted" };
      }
    });
};
