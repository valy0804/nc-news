const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return result.rows[0];
    });
};
exports.selectAllArticles = (topic, sort_by = "created_at", order = "desc") => {
  const validSortBy = ["title", "article_id", "votes", "created_at", "topic"];
  const validTopics = ["mitch", "cats", "paper"];
  const validOrder = ["asc", "desc"];
  const values = [];

  if (!validTopics.includes(topic) && topic) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  if (!validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  if (!validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  let articlesQuery = `
    SELECT
      a.article_id,
      a.title,
      a.topic,
      a.author,
      a.created_at,
      a.votes,
      a.article_img_url,
      (
        SELECT COUNT(*)
        FROM comments AS c
        WHERE c.article_id = a.article_id
      ) AS comment_count
    FROM articles AS a`;

  if (topic) {
    articlesQuery += ` WHERE a.topic = $1`;
    values.push(topic);
  }

  articlesQuery += ` GROUP BY a.article_id ORDER BY ${sort_by} ${order}`;

  return db.query(articlesQuery, values).then(({ rows }) => {
    return rows;
  });
};

exports.checkArticleIdExists = (article_id) => {
  if (/\d+/.test(article_id)) {
    return db
      .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 404, msg: "Article not found" });
        } else return rows;
      });
  } else {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
};

exports.updateArticleVotesById = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles
      SET votes = votes + $1
      WHERE article_id = $2
      RETURNING *`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return rows[0];
    });
};
