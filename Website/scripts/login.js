(function () {
  const socket = io.connect(''),
  STORED_USER = "STORED_USER";
  const loginBtn = document.getElementById('loginBtn'),
  userName = document.getElementsByClassName('loginUserName')[0],
  userPass = document.getElementsByClassName('loginUserPass')[0],
  loginForm = document.getElementsByClassName('loginForm')[0],
  connectedUser = document.getElementsByClassName('connectedUser')[0],
  userLoggedIn = document.getElementsByClassName('loggedIn')[0],
  loginErrorMessage = document.getElementsByClassName('loginErrorMessage')[0];

  loginBtn.addEventListener("click", submit);

  function submit() {
    const encryptedPass = md5(userPass.value)
    let user = {
      userName: userName.value,
      userPass: encryptedPass
    };

    /* send user name and pass */
    socket.emit('user login', user);
    /* receive "get options" (user options on connection successful) */
    userName.value = '';
    userPass.value = '';
  };

  socket.on('logged in', function (data) {
    localStorage.setItem(STORED_USER, JSON.stringify(data));
    window.location.href = '/';
  });

  socket.on('user not found', function () {
    userLoggedIn.style.display = 'none';
    loginForm.style.display = 'block';
    loginErrorMessage.style.display = 'block';
  });

})();
