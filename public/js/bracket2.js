const registrants = ["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Hannah"];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const shuffledRegistrants = shuffle([...registrants]);

function createBracket(participants) {
    const tournament = document.getElementById('tournament');
    const totalRounds = Math.ceil(Math.log2(participants.length));
    let matchups = participants.length / 2;

    for(let round = 1; round <= totalRounds; round++) {
        const ul = document.createElement('ul');
        ul.className = 'round round-' + round;

        for(let i = 0; i < matchups; i++) {
            const spacerTop = document.createElement('li');
            spacerTop.className = 'spacer';
            //spacerTop.innerHTML = '&nbsp';
            ul.appendChild(spacerTop);

            const gameTop = document.createElement('li');
            gameTop.className = 'game game-top';
            gameTop.textContent = participants[i*2];
            ul.appendChild(gameTop);

            const gameSpacer = document.createElement('li');
            gameSpacer.className = 'game game-spacer';
            //gameSpacer.className = '&nbsp';
            ul.appendChild(gameSpacer);

            const gameBottom = document.createElement('li');
            gameBottom.className = 'game game-bottom';
            gameBottom.textContent = participants[i*2 + 1];
            ul.appendChild(gameBottom);

            const spacerBottom = document.createElement('li');
            spacerBottom.className = 'spacer';
            //spacerBottom.innerHtml = '&nbsp';
            ul.appendChild(spacerBottom);
        }

        tournament.appendChild(ul);
        matchups /= 2;
    }
}

function moveToNextRound(winnerElement) {
    // Find the nearest ul.round to get the current round
    const currentRound = winnerElement.closest('.round');

    // If there's no next round, then this winner is the overall winner. We could potentially display an alert or do something else. For now, we just return.
    if (!currentRound.nextElementSibling) {
        alert(winnerElement.textContent + " is the overall winner!");
        return;
    }

    // Calculate the correct position in the next round for the winner
    const gameElementsInRound = Array.from(currentRound.querySelectorAll('.game-top, .game-bottom'));
    const winnerIndex = gameElementsInRound.indexOf(winnerElement);
    
    // Based on whether it's a top or bottom game, decide the position in next round
    const isTopGame = winnerElement.classList.contains('game-top');
    const nextRoundGameElements = Array.from(currentRound.nextElementSibling.querySelectorAll('.game-top, .game-bottom'));
    let nextPositionElement;
    if (isTopGame) {
        nextPositionElement = nextRoundGameElements[winnerIndex / 2];
    } else {
        nextPositionElement = nextRoundGameElements[(winnerIndex - 1) / 2];
    }

    // Move the winner to the next round
    nextPositionElement.textContent = winnerElement.textContent;
}

// Add click event to each game
const games = document.querySelectorAll('.game-top, .game-bottom');
games.forEach(game => {
    game.addEventListener('click', function() {
        console.log('i was clicked')
        // Move the clicked game (winner) to the next round
        moveToNextRound(this);
    });
});


//const participantsList = ['Lousville', 'NC A&T', 'Colo St', 'Missouri', 'Oklahoma St', 'Oregon', 'Saint Louis', 'New Mexico St', 'Memphis', 'St Mary\'s', 'Mich St', 'Valparaiso', 'Creighton', 'Cincinnati', 'Duke', 'Albany'];
createBracket(shuffledRegistrants);
