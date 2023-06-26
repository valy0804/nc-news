const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");
//const connection = require("../db/connection");

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
        expect(body.topics).toMatchObject(expectedTopics);
      });
  });
  test("404: responds with a not found message for an invalid endpoint", () => {
    return request(app).get("/api/banana").expect(404);
  });
});
