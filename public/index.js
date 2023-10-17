let userUid;
let userEmail;
let userDisplayName;

firebase.auth().onAuthStateChanged(function(user){
    if(user){
        console.log('user is signed in');
        userUid = user.uid;
        userEmail = user.email;
        userDisplayName = user.displayName || 'Nameless User';
    }else{
        sessionStorage.setItem('redirectTo', window.location.href);
        window.location.href = "pages/logInSignUp.html"
    }
});

const db = firebase.firestore();

function fetchTournaments(){
    const tournamentsRef = db.collection("tournaments");
    
    const tournamentsContainer = document.getElementById('tournamentsContainer');

    tournamentsRef.get().then((querySnapshot) => {
        if(!querySnapshot.empty){
            querySnapshot.forEach((doc) => {
                console.log(doc.id, "=>", doc.data());
                const tournamentData = doc.data();
                tournamentData.id = doc.id; 

                const block = createTournamentBlock(tournamentData);
                
                tournamentsContainer.appendChild(block);
            })
        }else{
            console.log("no public tournaments found");
        }
    }).catch((error) => {
        console.error("Error fetching public tournaments", error);
    })
}


function fetchTournamentDetails(tournamentId){
    return db.collection('tournaments').doc(tournamentId).get().then(doc => {
        if(doc.exists){
            const data = doc.data();
            data.id = doc.id;
            return data;
        }else{
            console.error(`Tournament with ID ${tournamentId} not found.`);
            return null;
        }
    }).catch(error => {
        console.error('Error fetching detials');
        return null; 
    })
}

function createTournamentBlock(tournamentData) {
    console.log(tournamentData.Id);
    const block = document.createElement('div');
    block.className = 'tournament-block';

    const title = document.createElement('h3');
    const titleLink = document.createElement('a');
    titleLink.href = `pages/tournament.html?id=${tournamentData.id}`; 
    titleLink.textContent = tournamentData.name;
    title.appendChild(titleLink);

    const description = document.createElement('p');
    description.textContent = tournamentData.description;

    const startDate = document.createElement('p');
    startDate.textContent = `Starts on: ${tournamentData.startDate}`;

    block.appendChild(title);
    block.appendChild(description);
    block.appendChild(startDate);

    return block;
}

fetchTournaments();