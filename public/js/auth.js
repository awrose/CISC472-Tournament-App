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
            // Update the user's display name after successful registration
            var user = userCredential.user;

            //formsContainer.style.display = 'none';
            //profileContainer.style.display = 'block';

            return user.updateProfile({
                displayName: name
            }).then(() => {
                console.log('just updated the profile');
                handleUserState(user);
                //window.location.
            });

        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            // Handle the error as needed, perhaps show a message to the user
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
/*             var user = userCredential.user;
            if(!user.displayName){
                user.updateProfile({
                    displayName: regNameInput
                }).then(function(){
                    console.log('Display name updated succesfully');
                }).catch(function(error){
                    console.log('Error updating display name');
                })
            } */

            //document.getElementById('registerForm').reset();
            //document.getElementById('signInForm').reset();
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            // Handle the error as needed
        });
})

// Display Profile Function
function displayUserProfile(user) {
    const profileContainer = document.getElementById('profile-container');
    profileContainer.style.display = 'block';
    document.getElementById('user-name').textContent = user.displayName;
    document.getElementById('user-email').textContent = user.email;
}

// Log Out Function
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

// Authentication State Logic
firebase.auth().onAuthStateChanged(user => {
    handleUserState(user);
});

function handleUserState(user){
    const formsContainer = document.querySelector('.forms-container');
    const profileContainer = document.getElementById('profile-container');

    if (user && user.displayName) {
        displayUserProfile(user);
        console.log(user.displayName);
        formsContainer.style.display = 'none';
        profileContainer.style.display = 'block';
    } else {
        profileContainer.style.display = 'none';
        formsContainer.style.display = 'flex';
    }

}


