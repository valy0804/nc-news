const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");
const data = require("../endpoints.json");

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
