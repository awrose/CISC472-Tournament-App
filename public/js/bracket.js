const participants = ["Uno", "Dos", "Tres", "Cuatro", "cinco", "seis", "siete", "ocho"]; // This list can be of any length

function createBracket(participants) {
    const bracket = document.createElement('div');
    bracket.classList.add('bracket');

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

    document.body.appendChild(bracket);
}

let lastSelected = {};

document.body.addEventListener('click', function(e) {
    console.log('a participant was clicked')
    if (e.target && e.target.parentElement.classList.contains('participant') && e.target.tagName === 'SPAN') {
        const participantDiv = e.target.parentElement;
        console.log(participantDiv.id);
        const clickedParticipant = e.target.parentElement;
        //console.log(clickedParticipant);
        const matchup = clickedParticipant.closest('.matchup');
        //console.log(matchup);

        // If another participant from this matchup was selected before, revert that selection
/*         console.log(lastSelected[matchup]);
        if (lastSelected[matchup] && lastSelected[matchup] !== clickedParticipant) {
            //console.log('calling reverting');
            //console.log('reverting');
            revertSelection(lastSelected[matchup]);
        } */ 
    
        console.log(lastSelected[matchup]);

/*         if(areInSameMatchup(clickedParticipant.id, lastSelected[matchup].id)){
            console.log('in the same matchup');
            revertSelection(lastSelected[matchup]);
        } */

        // Clear potential existing spot in the next round for the clicked participant
        const nextSpot = findNextRoundSpotPreviouslyOccupiedBy(clickedParticipant);
        //console.log(nextSpot);
        if (nextSpot) nextSpot.innerHTML = '';

        // Move the clicked participant to the next round
        if (moveToNextRound(clickedParticipant)) {
            // If moveToNextRound is successful, remember the current selection
            lastSelected[matchup] = clickedParticipant;
        }
    }
});

function areInSameMatchup(id1, id2) {
    // Extract the matchup part from the ID
    const matchupId1 = id1.substring(0, id1.lastIndexOf('-'));
    const matchupId2 = id2.substring(0, id2.lastIndexOf('-'));
    
    return matchupId1 === matchupId2;
}


function revertSelection(participant) {
    console.log('reverting')
    const nextRoundSpot = findNextRoundSpotPreviouslyOccupiedBy(participant);
    if (nextRoundSpot) {
        nextRoundSpot.innerHTML = '';  // Clear the spot
    }
}

//... other functions

function moveToNextRound(participant) {
    // First, clear the potential spot of any existing participant from the same matchup
    //clearNextRoundSpotOfSameMatchup(participant);
    
    // Then, move the current participant to the next round
    const nextRoundSpot = findNextAvailableRoundSpotFor(participant);
    if (nextRoundSpot && !nextRoundSpot.innerHTML.trim()) {
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

// Normalize participants and create the bracket
let normalizedParticipants = normalizeParticipants(participants);
createBracket(normalizedParticipants);

