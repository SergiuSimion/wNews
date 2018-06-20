(function() {
  const STORED_USER = "STORED_USER",
  socket = io.connect(''),
  signOut = document.getElementById('signOut'),
  menu = document.getElementsByClassName('menu')[0],
  connectedUser = document.getElementsByClassName('connectedUser')[0]

  connectedUser.addEventListener('click', toggleMenu)

  function toggleMenu() {
    const display = menu.style.display
    if (!display || display == 'none') menu.style.display = 'block'
    else menu.style.display = 'none'
  }

}())
