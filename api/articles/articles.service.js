const Article = require("./articles.model");

class ArticleService {
    create(data) {
        const article = new Article(data);
        return article.save();
    }
    get(id) {
        return Article.findById(id);
    }
    update(id, data) {
        return Article.findByIdAndUpdate(id, data, { new: true });
    }
    delete(id) {
        return Article.deleteOne({ _id: id });
    }
    getArticles(userId){
        return Article.find({ user: userId }).populate("user", "-password");
    }
}

module.exports = new ArticleService();
