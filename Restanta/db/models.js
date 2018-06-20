const categoryModel = require('./models/Category')
const articleModel = require('./models/Article')
const optionModel = require('./models/Option')

module.exports = {
  createCategory: function(name, description, url, bannerUrl, iconUrl) {
    return categoryModel.create(name, description, url, bannerUrl, iconUrl)
  },
  createArticle: function(title, score, comments, url, thumbnail) {
    return articleModel.create(title, score, comments, url, thumbnail)
  },
  createOption: function(theme, refreshTime, userID) {
    return optionModel.create(theme, refreshTime, userID)
  }
}
