function Article(title, score, comments, url, thumbnail) {
  return {
    title: title,
    score: score,
    comments: comments,
    url: url,
    thumbnail: thumbnail
  }
}
module.exports = {
  create: Article
}
