(function() {
  const STORED_USER = "STORED_USER",
  socket = io.connect(''),
  signOut = document.getElementById('signOut'),
  connectedUser = document.getElementsByClassName('connectedUser')[0],
  userLoggedIn = document.getElementsByClassName('loggedIn')[0],
  menu = document.getElementsByClassName('menu')[0],
  menuItems = document.getElementsByTagName('menuitem'),
  themes = document.getElementsByClassName('theme'),
  cList = document.getElementsByClassName('myCategories')[0],
  refreshTimeWrapper = document.getElementById('refreshTime'),
  addCategoryMenu = document.getElementById('addCategoryMenu'),
  addCategoryBtn = document.getElementById('addCategoryBtn'),
  categoryInput = document.getElementById('categoryInput'),
  saveOptions = document.getElementById('saveOptions'),
  removeCategories = document.getElementById('removeCategories'),
  saveMsg = document.getElementById('saveMsg'),
  storedUser = localStorage.getItem(STORED_USER)

  let myCategories = [],
      selectedCategories = [],
      themeSelected = '',
      refreshTimeValue = 1,
      me = null

  authenticate()
  setClickListeners()

  socket.on('user options', userOptions)
  socket.on('successfully saved', onOptionsSaved)

  function authenticate() {
    if (storedUser) {
      me = JSON.parse(storedUser)
      socket.emit('get options', me['_id'])
      userLoggedIn.style.display = 'block'
      connectedUser.innerHTML = me.firstName + " " + me.lastName
    }
  }

  function setClickListeners() {
    for (let i = 0; i < menuItems.length; i++) {
      const menuItem = menuItems[i]
      menuItem.addEventListener('click', () => showOptions(menuItem))
    }

    for (let i = 0; i < themes.length; i++) {
      const th = themes[i]
      th.addEventListener('click', () => previewBackground(th))
    }

    saveOptions.addEventListener('click', saveNewOptions)
    signOut.addEventListener('click', logOut)
  }

  function userOptions(data) {
    const myTheme = data.theme
    if (myTheme) {
      for(let i = 0; i < themes.length; i++) {
        const el = themes[i]
        el.checked = false
        if (el.getAttribute('value') == myTheme) {
          el.checked = true
          previewBackground(el)
        }
      }
    } else themes[0].checked = true

    myCategories = data.categories
    refreshTimeValue = data.refreshTime
  }

  function showOptions(el) {
    const type = el.getAttribute('value')
    el.className = "selected"
    switch (type) {
      case "theme":
        document.getElementsByClassName('colorThemes')[0].style.display = 'block'
        document.getElementsByClassName('chooseCategs')[0].style.display = 'none'
        document.getElementsByClassName('refresh')[0].style.display = 'none'
        addCategoryMenu.style.display = 'none'
        menuItems[1].className = ""
        menuItems[2].className = ""
        break;
      case "categories":
        document.getElementsByClassName('colorThemes')[0].style.display = 'none'
        document.getElementsByClassName('chooseCategs')[0].style.display = 'block'
        document.getElementsByClassName('refresh')[0].style.display = 'none'
        menuItems[0].className = ""
        menuItems[2].className = ""
        showCategories()
        break;
      case "refresh":
        document.getElementsByClassName('colorThemes')[0].style.display = 'none'
        document.getElementsByClassName('chooseCategs')[0].style.display = 'none'
        document.getElementsByClassName('refresh')[0].style.display = 'block'
        addCategoryMenu.style.display = 'none'
        menuItems[0].className = ""
        menuItems[1].className = ""
        showRefreshTime()
        break;
      default:
        break
    }
  }

  function previewBackground(el) {
    const selectedTheme = el.getAttribute('value')
    themeSelected = el.getAttribute('value')
    var mainBody = document.getElementsByClassName('mainBody')[0]
    mainBody.style.background = 'url(./images/' + selectedTheme +'.jpg)';

    if (selectedTheme == "bgr2" || selectedTheme == "bgr5" ) {
      mainBody.style.color = '#000';
    } else {
      mainBody.style.color = '#fff';
    }
  }

  function showCategories() {

    let categoriesHTML = ""
    myCategories.map( (categ,idx) => categoriesHTML += htmlProvider.toCategoryHTML(categ.name, categ.description, categ.iconUrl, idx) )
    cList.innerHTML = "<h3>Choose your categories:</h3>" + categoriesHTML

    setCategoriesClickListeners()

    addCategoryMenu.style.display = 'block'
    addCategoryBtn.addEventListener('click', addCategory)
  }

  function setCategoriesClickListeners() {
    const categElements = document.getElementsByClassName('categ')
    for (var i = 0; i < categElements.length; i++) {
      const el = categElements[i]
      el.addEventListener('click', () => selectCategory(el))
    }
  }

  function showRefreshTime() {
    refreshTimeWrapper.value = refreshTimeValue
    refreshTimeWrapper.addEventListener('change', () => {
      refreshTimeValue = refreshTimeWrapper.value
    })
  }

  function selectCategory(el) {
    el.setAttribute("selected", "true")
    el.style.background = 'rgba(0,0,0, 0.5)'
    const index = el.getAttribute('id')
    el.setAttribute("name", myCategories[index].name)
    selectedCategories = selectedCategories.concat(myCategories[index])
    if (selectedCategories.length > 0) {
      removeCategories.style.display = 'inline-block'
      removeCategories.addEventListener('click', removeSelectedCategories)
    }
  }

  function removeSelectedCategories() {
    const categElements = document.getElementsByClassName('categ')
    for (let i = 0; i < categElements.length; i++) {
      const el = categElements[i]
      setTimeout(function() {
        if (el.getAttribute("selected")) {
          const name = el.getAttribute('name')
          myCategories.find( (c,idx) => { if (c && c.name === name) myCategories.splice(idx,1) } );
          el.remove()
        }
      }, 1)
    }
    selectedCategories = []
    removeCategories.style.display = 'none'
  }

  function saveNewOptions() {
    let ec = []
    if (myCategories.length > 0) {
      ec = myCategories
    } else ec = ec.concat({userID: me['_id']})
    socket.emit('save selected categories', ec)
    socket.emit('save options', {theme: themeSelected, refreshTime: parseInt(refreshTimeValue), userID: me['_id']})
  }

  function onOptionsSaved() {
    saveMsg.style.display = 'inline-block'

    setTimeout(() => {
      saveMsg.style.display = 'none'
    }, 2000)
  }

  function addCategory() {
    const category = categoryInput.value
    if (category) {
      redditApi.about(category, (data) => {
        const details = JSON.parse(data).data
        const newCategory = {
          name: details['display_name'],
          description: details['public_description'],
          url: details['url'],
          bannerUrl: details['banner_img'],
          iconUrl: details['icon_img']
        }
        const categElements = document.getElementsByClassName('categ')
        cList.innerHTML += htmlProvider.toCategoryHTML(newCategory.name, newCategory.description, newCategory.iconUrl, categElements.length)
        myCategories = myCategories.concat(newCategory).map( c => {
          c.userID = me['_id']
          return c
        })
        setCategoriesClickListeners()
      })
      categoryInput.value = ""
    }
  }

  function logOut() {
    localStorage.removeItem(STORED_USER)
    window.location.href = '/'
  }
}())
