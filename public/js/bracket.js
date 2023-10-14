/* // Sample registrants list
const registrants = ["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Hannah"];

// Function to shuffle an array (Fisher-Yates Shuffle)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Randomly shuffle registrants
const shuffledRegistrants = shuffle([...registrants]);

// Assign shuffled registrants to bracket slots
for (let i = 0; i < shuffledRegistrants.length; i++) {
  //document.getElementById(`player${i+1}`).textContent = shuffledRegistrants[i];
}

// Get all participants
const participants = document.querySelectorAll('.participant');

// Add click event listener to each participant
participants.forEach(participant => {
    participant.addEventListener('click', function() {
        // Remove any existing 'winner' class from sibling participants in the same matchup
        const siblings = Array.from(this.parentElement.children);
        siblings.forEach(sibling => sibling.classList.remove('winner'));

        // Add 'winner' class to clicked participant
        this.classList.add('winner');

        // Move to the next round - you'll need to design logic based on your bracket design
        moveToNextRound(this);
    });
});

function moveToNextRound(winner) {
    // Logic to move winner to the next round.
    // This can be complex depending on the structure and design of your bracket.
    // For simplicity, here's a basic example:

    const nextMatchup = winner.parentElement.parentElement.nextElementSibling;
    if (nextMatchup) {
        const nextParticipantSlot = nextMatchup.querySelector('.participant:not(.winner)');
        if (nextParticipantSlot) {
            nextParticipantSlot.innerText = winner.innerText; // Copy winner name
            // Copy any other necessary data, like scores, etc.
        }
    }
} */

// Sample participants list
// Sample list of participants
const participants = ['Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis', 'Siete', 'Ocho', 'Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis', 'Siete', 'Ocho'];

/*  function createMyBracket(participants){
    const bracket = document.querySelector('.bracket');

    let rounds = 0; 
    for(let i = participants.length; i > 1; i/=2){
        rounds++;
    }
    //console.log('ROUNDS' + rounds);

    let numberOfMatchups = participants.length/2;
    //console.log('number of matchups is: ' + numberOfMatchups);
    let participantCounter = 0;

    //this loop: creating a round
    for(let i = 0; i<rounds; i++){
        console.log('number of matchups is: ' + numberOfMatchups)
        const round = document.createElement('section');
        if(round == rounds-1){
            round.className = 'round finals'
        }else{
            round.className = `round round-${i}`;
        }
        //console.log('just created a round');

        //this loop: creating the winners
        for(let j = 0; Math.ceil(j<numberOfMatchups/2); j++){
            //console.log('in the first nested loop, j = '+ j);
            const winners = document.createElement('div');
            winners.className = 'winners'; 
            //console.log('just created winners!');
            //console.log('just created a div winners');
    
            const matchups = document.createElement('div');
            matchups.className = 'matchups';
            //console.log('just created matchups!');
            //console.log('just created a matchups div');
    
            //creating the matchup
            if(numberOfMatchups == 1){
                console.log('just creating 1');
                const matchup = document.createElement('div');
                matchup.className = 'matchup';
                console.log('just created a matchup');
                //console.log('just created a matchup div');
    
                const participantsDiv = document.createElement('div');
                participantsDiv.className = 'participants';
                //console.log('just created a participants div');
    
                //add participants
                for(let l = 0; l<2; l++){
                    //console.log('in the third inner loop, l = ' +l);
                    const participant = document.createElement('div');
                    participant.className = 'participant';
                    //console.log('just added a participant');

                    const span = document.createElement('span');
                    span.textContent = participants[participantCounter];
                    participantCounter++;

                    participant.appendChild(span);
    
                    participantsDiv.appendChild(participant);
                    //console.log('just appended participants with participants');
                }

                matchup.appendChild(participantsDiv);
                //console.log('just appended participants to matchup');
    
                matchups.appendChild(matchup);

            }else{
                console.log('looping')
                for(let k =0; k<2; k++){
                    //console.log('in the second inner loop, k =' + k);
                    const matchup = document.createElement('div');
                    matchup.className = 'matchup';
                    console.log('just created a matchup');
                    //console.log('just created a matchup div');
        
                    const participantsDiv = document.createElement('div');
                    participantsDiv.className = 'participants';
                    //console.log('just created a participants div');
        
                    //add participants
                    for(let l = 0; l<2; l++){
                        //console.log('in the third inner loop, l = ' +l);
                        const participant = document.createElement('div');
                        participant.className = 'participant';
                        //console.log('just added a participant');
    
                        const span = document.createElement('span');
                        span.textContent = participants[participantCounter];
                        participantCounter++;
    
                        participant.appendChild(span);
        
                        participantsDiv.appendChild(participant);
                        //console.log('just appended participants with participants');
                    }
    
                    matchup.appendChild(participantsDiv);
                    //console.log('just appended participants to matchup');
        
                    matchups.appendChild(matchup);
                    //console.log('just appended matchup to matchups');
                }
            }

            winners.append(matchups);

            const connector = document.createElement('div');
            connector.className = 'connector';
            const merger = document.createElement('div');
            merger.className='merger';
            const line = document.createElement('div');
            line.className = 'line';

            connector.append(merger);
            connector.append(line);

            winners.append(connector);
            round.appendChild(winners);
        }
        bracket.appendChild(round);
        numberOfMatchups = numberOfMatchups/2;
    }
} */

