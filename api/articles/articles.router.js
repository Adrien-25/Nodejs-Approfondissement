const express = require("express");
const ArticlesController = require("./articles.controller");
const router = express.Router();

router.post("/", ArticlesController.create);
router.put("/:id", ArticlesController.update);
router.delete("/:id", ArticlesController.delete);

module.exports = router;
