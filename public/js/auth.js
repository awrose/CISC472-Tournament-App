document.getElementById('registerForm').addEventListener('submit', function(e){
    e.preventDefault();

    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Update the user's display name after successful registration
            var user = userCredential.user;
            return user.updateProfile({
                displayName: name
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

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            // ...
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
}

// Authentication State Logic
firebase.auth().onAuthStateChanged(user => {
    const formsContainer = document.querySelector('.forms-container');
    const profileContainer = document.getElementById('profile-container');

    if (user) {
        displayUserProfile(user);
        formsContainer.style.display = 'none';
        profileContainer.style.display = 'block';
    } else {
        profileContainer.style.display = 'none';
        formsContainer.style.display = 'flex';
    }
});


