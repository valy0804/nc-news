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

exports.selectAllArticles = () => {
  const articlesQuery = `
    SELECT
      a.article_id,
      a.title,
      a.topic,
      a.author,
      a.created_at,
      a.votes,
      a.article_img_url,
      COUNT(c.comment_id) AS comment_count
    FROM articles AS a
    LEFT JOIN comments AS c ON a.article_id = c.article_id
    GROUP BY a.article_id
    ORDER BY a.created_at DESC;
  `;

  return db.query(articlesQuery).then(({ rows }) => {
    return rows;
  });
};