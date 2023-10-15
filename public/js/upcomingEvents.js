const db = firebase.firestore();

function fetchAndDisplayTournaments() {
    const userUid = firebase.auth().currentUser.uid;
    fetchTournamentsFromSubCollection(userUid, 'registeredTournaments', document.querySelector('#registered .tournaments'));
    fetchTournamentsFromSubCollection(userUid, 'createdTournaments', document.querySelector('#created .tournaments'));
}

function fetchTournamentsFromSubCollection(userUid, subCollectionName, container) {
    //console.log('fetching tournaments from sub collection');
    db.collection('users').doc(userUid).collection(subCollectionName).get()
        .then(querySnapshot => {
            const fetchPromises = [];

            querySnapshot.forEach(doc => {
                const randomUID = doc.id;
                //console.log(doc.data());
                const tournamentIds = doc.data().tournamentIds || [];
                //console.log(tournamentIds);
                tournamentIds.forEach(tournamentId => {
                    fetchPromises.push(fetchTournamentDetails(tournamentId));
                });
            });

            return Promise.all(fetchPromises);
        })
        .then(tournamentDetails => {
            tournamentDetails.forEach(details => {
                if (details) {
                    details.id = details.id;
                    container.appendChild(createTournamentBlock(details));
                }
            });
        })
        .catch(error => {
            console.error(`Error fetching tournaments from ${subCollectionName}:`, error);
        });
}



function fetchTournamentDetails(tournamentId) {
    return db.collection('tournaments').doc(tournamentId).get()
        .then(doc => {
            if (doc.exists) {
                const data = doc.data();
                data.id = doc.id;
                return data;
            } else {
                console.error(`Tournament with ID ${tournamentId} not found.`);
                return null;
            }
        })
        .catch(error => {
            console.error(`Error fetching details for tournament with ID ${tournamentId}:`, error);
            return null;
        });
}

function createTournamentBlock(tournamentData) {
    console.log(tournamentData.Id);
    const block = document.createElement('div');
    block.className = 'tournament-block';

    const title = document.createElement('h3');
    const titleLink = document.createElement('a');
    titleLink.href = `tournament.html?id=${tournamentData.id}`; // Adjust the link as needed
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

// Function to handle tab switching
function showTab(tabName) {
    const sections = document.querySelectorAll('.tournaments-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    document.getElementById(tabName).style.display = 'block';

    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });

    if (tabName === 'registered') {
        tabButtons[0].classList.add('active');
    } else if (tabName === 'created') {
        tabButtons[1].classList.add('active');
    }
}

// When Firebase auth state changes, fetch and display the tournaments if the user is signed in
firebase.auth().onAuthStateChanged(user => {
    if (user) fetchAndDisplayTournaments();
});

// Default tab display on load
document.addEventListener('DOMContentLoaded', function() {
    showTab('registered');
});
