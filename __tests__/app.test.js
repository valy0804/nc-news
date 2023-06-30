const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");
const data = require("../endpoints.json");
const comments = require("../db/data/test-data/comments");
const toBeSortedBy = require("jest-sorted");
beforeEach(() => {
  return seed(testData);
});
afterAll(() => {
  if (db.end) db.end();
});

describe("GET /api/topics", () => {
  test("200: should return an array of all the topics objects with slug and description properties", () => {
    const expectedTopics = [
      {
        description: "The man, the Mitch, the legend",
        slug: "mitch",
      },
      {
        description: "Not dogs",
        slug: "cats",
      },
      {
        description: "what books are made of",
        slug: "paper",
      },
    ];

    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toHaveLength(expectedTopics.length);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("description", expect.any(String));
        });
      });
  });
  test("404: responds with a not found message for an invalid endpoint", () => {
    return request(app).get("/api/banana").expect(404);
  });
});

describe("GET /api", () => {
  test(" should respond 200 and contents of endpoints.json", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(data);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200:  responds with a single article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: 1,
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
});

test("400: responds with an error when article_id is an invalid type", () => {
  return request(app)
    .get("/api/articles/banana")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request");
    });
});
test("404: responds with an error when article_id is valid, but not exists", () => {
  return request(app)
    .get("/api/articles/9999")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Article not found");
    });
});

describe("GET /api/articles", () => {
  test("200: should return an array of all the articles with comment_counts", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("comment_count", expect.any(String));
        });
      });
  });
  test("200: should sort articles by created_at in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        const sortedArticles = articles.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });
        expect(articles).toEqual(sortedArticles);
      });
  });

  test("404: responds with not found err when the endpoint is invalid", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with an array of comment objects for the given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(Array.isArray(comments)).toBe(true);
        expect(comments.length).toBe(11);
      });
  });

  test("status: 200 each comment has the properties which match comment columns", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        comments.forEach((comment) => {
          expect(comment.article_id).toBe(1);
          expect(comment).toMatchObject({
            article_id: 1,
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
          });
        });
      });
  });
});

test("200: responds with an empty array when article has no comments", () => {
  return request(app)
    .get("/api/articles/2/comments")
    .expect(200)
    .then(({ body }) => {
      expect(body.comments).toEqual([]);
    });
});

test("400: should respond with a bad request error if article_id is invalid", () => {
  return request(app)
    .get("/api/articles/banana/comments")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request");
    });
});
test("404: responds with an error if article_id doesn't exist", () => {
  return request(app)
    .get("/api/articles/9999/comments")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Article not found");
    });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: should responds with posted comment", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "butter_bridge",
        body: "This is a great article!",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toHaveProperty("comment_id");
        expect(body.comment.author).toBe("butter_bridge");
        expect(body.comment.body).toBe("This is a great article!");
      });
  });
  describe("POST /api/articles/:article_id/comments", () => {
    test("201: should respond with posted comment", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "butter_bridge",
          body: "This is a great article!",
        })
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toMatchObject({
            author: "butter_bridge",
            body: "This is a great article!",
          });
        });
    });
  });
  test("400: responds with an error when article id is in an invalid format", () => {
    return request(app)
      .post("/api/articles/banana/comments")
      .send({
        username: "butter_bridge",
        body: "This is a great article!",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: should inform the user that there are missing data in the request", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "butter_bridge",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Missing data");
      });
  });
  test("404: responds with an error when given an article_id that doesn’t exist", () => {
    return request(app)
      .post("/api/articles/9999/comments")
      .send({
        username: "butter_bridge",
        body: "This is a great article!",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
  test("404: responds with an error when username doesn’t exist", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "not_a_user",
        body: "This is a great article!",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid username");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: responds with a single article object", () => {
    return request(app)
      .patch("/api/articles/2")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: 2,
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: 1,
        });
      });
  });
  test(" 200: updates article object when increment the current article's vote property by 1", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.votes).toBe(1);
      });
  });

  test("status: 200 returns the original article object if votes are missing", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: 1,
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });
});
test("400: responds with an error for an invalid article_id", () => {
  return request(app)
    .patch("/api/articles/not-an-id")
    .send({ inc_votes: 1 })
    .expect(400)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Bad request");
    });
});

test("status: 404 responds with an error when given an article_id that doesn't exist", () => {
  return request(app)
    .patch("/api/articles/9999")
    .send({ inc_votes: 1 })
    .expect(404)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Article not found");
    });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: deletes the comment and responds with no content", () => {
    return request(app)
      .delete("/api/comments/9")
      .expect(204)
      .then((res) => {
        expect(res.body).toEqual({});
      });
  });
});
describe("GET /api/users", () => {
  test("200: should return an array of all the users objects with username, name, and avatar_url properties", () => {
    const expectedUsers = [
      {
        username: "butter_bridge",
        name: "jonny",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      },
      {
        username: "icellusedkars",
        name: "sam",
        avatar_url:
          "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
      },
      {
        username: "rogersop",
        name: "paul",
        avatar_url:
          "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
      },
      {
        username: "lurker",
        name: "do_nothing",
        avatar_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
      },
    ];

    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toHaveLength(expectedUsers.length);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles", () => {
  test("200: should return an array of articles with order by asc", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("comment_count", expect.any(String));
        });
      });
  });
});

test("200: should respond with an array of the articles filtered by a specific topic", () => {
  return request(app)
    .get("/api/articles?topic=mitch")
    .expect(200)
    .then(({ body: { articles } }) => {
      expect(Array.isArray(articles)).toBe(true);
      expect(articles[0].topic).toEqual("mitch");
    });
});

test("200: default sorted order is by created_at desc", () => {
  return request(app)
    .get("/api/articles?sort_by=created_at&order=desc")
    .expect(200)
    .then(({ body: { articles } }) => {
      console.log(articles);
      expect(articles).toBeSortedBy("created_at", {
        descending: true,
      });
    });
});

test("400: should return an error if an invalid sort_by parameter is given", () => {
  return request(app)
    .get("/api/articles?sort_by=invalid_parameter")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request");
    });
});
test("400: should return an error if an invalid order_by parameter is given", () => {
  return request(app)
    .get("/api/articles?order=invalid_parameter")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request");
    });
});
