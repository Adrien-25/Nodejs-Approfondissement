const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mongoose = require("mongoose");
const mockingoose = require("mockingoose");
const Article = require("../api/articles/articles.model");
const articlesService = require("../api/articles/articles.service");
// const User = require("../api/users/users.model");
// const usersService = require("../api/users/users.service");

describe("Tester API articles", () => {
  let token;
  const USER_ID = "63edf633c9903d78625f92a5";
  const ARTICLE_ID = "64907801e3bf751663ff1b9d";

  const MOCK_ARTICLE_CREATED = {
    // createdArticleId: createdArticleId,
    title: "Test article",
    content: "This is a test article",
    user: USER_ID,
    status: "draft",
  };
  const MOCK_ARTICLE_UPDATED = {
    // _id:ARTICLE_ID,
    title: "Nouveau titre",
    content: "Nouveau contenu",
    status: "draft",
  };

  beforeEach(() => {
    token = jwt.sign({ userId: USER_ID }, config.secretJwtToken);
  });

  test("[Articles] Create article", async () => {
    const res = await request(app)
      .post("/api/articles")
      .send(MOCK_ARTICLE_CREATED)
      .set("x-access-token", token);
    // createdArticleId = res.body._id;
    createdArticle = res.body;
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(MOCK_ARTICLE_CREATED.title);
    expect(res.body.content).toBe(MOCK_ARTICLE_CREATED.content);
  });

  test("[Articles] Update article", async () => {
    jest
      .spyOn(Article, "findByIdAndUpdate")
      .mockResolvedValue(MOCK_ARTICLE_UPDATED);
    const updatedArticle = await articlesService.update(
      ARTICLE_ID,
      MOCK_ARTICLE_UPDATED
    );
    expect(updatedArticle).toEqual(MOCK_ARTICLE_UPDATED);
    jest.restoreAllMocks();
  });

  test("[Articles] Delete article", async () => {
    jest
      .spyOn(Article, "deleteOne")
      .mockResolvedValue(MOCK_ARTICLE_UPDATED);
    const deleteArticle = await articlesService.delete(
      ARTICLE_ID,
      MOCK_ARTICLE_UPDATED
    );
    expect(deleteArticle).toEqual(MOCK_ARTICLE_UPDATED);
    jest.restoreAllMocks();
  });

  afterAll(() => {
    mockingoose.resetAll();
  });
});
