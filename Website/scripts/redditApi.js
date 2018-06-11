const redditApiURL = 'https://www.reddit.com',
categoriesURL = '/subreddits/popular.json?limit=50',
articlesURL = 'hot.json'

const redditApi = {
  categories: function(callback) {
    ajax.get(redditApiURL + categoriesURL, callback)
  },
  loadArticles: function(category, callback) {
    const url = redditApiURL + category.url + articlesURL
    ajax.get(url, callback)
  }

}
