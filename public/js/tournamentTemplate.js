const db = firebase.firestore();
const user = firebase.auth().currentUser;

let userUid;
let userEmail;
let userDisplayName;

var editBtn = document.getElementById('editButton');

firebase.auth().onAuthStateChanged(function(user){
    if(user){
        console.log('user is signed in');
        userUid = user.uid;
        userEmail = user.email;
        userDisplayName = user.displayName;
    }else{
        sessionStorage.setItem('redirectTo', window.location.href);
        window.location.href = "../pages/logInSignUp.html"
        console.log('The user is not signed in');
    }
});

function getTournamentIdFromURL(){
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

const tournamentId = getTournamentIdFromURL();
console.log(tournamentId);

let latestBracketData = null;

/* function checkIfStartDate(startDate){
    const now = new Date();

    if(now >= startDate){
        //document.getElementById('bracket').style.display = 'block';
        document.getElementById('startTournament').style.display = 'none';
        document.getElementById('endTournament').style.display = 'block';

        clearInterval(interval);
    }
}

let interval; */

if(tournamentId){
    db.collection("tournaments").doc(tournamentId).onSnapshot(function(doc){

        if(doc.exists){
            var tournamentData = doc.data();

            setInterval(() => {
                const status = updateTournamentStatusOnTime(tournamentData);

                if(tournamentData.status !== status){
                    db.collection("tournaments").doc(tournamentId).update({status: status})
                }
            }, 60*1000);

                if(tournamentData.status === 'waiting'){
                    document.getElementById('startTournament').style.display = 'block';
                    document.getElementById('countdown').style.display = 'block';
                    document.getElementById('bracket').style.display = 'none';
                    document.getElementById('endTournament').style.display = 'none';
                    console.log('this tourney is waiting');
                }else if(tournamentData.status === 'in progress'){
                    document.getElementById('startTournament').style.display = 'none';
                    document.getElementById('countdown').style.display = 'none';
                    document.getElementById('bracket').style.display = 'block';
                    document.getElementById('endTournament').style.display = 'block';
                const tournamentRef = db.collection("tournaments").doc(tournamentId);
    
  /*                   const unsubscribe = tournamentRef.onSnapshot(
                        (doc) => {
                            const data = doc.data();
                    
                            // Assuming 'renderBracket' is a function that displays the bracket on the page
                            renderBracket(data.bracket);
                        },
                        (error) => {
                            console.error("Error listening to real-time updates:", error);
                        }
                    );  */
                    console.log('this tournament is in progress')
                    
                }else if(tournamentData.status === 'closed'){
                    document.getElementById('startTournament').style.display = 'none';
                    document.getElementById('countdown').style.display = 'none';
                    document.getElementById('bracket').style.display = 'block';
                    document.getElementById('endTournament').style.display = 'none';
                    const tournamentRef = db.collection("tournaments").doc(tournamentId);
/*                      const unsubscribe = tournamentRef.onSnapshot(
                        (doc) => {
                            const data = doc.data();
                    
                            // Assuming 'renderBracket' is a function that displays the bracket on the page
                            renderBracket(data.bracket);
                        },
                        (error) => {
                            console.error("Error listening to real-time updates:", error);
                        }
                    );  */
                    
                    console.log('this tournament is closed');
                }

            const startTournamentElem = document.getElementById('startTournament');
            if(startTournamentElem){
                startTournamentElem.addEventListener('click', function(){
                    db.collection("tournaments").doc(tournamentId).update({
                        status: 'in progress'
                    })
                })
            }

            const endTournamentElem = document.getElementById('endTournament');
            if(endTournamentElem){
                endTournamentElem.addEventListener('click', function(){
                    //saveBracketToFirestore();
                    db.collection("tournaments").doc(tournamentId).update({
                        status: 'closed'
                    })
                })
            }

/*             const bracketContainer = document.querySelector('.bracket-container');
            if(bracketContainer){
                bracketContainer.addEventListener('click', (e) => {
                    if(e.target.classList.contains('participant')){
                        saveBracketToFirestore();
                    }
                })
            }  */



                console.log(tournamentData.registrants);
                // No bracket data found, create a new bracket
                let participantsInit = tournamentData.registrants.map(registrant => registrant.name);
                let normalizedParticipants = normalizeParticipants(participantsInit);
                let shuffledParticipants = shuffle(normalizedParticipants);
                createBracket(shuffledParticipants);
                //saveBracketToFirestore();
                // Save this new bracket to Firebase here, if necessary
            
/*             //if(tournamentData.bracket){
                console.log('bracket')
                //createBracketFromFirestoreData(tournamentData.bracket);
            //}else{
                let participantsInit = tournamentData.registrants.map(registrant => registrant.name);
                console.log(participantsInit);
                let normalizedParticipants = normalizeParticipants(participantsInit);
                let shuffledParticipants = shuffle(normalizedParticipants);
                createBracket(shuffledParticipants);
            //} */
            



            //=============================countdown==========================
            if(tournamentData.startDate){
                const startDate = new Date(tournamentData.startDate);
                function updateCountdown(){
                    const now = new Date();
                    const timeDiff = startDate - now;
    
                    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
                    document.getElementById("days").textContent = days;
                    document.getElementById("hours").textContent = hours;
                    document.getElementById("minutes").textContent = minutes;
                    document.getElementById("seconds").textContent = seconds;
                }
    
                updateCountdown();
                setInterval(updateCountdown, 1000);
            }
            
            //==========================header==========================================
            document.getElementById('tourneyNameInput').textContent = tournamentData.name;
            document.getElementById('organizerNameInput').textContent = tournamentData.createdBy.name;
            document.getElementById('tourneyDescriptInput').textContent = tournamentData.description;
            
            if(tournamentData.online){
                document.getElementById('location').textContent = "This tournament will be held online"
            }else{
                document.getElementById('location').textContent = "This tournament will be held in person/the location hasn\'t been set";
            }

            //=====================DETAILS===================================
            document.getElementById("gameInput").textContent = tournamentData.game;
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
            document.getElementById("startDateTimeInput").textContent = new Date(tournamentData.startDate).toLocaleDateString(undefined, options);
            
            
            if(tournamentData.entryFee){
                document.getElementById("entryFeeAmtInput").textContent = tournamentData.entryFeeAmt;
            }else{
                console.log('this tourney doesn\'t have an entry fee');
                document.getElementById("entryFee").style.display = 'none';
            }

            console.log('tourney rules' + tournamentData.rules);
            document.getElementById("tourneyRulesInput").textContent = tournamentData.rules;

            if(tournamentData.prizes){
                console.log('this tournament has PRIZES');
                document.getElementById("prizeDescriptionInput").textContent = tournamentData.prizesDescript;
            }else{
                console.log('this tourney does NOT have prizes');
                document.getElementById("prizes").style.display = 'none';
            } 

            if(tournamentData.streaming){
                document.getElementById("streamingServiceInput").textContent = tournamentData.streamingService;
                document.getElementById("streamingUserInput").textContent = tournamentData.streamingUser;
                document.getElementById("streamingLink").textContent = tournamentData.streamingLink;
            }else{
                document.getElementById("streaming").style.display = 'none';
            }

            const register = document.getElementById("registerButton");

            register.addEventListener("click", function(event){
                console.log('button was clicked');
                    const currentDoc = firebase.firestore().collection("tournaments").doc(tournamentId);
                    currentDoc.update({
                        registrants: firebase.firestore.FieldValue.arrayUnion({
                            uid: userUid,
                            name: userDisplayName,
                            email: userEmail
                        })
                    }).then(async () => {
                        const userTournamentsRef = db.collection("users").doc(userUid).collection('registeredTournaments')
                        await userTournamentsRef.add({
                            tournamentIds: firebase.firestore.FieldValue.arrayUnion(tournamentId)
                        })
                            alert("Success! You have been registered for the tournament!");
                    }).catch((err) => {
                            console.error("Error updating document: ", err);
                            alert("There was an error registering for the tournament please reach out to...");
                    })
                });

                firebase.auth().onAuthStateChanged(function(user){
                    if(user && tournamentData.createdBy.uid == userUid){
                        editBtn.style.display = 'block';

                        editBtn.addEventListener('click', function(event) {
                            event.preventDefault();
                             window.location.href = "/pages/dashboard.html?id=" + tournamentId;
                        });
                    }else{
                        editBtn.style.display = 'none';
                    }
                });

/*                 const tournamentRef = db.collection("tournaments").doc(tournamentId);
                tournamentRef.onSnapshot((doc) => {
                    const data = doc.data();
                    if (data.bracket) {
                        renderBracket(data.bracket); // Your bracket rendering function
                    }
                }); */
            
        }else{
            console.log("There is no tournament!");
        }
    })
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

let lastSelected = {}

function createBracket(participants) {
    const container = document.createElement('div');
    container.classList.add('bracket-container');

    const bracket = document.createElement('div');
    bracket.classList.add('bracket');

    container.appendChild(bracket);

    const totalRounds = Math.ceil(Math.log2(participants.length));

    let matchupsCount = participants.length / 2; // Starting matchups count for the first round

    let matchupCounter = 0;
    for (let i = 0; i < totalRounds; i++) {
        const round = document.createElement('section');
        round.classList.add('round', getRoundClass(i));

        for (let j = 0; j < matchupsCount; j++) {
            const winners = document.createElement('div');
            winners.classList.add('winners');

            // If it's the first round, use participant names. Otherwise, create empty boxes.
            const participant1Name = (i === 0 && j*2 < participants.length) ? participants[j*2] : null;
            const participant2Name = (i === 0 && (j*2)+1 < participants.length) ? participants[(j*2)+1] : null;

            const matchupId = `matchup-${matchupCounter++}`;
            const matchup = createMatchup(participant1Name, participant2Name, matchupId);
            
            winners.appendChild(matchup);
            round.appendChild(winners);
        }

        bracket.appendChild(round);

        matchupsCount /= 2;  // Halve the matchups for the next round
    }

    //document.body.appendChild(bracket);

    const winnerDisplay = document.createElement('div');
    winnerDisplay.id = 'winner-display';
    winnerDisplay.classList.add('winner-display');
    container.appendChild(winnerDisplay);

    //document.body.appendChild(container);

    const bracketDiv = document.getElementById('bracket');
    bracketDiv.appendChild(container);

    document.body.addEventListener('click', function(e) {
        console.log('a participant was clicked');
        let clickedParticipant;
    
        if (e.target.classList.contains('participant')) {
            clickedParticipant = e.target;
        } else if (e.target.parentElement.classList.contains('participant') && e.target.tagName === 'SPAN') {
            clickedParticipant = e.target.parentElement;
        }
    
        if (clickedParticipant) {
            const uniqueIdOfClicked = clickedParticipant.dataset.uniqueId;
            console.log('uniqueIdOfClicked' + uniqueIdOfClicked);
            const matchup = clickedParticipant.closest('.matchup');
    
            const nextRoundSpotForClicked = findNextRoundSpotPreviouslyOccupiedBy(clickedParticipant);
    
            if (nextRoundSpotForClicked) {
                console.log('nextRoundSpotForClicked');
                clickedParticipant.classList.remove('selected');
                nextRoundSpotForClicked.innerHTML = '';
            } else {
/*                 const nextSpot = findNextRoundSpotPreviouslyOccupiedBy(clickedParticipant);
                if (nextSpot) nextSpot.innerHTML = ''; */
    
                // Check if the other participant from the same matchup is in the next round
                const otherParticipant = Array.from(matchup.getElementsByClassName('participant')).find(p => p !== clickedParticipant);
                const nextSpotForOther = findNextRoundSpotPreviouslyOccupiedBy(otherParticipant);
                if (nextSpotForOther) {
                    otherParticipant.classList.remove('selected');  // Remove the selected class from the other participant
                    nextSpotForOther.innerHTML = '';
                }
    
                // Move the clicked participant to the next round
                if (moveToNextRound(clickedParticipant)) {
                    // If moveToNextRound is successful, remember the current selection
                    clickedParticipant.classList.add('selected');
                      // Add the selected class
                    console.log(clickedParticipant.id);
                    lastSelected[matchup] = clickedParticipant.id;
                    //saveBracketToFirestore();
                }
    
                // After moving to the next round, check if the participant is in the final round
                const currentRound = clickedParticipant.closest('.round');
                const nextRound = currentRound.nextElementSibling;
    
                if (!nextRound) {  // If there is no next round, it means the current round is the final round
                    const winnerDisplay = document.getElementById('winner-display');
                    winnerDisplay.innerHTML = `<span class="winner-name">${clickedParticipant.textContent}</span>`;
                }

                //saveBracketToFirestore();

                //document.getElementById("prizes").style.display = 'none';

            }
        }
    });
    
}

function transformFirestoreBracketDataToParticipantsArray(bracketData) {
    if (!bracketData) return [];

    const participants = [];
    Object.entries(bracketData).forEach(([roundIndex, roundData]) => {
        Object.values(roundData).forEach((matchup) => {
            // Push each participant's name based on their selected status
            const participant1 = matchup.participants[0];
            const participant2 = matchup.participants[1];
            
            if (participant1.isSelected) {
                participants.push(participant1.name);
            } else if (participant2 && participant2.isSelected) {
                participants.push(participant2.name);
            } else {
                participants.push(participant1.name); // Default to the first participant if neither is selected
                if (participant2) participants.push(participant2.name);
            }
        });
    });

    return participants;
}



function moveToNextRound(participant) {
    const nextRoundSpot = findNextAvailableRoundSpotFor(participant);
    if (nextRoundSpot && !nextRoundSpot.textContent.trim()) { // Check if the spot is empty
        nextRoundSpot.innerHTML = `<span>${participant.textContent}</span>`;
        console.log("Participant moved:", participant.textContent); // Add this log
        nextRoundSpot.dataset.uniqueId = participant.dataset.uniqueId;  // Copy the unique ID to the next round's div
        return true;
    }
    console.log("Failed to move participant:", participant.textContent); // Add this log
    return false;
}



function findNextAvailableRoundSpotFor(participant) {
    const currentRound = participant.closest('.round');
    
    if (!currentRound) {
        console.error("Participant is not within a round:", participant);
        return null;
    }

    const nextRound = currentRound.nextElementSibling;

    if (nextRound) {
        const currentMatchupIndex = Array.from(currentRound.getElementsByClassName('matchup')).findIndex(matchup => matchup.contains(participant));
        const correspondingMatchup = nextRound.getElementsByClassName('matchup')[Math.floor(currentMatchupIndex / 2)];
        const spot = currentMatchupIndex % 2 === 0 ? 
               correspondingMatchup.querySelector('.participants div:first-child:not(:has(span))') : 
               correspondingMatchup.querySelector('.participants div:last-child:not(:has(span))');
        
        console.log("Found next spot:", spot);
        return spot;
    }

    return null;
}





function findNextRoundSpotPreviouslyOccupiedBy(participant) {
    const uniqueId = participant.dataset.uniqueId;
    console.log('uniqueID' + uniqueId);
    const round = participant.closest('.round').nextElementSibling;
    if (round) {
        return Array.from(round.querySelectorAll('.matchup .participants div'))
            .find(div => div.dataset.uniqueId === uniqueId);
    }
    return null;
}


function createParticipantDiv(name, matchupId, position) {
    const participant = document.createElement('div');
    participant.classList.add('participant');
    
    // Giving the participant an ID based on its parent matchup's ID and its position ('a' or 'b')
    participant.id = `${matchupId}-participant-${position}`;

    participant.dataset.uniqueId = `${matchupId}-${name}`

    if (name) { // Check if name exists
        participant.innerHTML = `<span>${name}</span>`;
    }

    return participant;
}


function createMatchup(participant1Name, participant2Name, matchupId) {
    const matchup = document.createElement('div');
    matchup.classList.add('matchup');
    matchup.id = matchupId;
    
    const participantsDiv = document.createElement('div');
    participantsDiv.classList.add('participants');

    const participant1 = createParticipantDiv(participant1Name, matchupId, 'a');
    if (participantsProgress[participant1Name]) {
        moveToNextRound(participant1);
    }

    const participant2 = createParticipantDiv(participant2Name, matchupId, 'b');
    if (participantsProgress[participant2Name]) {
        moveToNextRound(participant2);
    }
    
    participantsDiv.appendChild(participant1);
    participantsDiv.appendChild(participant2);
    matchup.appendChild(participantsDiv);

    return matchup;
}





function getRoundClass(round) {
    return `round-${round}`;
}

function normalizeParticipants(participants) {
    let num = participants.length;
    let powerOf2 = 2;

    while (powerOf2 < num) {
        powerOf2 *= 2;
    }

    while (participants.length < powerOf2) {
        participants.push("Bye");  // Placeholder for a free pass to the next round
    }

    return participants;
}

function bracketToJSON() {
    const rounds = document.querySelectorAll('.bracket .round');
    const bracketJSON = {};

    rounds.forEach((round, roundIndex) => {
        bracketJSON[roundIndex] = {};
        const matchups = round.querySelectorAll('.matchup');
        matchups.forEach((matchup, matchupIndex) => {
            const participants = matchup.querySelectorAll('.participant');
            const matchupJSON = {
                participants: {},
                winner: null
            };

            participants.forEach((participant, participantIndex) => {
                const participantObj = {
                    id: participant.id,
                    name: participant.textContent.trim(),
                    isSelected: participant.classList.contains('selected')
                };
                matchupJSON.participants[participantIndex] = participantObj;

                if (participantObj.isSelected) {
                    matchupJSON.winner = participantObj.name;
                }
            });

            bracketJSON[roundIndex][matchupIndex] = matchupJSON;
        });
    });

    return bracketJSON;
}


function saveBracketToFirestore() {
    const bracketData = bracketToJSON();

    db.collection("tournaments").doc(tournamentId).update({
        bracket: bracketData
    })
    .then(() => {
        console.log("Bracket saved for tournament:", tournamentId);
    })
    .catch((error) => {
        console.error("Error saving bracket:", error);
    });
}

function updateTournamentStatusOnTime(tournamentData){
    const now = new Date();
    const startDate = new Date(tournamentData.startDate);

    if(now < startDate){
        return 'waiting'
    }else{
        return 'in progress'
    }
}



let participantsProgress = {};

