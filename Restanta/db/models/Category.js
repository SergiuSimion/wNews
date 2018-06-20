function Category(name, description, url, bannerUrl, iconUrl) {
  return {
    name: name,
    description: description,
    url: url,
    bannerUrl: bannerUrl,
    iconUrl: iconUrl
  }
}
module.exports = {
  create: Category
}
