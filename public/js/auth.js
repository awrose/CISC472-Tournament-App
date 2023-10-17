document.getElementById('registerForm').addEventListener('submit', function(e){
    e.preventDefault();

    let nameInput = document.getElementById('registerName');
    let emailInput = document.getElementById('registerEmail');
    let passwordInput = document.getElementById('registerPassword');

    let name = nameInput.value;
    let email = emailInput.value;
    let password = passwordInput.value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            var user = userCredential.user;
            return user.updateProfile({
                displayName: name
            }).then(() => {
                console.log('just updated the profile');
                handleUserState(user);
            });

        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
        });
})

document.getElementById('signInForm').addEventListener('submit', function(e){
    e.preventDefault();

    let emailInput = document.getElementById('loginEmail')
    let passwordInput = document.getElementById('loginPassword')

    const email = emailInput.value;
    const password = passwordInput.value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            userCredential.user.reload().then(() => {
                handleUserState(firebase.auth().currentUser)
            });
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
        });
})


function displayUserProfile(user) {
    const profileContainer = document.getElementById('profile-container');
    profileContainer.style.display = 'block';
    document.getElementById('user-name').textContent = user.displayName;
    document.getElementById('user-email').textContent = user.email;
}


function logOut() {
    firebase.auth().signOut();

    document.getElementById('registerForm').reset();
    document.getElementById('signInForm').reset();
}

document.getElementById('forgotPassword').addEventListener('click', function(event){
    event.preventDefault();

    const emailAddress = document.getElementById('loginEmail').value;
    if(!emailAddress){
        alert("Please enter your email address in the login form");
        return;
    }

    firebase.auth().sendPasswordResetEmail(emailAddress).then(function(){
        alert('password reset email sent! check your inbox');
    }).catch(function(err){
        var errorCode = err.code;
        var errorMessage = err.message;
        console.error('error sending pw reset email: ', errorMessage);
        alert("error sending password reset email. Please try again");
    })
})

firebase.auth().onAuthStateChanged(user => {
    handleUserState(user);
});

function handleUserState(user){
    console.log('handle user state called');
    const formsContainer = document.querySelector('.forms-container');
    const profileContainer = document.getElementById('profile-container');
    

    if (user && user.displayName) {
        console.log('user and user display name');
        const redirectURL = sessionStorage.getItem('redirectTo');

        if(redirectURL){
            sessionStorage.removeItem('redirectTo');
            window.location.href = redirectURL;
            return
        }
        displayUserProfile(user);
        console.log(user.displayName);
        formsContainer.style.display = 'none';
        profileContainer.style.display = 'block';
    } else {
        console.log('NO DISPLAY NAME');
        profileContainer.style.display = 'none';
        formsContainer.style.display = 'flex';
    }

}

