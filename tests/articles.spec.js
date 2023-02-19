const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mongoose = require("mongoose");
const mockingoose = require("mockingoose");
const Article = require("../api/articles/articles.model");
const articlesService = require("../api/articles/articles.service");
const User = require("../api/users/users.model");
const usersService = require("../api/users/users.service");


describe("Tester API articles", () => {
    let token;
    const USER_ID = "63edf633c9903d78625f92a5";
    let createdArticle={id:""};

    const MOCK_ARTICLE_CREATED = {
        // createdArticleId: createdArticleId,
        title: "Test article",
        content: "This is a test article",
        user: USER_ID,
        status: "draft"
    };
    const updatedArticle = {
        title: "Nouveau titre",
        content: "Nouveau contenu",
        status: "draft"
    };

    beforeEach(() => {
        token = jwt.sign({ userId: USER_ID }, config.secretJwtToken);
        // const mockArticle = { MOCK_ARTICLE_CREATED };
        // mockingoose(Article).toReturn(mockArticle, "findByIdAndUpdate");
        // mockingoose(User).toReturn({USER_ID}, "getArticles");

        mockingoose(Article).toReturn(MOCK_ARTICLE_CREATED, "save");

        mockingoose(Article).toReturn(createdArticle._id, "findById");

        mockingoose(Article).toReturn((createdArticle._id,updatedArticle), "findByIdAndUpdate");
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
        //Modification
        const res = await request(app)
            .put(`/api/articles/${createdArticle._id}`)
            // .put(createdArticle)
            .set("x-access-token", token)
            .send(updatedArticle);
        expect(res.status).toBe(200);
        expect(res.body.title).toBe(updatedArticle.title);
        expect(res.body.content).toBe(updatedArticle.content);        
    });

    test("[Articles] delete artcile", async () => {
        const res = await request(app)
            .delete(`/api/articles/${createdArticleId}`)
            .set("x-access-token", token);
        expect(res.status).toBe(204);
    });

    afterAll(() => {
        mockingoose.resetAll();
    });
});