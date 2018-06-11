const htmlProvider = {
  toArticleHTML:   function (art, id) {
    let imgHTML = ''
    if (art.thumbnail == '' || art.thumbnail == 'self') imgHTML = ''
    else  imgHTML = '<img src="' + art.thumbnail + '" alt="">'

    return '<div class="article" id="'+ id +'">' +
    '<a target="_blank" href="' + art.url + '">' + imgHTML +
    '<div class="info"><h3 class="title">' + art.title + '</h3>' +
    '<h5 class="score">Score: ' + art.score + '</h5>' +
    '<h5 class="comments">Comments: ' + art.comments + '</h5></div></a>' +
    '</div>'
  },
  toCategoryHTML:   function (title, description, icon, id) {
    return '<div class="categ" id="'+id+'">' +
    '<img src="' + icon + '" alt="" class="logo" />' +
    '<h3 class="title">' + title + '</h3>' +
    '<h5 class="description">' + description + '</h5></div>'
  },
  toCategoryLinkHTML: function(title) {
    return "<li class='category'>" + title + "</li>"
  }
}