function createMyBracket(participants){
    const bracket = document.querySelector('.bracket');
    const rounds = Math.ceil(Math.log2(participants.length));
    let numberOfMatchups = participants.length / 2;

    let participantCounter = 0;

    for(let round = 1; round<= rounds; round++){
        const round = document.createElement('section');
        round.className = 'round round-' + round;

        for(let i = 0; i<numberOfMatchups; i++){

            const matchups = document.createElement('div');
            matchups.className = 'matchups';


        }
        numberOfMatchups /= 2;
    }

    //this loop: creating a round
    for(let i = 0; i<rounds; i++){
        console.log('number of matchups is: ' + numberOfMatchups)
        const round = document.createElement('section');
        if(round == rounds-1){
            round.className = 'round finals'
        }else{
            round.className = `round round-${i}`;
        }
        //console.log('just created a round');

        //this loop: creating the winners
        for(let j = 0; Math.ceil(j<numberOfMatchups/2); j++){
            //console.log('in the first nested loop, j = '+ j);
            const winners = document.createElement('div');
            winners.className = 'winners'; 
            //console.log('just created winners!');
            //console.log('just created a div winners');
    
            const matchups = document.createElement('div');
            matchups.className = 'matchups';
            //console.log('just created matchups!');
            //console.log('just created a matchups div');
    
            //creating the matchup
            if(numberOfMatchups == 1){
                console.log('just creating 1');
                const matchup = document.createElement('div');
                matchup.className = 'matchup';
                console.log('just created a matchup');
                //console.log('just created a matchup div');
    
                const participantsDiv = document.createElement('div');
                participantsDiv.className = 'participants';
                //console.log('just created a participants div');
    
                //add participants
                for(let l = 0; l<2; l++){
                    //console.log('in the third inner loop, l = ' +l);
                    const participant = document.createElement('div');
                    participant.className = 'participant';
                    //console.log('just added a participant');

                    const span = document.createElement('span');
                    span.textContent = participants[participantCounter];
                    participantCounter++;

                    participant.appendChild(span);
    
                    participantsDiv.appendChild(participant);
                    //console.log('just appended participants with participants');
                }

                matchup.appendChild(participantsDiv);
                //console.log('just appended participants to matchup');
    
                matchups.appendChild(matchup);

            }else{
                console.log('looping')
                for(let k =0; k<2; k++){
                    //console.log('in the second inner loop, k =' + k);
                    const matchup = document.createElement('div');
                    matchup.className = 'matchup';
                    console.log('just created a matchup');
                    //console.log('just created a matchup div');
        
                    const participantsDiv = document.createElement('div');
                    participantsDiv.className = 'participants';
                    //console.log('just created a participants div');
        
                    //add participants
                    for(let l = 0; l<2; l++){
                        //console.log('in the third inner loop, l = ' +l);
                        const participant = document.createElement('div');
                        participant.className = 'participant';
                        //console.log('just added a participant');
    
                        const span = document.createElement('span');
                        span.textContent = participants[participantCounter];
                        participantCounter++;
    
                        participant.appendChild(span);
        
                        participantsDiv.appendChild(participant);
                        //console.log('just appended participants with participants');
                    }
    
                    matchup.appendChild(participantsDiv);
                    //console.log('just appended participants to matchup');
        
                    matchups.appendChild(matchup);
                    //console.log('just appended matchup to matchups');
                }
            }

            winners.append(matchups);

            const connector = document.createElement('div');
            connector.className = 'connector';
            const merger = document.createElement('div');
            merger.className='merger';
            const line = document.createElement('div');
            line.className = 'line';

            connector.append(merger);
            connector.append(line);

            winners.append(connector);
            round.appendChild(winners);
        }
        bracket.appendChild(round);
        numberOfMatchups = numberOfMatchups/2;
    }
}

createMyBracket(participants); 

