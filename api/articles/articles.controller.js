const NotFoundError = require("../../errors/not-found");
const UnauthorizedError = require("../../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const articlesService = require("./articles.service");
const usersService = require("../users/users.service");


class ArticlesController {
  async getById(req, res, next) {
    try {
      const id = req.params.id;
      const article = await articlesService.get(id);
      if (!article) {
        throw new NotFoundError();
      }
      res.json(article);
    } catch (err) {
      next(err);
    }
  }
  async create(req, res, next) {
    try {
      const decoded = jwt.verify(
        req.headers["x-access-token"],
        config.secretJwtToken
      );
      const userId = decoded.userId;
      const article = { ...req.body, user: userId };
      const createdArticle = await articlesService.create(article);
      req.io.emit("article:create", article);

      res.status(201).json(createdArticle);
    } catch (err) {
      next(err);
    }
  }
  async update(req, res, next) {
    try {
      const decoded = jwt.verify(
        req.headers["x-access-token"],
        config.secretJwtToken
      );
      const userId = decoded.userId;
      const id = req.params.id;
      const article = await articlesService.get(id);
      const user = await usersService.get(userId);
      if (user.role !== 'admin') {
        throw new UnauthorizedError();
      }
      if (!article) {
        throw new NotFoundError();
      }
      if (article.user.toString() !== userId && !req.user.isAdmin) {
        throw new UnauthorizedError();
      }
      const updatedArticle = await articlesService.update(id, req.body);
      req.io.emit("article:update", article);

      res.json(updatedArticle);
    } catch (err) {
      next(err);
    }
  }
  async delete(req, res, next) {
    try {
      const decoded = jwt.verify(
        req.headers["x-access-token"],
        config.secretJwtToken
      );
      const userId = decoded.userId;
      const id = req.params.id;
      const article = await articlesService.get(id);
      const user = await usersService.get(userId);
      if (user.role !== 'admin') {
        throw new UnauthorizedError();
      }
      if (!article) {
        throw new NotFoundError();
      }
      if (article.user.toString() !== userId && !req.user.isAdmin) {
        throw new UnauthorizedError();
      }
      await articlesService.delete(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ArticlesController();
