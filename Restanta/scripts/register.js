(function () {
    const socket = io.connect('');
    const submitBtn = document.getElementById('submitBtn'),
        firstName = document.getElementsByClassName('regFirstName')[0],
        lastName = document.getElementsByClassName('regLastName')[0],
        email = document.getElementsByClassName('regEmail')[0],
        userName = document.getElementsByClassName('regUserName')[0],
        userPass = document.getElementsByClassName('regUserPass')[0];

    submitBtn.addEventListener("click", submit);

    function submit() {
        const encryptedPass = md5(userPass.value);
        const user = {
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            userName: userName.value,
            userPass: encryptedPass
        };

        socket.emit('sign up', user);
        firstName.value = '';
        lastName.value = '';
        email.value = '';
        userName.value = '';
        userPass.value = '';
    }

    socket.on('userName already exists', function (err) {
        alert('Username already exists!');
    });

    socket.on('account created', function (ok) {
        window.location.href = '/login.html';
    });
})()