(function () {
  const STORED_USER = "STORED_USER",
  socket = io.connect(''),
  signIn = document.getElementById('signIn'),
  signUp = document.getElementById('signUp'),
  signOut = document.getElementById('signOut'),
  connectedUser = document.getElementsByClassName('connectedUser')[0],
  userLoggedIn = document.getElementsByClassName('loggedIn')[0],
  saveCategoriesBtn = document.getElementById('saveCategories'),
  saveMsg = document.getElementById('saveMsg'),
  pageTitle = document.getElementsByClassName('pageTitle')[0],
  myCategories = document.getElementsByClassName('myCategories')[0],
  cList = document.getElementsByClassName('cList')[0],
  selectedCategTitle = document.getElementById('selectedCategTitle'),
  news = document.getElementById('news'),
  storedUser = localStorage.getItem(STORED_USER)

  let allCategories = document.getElementById('allCategories'),
  me = null,
  popularCategories = null,
  selectedCategories = [],
  selectedCategory = null

  setEventListeners()
  authenticate()

  function setEventListeners() {
    signOut.addEventListener('click', logOut)
    saveCategoriesBtn.addEventListener('click', saveFavCategories)
  }

  function authenticate() {
    if (storedUser) {
      me = JSON.parse(storedUser)
      socket.emit('user login', me)
    }
  }

  socket.on('logged in', onLoggedIn);
  socket.on('saved categories', onSavedCategories)
  socket.on('request categories', onRequestCategories)
  socket.on('all categories', onAllCategories)
  socket.on('successfully saved', onSuccessfullySaved)
  socket.on('selected articles', onSelectedArticles)

  function onLoggedIn(data) {
    updateUser(data)
    showUserDetails()
  }

  function updateUser(data) {
    localStorage.setItem(STORED_USER, JSON.stringify(data));
    me = data
  }

  function showUserDetails() {
    signIn.style.display = 'none'
    signUp.style.display = 'none'
    userLoggedIn.style.display = 'block'
    connectedUser.innerHTML = 'Hello, ' + me.firstName + '!'
    pageTitle.style.display = 'block'
  }

  function onSavedCategories(categories) {
    myCategories.style.display = 'block'
    pageTitle.innerText = "Loading articles ..."
    selectedCategories = categories
    selectCategory = categories[0]
    var myCategsHtml = ""
    for (var i = 0; i < categories.length; i++) {
      myCategsHtml += htmlProvider.toCategoryLinkHTML(categories[i].name)
    }
    cList.innerHTML = myCategsHtml
    selectedCategTitle.innerText = selectCategory.name
    loadArticles(selectCategory)
    addCategoryListener()
  }

  function addCategoryListener() {
    const categoryElements = document.getElementsByClassName('category')
    for (var i = 0; i < categoryElements.length; i++) {
      const el = categoryElements[i]
      const selected = selectedCategories[i]
      el.addEventListener('click', () => {
        loadArticles(selected)
        selectedCategTitle.innerText = selected.name
      })
    }
  }

  function loadArticles(category) {
    redditApi.loadArticles(category, function(articles) {
      socket.emit('parse articles', articles)
    })
  }

  function onRequestCategories() {
    redditApi.categories(function(data) {
      socket.emit('parse categories', data)
    })
  }

  function onAllCategories(data) {
    popularCategories = data
    let categoriesHTML = ""
    data.map( (categ,idx) => categoriesHTML += htmlProvider.toCategoryHTML(categ.name, categ.description, categ.iconUrl, idx) )
    allCategories.innerHTML = "<h3 class='pageTitle'>Popular </h3>" + categoriesHTML
    saveCategoriesBtn.style.visibility = 'visible'

    const categElements = document.getElementsByClassName('categ')
    for (var i = 0; i < categElements.length; i++) {
      const el = categElements[i]
      el.addEventListener('click', () => selectCategory(el))
    }
  }

  function selectCategory(categoryElement) {
    const index = categoryElement.getAttribute('id')
    selectedCategories = selectedCategories.concat(popularCategories[index])
    categoryElement.style.background = 'rgba(0,0,0, 0.5)'
    categoryElement.style.color = 'teal'

    if (selectedCategories.length > 0) {
      saveCategoriesBtn.disabled = false
      saveCategoriesBtn.style.cursor = 'pointer'
      saveCategoriesBtn.style.color = '#fff'
      saveCategoriesBtn.style.borderColor = '#fff'
    }
  }

  function saveFavCategories() {
    const categoriesForUser = selectedCategories.map( c => {
      c.userID = me['_id']
      return c
    })
    socket.emit('save selected categories', categoriesForUser)
  }

  function onSuccessfullySaved() {
    saveMsg.style.display = 'block'
    pageTitle.innerText = "Loading articles ... "
    myCategories.style.display = 'block'
    const categories = document.getElementsByClassName('categ')
    for(var i = 0; i < categories.length; i++) {
      categories[i].style.display = 'none'
    }
    loadArticles(selectedCategories[0])

    setTimeout(() => {
      saveCategoriesBtn.style.display = 'none'
      saveMsg.style.display = 'none'
    }, 1000)
  }

  function onSelectedArticles(data) {
    let articlesHTML = ""
    data.map( (art, idx) => articlesHTML += htmlProvider.toArticleHTML(art, idx))
    pageTitle.style.display = 'none'
    news.style.display = 'block'
    news.innerHTML = articlesHTML
  }

  /* update on log out */
  function logOut() {
    localStorage.removeItem(STORED_USER)
    userLoggedIn.style.display = 'none'
    signIn.style.display = 'block'
    signUp.style.display = 'block'
    saveCategoriesBtn.style.display = "none"
    allCategories.style.display = "block"
    myCategories.style.display = "none"
    news.style.display = "none"
    news.innerHTML = ""
    cList.innerHTML = ""
    selectedCategories = []
    popularCategories = []
    me = null
  }

})();
