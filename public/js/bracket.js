const db = firebase.firestore();

const participants = ["Uno", "Dos", "Tres", "Cuatro", "cinco", "seis", "siete", "ocho"]; // This list can be of any length

function createBracket(participants) {
    const container = document.createElement('div');
    container.classList.add('bracket-container');

    const bracket = document.createElement('div');
    bracket.classList.add('bracket');

    container.appendChild(bracket);

    const totalRounds = Math.ceil(Math.log2(participants.length));

    let matchupsCount = participants.length / 2; // Starting matchups count for the first round

    for (let i = 0; i < totalRounds; i++) {
        const round = document.createElement('section');
        round.classList.add('round', getRoundClass(i));

        for (let j = 0; j < matchupsCount; j++) {
            const winners = document.createElement('div');
            winners.classList.add('winners');

            // If it's the first round, use participant names. Otherwise, create empty boxes.
            const participant1Name = (i === 0 && j*2 < participants.length) ? participants[j*2] : null;
            const participant2Name = (i === 0 && (j*2)+1 < participants.length) ? participants[(j*2)+1] : null;

            const matchupId = `round-${i}-matchup-${j/2}`;
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

    document.body.appendChild(container);
}

let lastSelected = {};

document.body.addEventListener('click', function(e) {
    console.log('a participant was clicked');
    let clickedParticipant;

    if (e.target.classList.contains('participant')) {
        clickedParticipant = e.target;
    } else if (e.target.parentElement.classList.contains('participant') && e.target.tagName === 'SPAN') {
        clickedParticipant = e.target.parentElement;
    }

    if (clickedParticipant) {
        const matchup = clickedParticipant.closest('.matchup');

        const nextRoundSpotForClicked = findNextRoundSpotPreviouslyOccupiedBy(clickedParticipant);

        if (nextRoundSpotForClicked) {
            // The clicked participant is already in the next round. Revert.
            clickedParticipant.classList.remove('selected');  // Remove the selected class
            nextRoundSpotForClicked.innerHTML = '';
        } else {
            // The clicked participant is not in the next round. Move them.

            // Clear potential existing spot in the next round for the clicked participant
            const nextSpot = findNextRoundSpotPreviouslyOccupiedBy(clickedParticipant);
            if (nextSpot) nextSpot.innerHTML = '';

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
                clickedParticipant.classList.add('selected');  // Add the selected class
                lastSelected[matchup] = clickedParticipant;
            }

            // After moving to the next round, check if the participant is in the final round
            const currentRound = clickedParticipant.closest('.round');
            const nextRound = currentRound.nextElementSibling;

            if (!nextRound) {  // If there is no next round, it means the current round is the final round
                const winnerDisplay = document.getElementById('winner-display');
                winnerDisplay.innerHTML = `<span class="winner-name">${clickedParticipant.textContent}</span>`;
            }
        }
    }
});


function moveToNextRound(participant) {
    const nextRoundSpot = findNextAvailableRoundSpotFor(participant);
    if (nextRoundSpot && !nextRoundSpot.textContent.trim()) { // Check if the spot is empty
        nextRoundSpot.innerHTML = `<span>${participant.textContent}</span>`;
        return true;
    }
    return false;
}



function findNextAvailableRoundSpotFor(participant) {
    const currentRound = participant.closest('.round');
    const nextRound = currentRound.nextElementSibling;

    if (nextRound) {
        // Find out the index of the current matchup
        const currentMatchupIndex = Array.from(currentRound.getElementsByClassName('matchup')).findIndex(matchup => matchup.contains(participant));

        // Find the corresponding matchup in the next round
        const correspondingMatchup = nextRound.getElementsByClassName('matchup')[Math.floor(currentMatchupIndex / 2)];

        // Based on whether the current matchup index is odd or even, select the appropriate box in the next round
        return currentMatchupIndex % 2 === 0 ? 
               correspondingMatchup.querySelector('.participants div:first-child:not(:has(span))') : 
               correspondingMatchup.querySelector('.participants div:last-child:not(:has(span))');
    }

    return null;
}



function findNextRoundSpotPreviouslyOccupiedBy(participant) {
    const round = participant.closest('.round').nextElementSibling;
    if (round) {
        return Array.from(round.querySelectorAll('.matchup .participants div'))
            .find(div => div.textContent.trim() === participant.textContent.trim());
    }
    return null;
}

function createParticipantDiv(name, matchupId, position) {
    const participant = document.createElement('div');
    participant.classList.add('participant');
    
    // Giving the participant an ID based on its parent matchup's ID and its position ('a' or 'b')
    participant.id = `${matchupId}-participant-${position}`;

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
    const participant2 = createParticipantDiv(participant2Name, matchupId, 'b');
    
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
    const bracketJSON = [];

    rounds.forEach((round, roundIndex) => {
        bracketJSON[roundIndex] = [];
        const matchups = round.querySelectorAll('.matchup');
        matchups.forEach((matchup, matchupIndex) => {
            const participants = matchup.querySelectorAll('.participant');
            const matchupJSON = {
                id: matchup.id,
                participants: [],
                winner: null
            };

            participants.forEach((participant, participantIndex) => {
                const participantObj = {
                    id: participant.id,
                    name: participant.textContent.trim(),
                    isSelected: participant.classList.contains('selected')
                };
                matchupJSON.participants.push(participantObj);

                if (participantObj.isSelected) {
                    matchupJSON.winner = participantObj.name;
                }
            });

            bracketJSON[roundIndex].push(matchupJSON);
        });
    });

    return bracketJSON;
}

function saveBracketToFirestore() {
    const bracketData = bracketToJSON();

        db.collection("tournaments").doc(tournamentId).set({
            bracket: bracketData
        })
        .then(() => {
            console.log("Bracket saved for tournament:", tournamentId);
        })
        .catch((error) => {
            console.error("Error saving bracket:", error);
        });
}

// Normalize participants and create the bracket
let normalizedParticipants = normalizeParticipants(participants);
createBracket(normalizedParticipants);

