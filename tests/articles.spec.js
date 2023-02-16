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
    // const USER_ID = "fake";
    const MOCK_ARTICLE_CREATED = {
        title: "Test article",
        content: "This is a test article",
        user: USER_ID,
        status: "draft"
    };
    const MOCK_DATA = [
        {
            _id: USER_ID,
            name: "fdp",
            email: "ntm@aa.net",
            password: "fdpntmfdpntm",
            role:"admin"
        },
    ];
    const MOCK_DATA_CREATED = {
        name: "test",
        email: "test@test.net",
        password: "azertyuiop",
        role:"admin"
      };

    beforeEach(() => {
        token = jwt.sign({ userId: USER_ID }, config.secretJwtToken);
        // mockingoose(Article).toReturn(MOCK_ARTICLE_CREATED, "find");
        // mockingoose(User).toReturn(MOCK_DATA, "find");
        // mockingoose(Article).toReturn(MOCK_ARTICLE_CREATED, "findByIdAndUpdate");
        // mockingoose(User).toReturn(MOCK_DATA_CREATED, "save");
        mockingoose(Article).toReturn(MOCK_ARTICLE_CREATED, "find");
        mockingoose(Article).toReturn(MOCK_ARTICLE_CREATED, "save");
      
        mockingoose(User).toReturn(MOCK_DATA, "find");
        mockingoose(User).toReturn(MOCK_DATA_CREATED, "save");
    });

    test("[Articles] Create article", async () => {
        const res = await request(app)
            .post("/api/articles")
            .send(MOCK_ARTICLE_CREATED)
            .set("x-access-token", token);
        expect(res.status).toBe(201);
        expect(res.body.title).toBe(MOCK_ARTICLE_CREATED.title);
        expect(res.body.content).toBe(MOCK_ARTICLE_CREATED.content);
        createdArticleId = res.body._id;
    });

    test("[Articles] Update article", async () => {
        const updatedArticle = {
            title: "Nouveau titre",
            content: "Nouveau contenu",
            user:"",
            status: "draft"
        };
        console.log(MOCK_ARTICLE_CREATED);
        console.log(updatedArticle);

        const res = await request(app)
            .put(`/api/articles/${createdArticleId}`)
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